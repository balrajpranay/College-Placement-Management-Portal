import json
from flask import Blueprint, jsonify, session, request, g
from db import query, execute
from auth import login_required, unread_notification_count
from services.gemini_service import dispatch_ai_query
from services.job_service import search_jobs, get_job_by_id, get_all_jobs

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/theme/toggle", methods=["POST"])
def toggle_theme():
    current = session.get("theme", "light")
    session["theme"] = "dark" if current == "light" else "light"
    return jsonify({"theme": session["theme"]})


@bp.route("/notifications/poll")
@login_required
def poll_notifications():
    user = dict(g.user)
    count = unread_notification_count(user["id"])
    latest = query(
        "SELECT id, message, link, is_read, created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 5",
        (user["id"],)
    )
    return jsonify({
        "count": count,
        "items": [dict(row) for row in latest]
    })


@bp.route("/notifications/<int:notif_id>/read", methods=["POST"])
@login_required
def mark_read(notif_id):
    user = dict(g.user)
    notif = query("SELECT * FROM notifications WHERE id=? AND user_id=? ", (notif_id, user["id"]), one=True)
    if notif:
        execute("UPDATE notifications SET is_read=1 WHERE id=?", (notif_id,))
    return jsonify({"ok": True})


# =========================================================================
# DEDICATED AI SUITE ENDPOINTS (Advisor, Tutor, General Chat)
# =========================================================================

def _extract_messages_and_context(data):
    messages = data.get("messages", [])
    if not messages:
        user_prompt = data.get("message", "").strip()
        if user_prompt:
            messages = [{"role": "user", "content": user_prompt}]

    user_context = None
    user_row = getattr(g, "user", None)
    if user_row:
        user_dict = dict(user_row)
        user_context = {
            "name": user_dict.get("email", "").split("@")[0],
            "role": user_dict.get("role", "Student")
        }
        if user_dict.get("role") == "student":
            st_info = query("SELECT * FROM students WHERE user_id=?", (user_dict.get("id"),), one=True)
            if st_info:
                st_dict = dict(st_info)
                user_context["name"] = st_dict.get("name", user_context["name"])
                user_context["department"] = st_dict.get("department", "")
                user_context["cgpa"] = st_dict.get("cgpa", "")

    return messages, user_context


@bp.route("/ai/advisor", methods=["POST"])
def ai_advisor():
    """AI Career Advisor: Placement eligibility, resume review, and recruiter strategy."""
    data = request.get_json() or {}
    messages, context = _extract_messages_and_context(data)
    if not messages:
        return jsonify({"success": False, "error": "No message provided."}), 400
    res = dispatch_ai_query(mode="advisor", messages=messages, user_context=context)
    return jsonify(res)


@bp.route("/ai/tutor", methods=["POST"])
def ai_tutor():
    """AI Technical Tutor: DSA explanations, coding problems, mock interview practice."""
    data = request.get_json() or {}
    messages, context = _extract_messages_and_context(data)
    if not messages:
        return jsonify({"success": False, "error": "No message provided."}), 400
    res = dispatch_ai_query(mode="tutor", messages=messages, user_context=context)
    return jsonify(res)


@bp.route("/ai/chat", methods=["POST"])
@bp.route("/chat", methods=["POST"])
def ai_general_chat():
    """General AI Chatbot: Supports platform inquiries and general conversations."""
    data = request.get_json() or {}
    mode = data.get("mode", "chat")
    messages, context = _extract_messages_and_context(data)
    if not messages:
        return jsonify({"success": False, "error": "No message provided."}), 400
    res = dispatch_ai_query(mode=mode, messages=messages, user_context=context)
    return jsonify(res)


@bp.route("/ai/modes", methods=["GET"])
def ai_modes():
    """Returns available AI suite personas and configuration."""
    return jsonify({
        "modes": [
            {
                "id": "advisor",
                "name": "AI Career Advisor",
                "tagline": "Drive Eligibility & Placement Strategy",
                "icon": "award"
            },
            {
                "id": "tutor",
                "name": "AI Technical Tutor",
                "tagline": "DSA, Coding & Mock Interviews",
                "icon": "code"
            },
            {
                "id": "chat",
                "name": "AI Chat Assistant",
                "tagline": "General & Career Knowledge",
                "icon": "message-circle"
            }
        ]
    })


# =========================================================================
# LIVE JOBS & INTERNSHIPS AGGREGATOR ENDPOINTS
# =========================================================================
@bp.route("/jobs", methods=["GET"])
def get_jobs_api():
    q_str = request.args.get("q", "")
    category = request.args.get("category", "")
    work_mode = request.args.get("work_mode", "")
    job_type = request.args.get("job_type", "")
    experience = request.args.get("experience", "")
    limit = min(int(request.args.get("limit", 20)), 100)
    offset = max(int(request.args.get("offset", 0)), 0)

    result = search_jobs(
        query_str=q_str,
        category=category,
        work_mode=work_mode,
        job_type=job_type,
        experience=experience,
        limit=limit,
        offset=offset
    )
    return jsonify(result)


@bp.route("/jobs/<job_id>", methods=["GET"])
def get_job_detail_api(job_id):
    job = get_job_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify({"job": job})


@bp.route("/jobs/filters", methods=["GET"])
def get_job_filters_api():
    all_jobs = get_all_jobs()
    categories = {}
    work_modes = {}
    job_types = {}

    for j in all_jobs:
        cat = j.get("category", "General")
        wm = j.get("work_mode", "Onsite")
        jt = j.get("job_type", "Full-time")

        categories[cat] = categories.get(cat, 0) + 1
        work_modes[wm] = work_modes.get(wm, 0) + 1
        job_types[jt] = job_types.get(jt, 0) + 1

    return jsonify({
        "categories": [{"name": k, "count": v} for k, v in sorted(categories.items())],
        "work_modes": [{"name": k, "count": v} for k, v in sorted(work_modes.items())],
        "job_types": [{"name": k, "count": v} for k, v in sorted(job_types.items())],
        "total_jobs": len(all_jobs)
    })
