import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, g, current_app, abort
from db import query, execute
from auth import role_required, current_company, notify
from utils import DEPARTMENTS, JOB_TYPES, allowed_file, safe_filename

bp = Blueprint("recruiter", __name__, url_prefix="/recruiter")


@bp.before_request
@role_required("recruiter")
def guard():
    pass


def _require_approved():
    company = current_company()
    if not company:
        abort(404)
    return company


@bp.route("/dashboard")
def dashboard():
    company = _require_approved()
    if not company["approved"]:
        return render_template("recruiter/pending_approval.html", company=company)

    active_drives = query(
        "SELECT COUNT(*) c FROM drives WHERE company_id=? AND status='active'", (company["id"],), one=True
    )["c"]
    total_applicants = query(
        """SELECT COUNT(*) c FROM applications a JOIN drives d ON d.id=a.drive_id WHERE d.company_id=?""",
        (company["id"],), one=True
    )["c"]
    shortlisted = query(
        """SELECT COUNT(*) c FROM applications a JOIN drives d ON d.id=a.drive_id
           WHERE d.company_id=? AND a.status IN ('Shortlisted','Interview Scheduled')""",
        (company["id"],), one=True
    )["c"]
    selected = query(
        """SELECT COUNT(*) c FROM placement_results pr
           JOIN applications a ON a.id = pr.application_id JOIN drives d ON d.id=a.drive_id
           WHERE d.company_id=? AND pr.status='Selected'""",
        (company["id"],), one=True
    )["c"]

    recent_drives = query(
        """SELECT d.*, (SELECT COUNT(*) FROM applications a WHERE a.drive_id=d.id) as applicant_count
           FROM drives d WHERE d.company_id=? ORDER BY d.created_at DESC LIMIT 5""",
        (company["id"],)
    )

    return render_template(
        "recruiter/dashboard.html", company=company, active_drives=active_drives,
        total_applicants=total_applicants, shortlisted=shortlisted, selected=selected, recent_drives=recent_drives
    )


@bp.route("/profile", methods=["GET", "POST"])
def profile():
    company = _require_approved()
    if request.method == "POST":
        form = request.form
        execute(
            """UPDATE companies SET name=?, industry=?, website=?, hr_contact=?, phone=?, location=?, description=?
               WHERE id=?""",
            (form.get("name"), form.get("industry"), form.get("website"), form.get("hr_contact"),
             form.get("phone"), form.get("location"), form.get("description"), company["id"]),
        )
        logo = request.files.get("logo")
        if logo and logo.filename:
            if allowed_file(logo.filename, current_app.config["ALLOWED_IMAGE_EXTENSIONS"]):
                fname = f"company_{company['id']}_{safe_filename(logo.filename)}"
                logo.save(os.path.join(current_app.config["UPLOAD_FOLDER_LOGOS"], fname))
                execute("UPDATE companies SET logo_filename=? WHERE id=?", (fname, company["id"]))
        flash("Company profile updated.", "success")
        return redirect(url_for("recruiter.profile"))
    company = _require_approved()
    return render_template("recruiter/profile.html", company=company)


@bp.route("/drives/create", methods=["GET", "POST"])
def create_drive():
    company = _require_approved()
    if not company["approved"]:
        return render_template("recruiter/pending_approval.html", company=company)

    if request.method == "POST":
        form = request.form
        errors = []
        try:
            ctc = float(form.get("ctc", 0) or 0)
            min_cgpa = float(form.get("min_cgpa", 0) or 0)
            max_backlogs = int(form.get("max_backlogs", 0) or 0)
            openings = int(form.get("openings", 1) or 1)
        except ValueError:
            errors.append("CTC, minimum CGPA, backlogs and openings must be numeric.")
            ctc = min_cgpa = max_backlogs = openings = 0

        title = form.get("title", "").strip()
        deadline = form.get("deadline", "")
        if not title:
            errors.append("Job title is required.")
        if not deadline:
            errors.append("Application deadline is required.")

        if errors:
            for e in errors:
                flash(e, "danger")
            return render_template("recruiter/create_drive.html", departments=DEPARTMENTS, job_types=JOB_TYPES, form=form)

        drive_id = execute(
            """INSERT INTO drives (company_id, title, description, ctc, location, job_type, min_cgpa,
               max_backlogs, openings, deadline, drive_date, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')""",
            (company["id"], title, form.get("description", ""), ctc, form.get("location", ""),
             form.get("job_type", "Full-Time"), min_cgpa, max_backlogs, openings, deadline,
             form.get("drive_date") or None),
        )
        branches = request.form.getlist("branches")
        for b in branches:
            execute("INSERT INTO drive_branches (drive_id, branch) VALUES (?, ?)", (drive_id, b))
        skills_raw = form.get("skills", "")
        for sk in [s.strip() for s in skills_raw.split(",") if s.strip()]:
            execute("INSERT INTO drive_skills (drive_id, skill) VALUES (?, ?)", (drive_id, sk))

        eligible_students = query(
            "SELECT user_id FROM students WHERE department IN ({})".format(
                ",".join("?" * len(branches))
            ) if branches else "SELECT user_id FROM students WHERE 1=0",
            branches
        )
        for s in eligible_students:
            notify(s["user_id"], f"New placement drive posted: {title} at {company['name']}.",
                   url_for("student.drive_detail", drive_id=drive_id))

        flash("Placement drive created successfully.", "success")
        return redirect(url_for("recruiter.my_drives"))

    return render_template("recruiter/create_drive.html", departments=DEPARTMENTS, job_types=JOB_TYPES, form={})


@bp.route("/drives")
def my_drives():
    company = _require_approved()
    drives = query(
        """SELECT d.*, (SELECT COUNT(*) FROM applications a WHERE a.drive_id=d.id) as applicant_count
           FROM drives d WHERE d.company_id=? ORDER BY d.created_at DESC""",
        (company["id"],)
    )
    return render_template("recruiter/my_drives.html", drives=drives)


@bp.route("/drives/<int:drive_id>/close", methods=["POST"])
def close_drive(drive_id):
    company = _require_approved()
    drive = query("SELECT * FROM drives WHERE id=? AND company_id=?", (drive_id, company["id"]), one=True)
    if not drive:
        abort(404)
    execute("UPDATE drives SET status='closed' WHERE id=?", (drive_id,))
    flash("Drive closed.", "success")
    return redirect(url_for("recruiter.my_drives"))


@bp.route("/applicants")
@bp.route("/drives/<int:drive_id>/applicants")
def applicants(drive_id=None):
    company = _require_approved()
    status_filter = request.args.get("status", "")

    sql = """SELECT a.*, s.name, s.student_no, s.department, s.cgpa, s.backlogs, s.id as student_id,
                     s.resume_filename, d.title as drive_title, d.id as drive_id
              FROM applications a JOIN students s ON s.id=a.student_id JOIN drives d ON d.id=a.drive_id
              WHERE d.company_id=?"""
    args = [company["id"]]
    if drive_id:
        sql += " AND d.id=?"
        args.append(drive_id)
    if status_filter:
        sql += " AND a.status=?"
        args.append(status_filter)
    sql += " ORDER BY a.applied_at DESC"
    apps = query(sql, args)

    drives = query("SELECT id, title FROM drives WHERE company_id=? ORDER BY created_at DESC", (company["id"],))
    return render_template(
        "recruiter/applicants.html", apps=apps, drives=drives, selected_drive=drive_id, status_filter=status_filter
    )


@bp.route("/applications/<int:app_id>/status", methods=["POST"])
def update_status(app_id):
    company = _require_approved()
    new_status = request.form.get("status")
    valid = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"]
    app_row = query(
        """SELECT a.*, d.company_id, d.title, s.user_id as student_user_id, s.name as student_name
           FROM applications a JOIN drives d ON d.id=a.drive_id JOIN students s ON s.id=a.student_id
           WHERE a.id=?""", (app_id,), one=True
    )
    if not app_row or app_row["company_id"] != company["id"] or new_status not in valid:
        abort(404)

    execute("UPDATE applications SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", (new_status, app_id))
    notify(app_row["student_user_id"], f"Your application for '{app_row['title']}' is now: {new_status}.",
           url_for("student.applications"))

    if new_status in ("Selected", "Rejected"):
        existing = query("SELECT id FROM placement_results WHERE application_id=?", (app_id,), one=True)
        if existing:
            execute("UPDATE placement_results SET status=?, updated_at=CURRENT_TIMESTAMP WHERE application_id=?",
                     (new_status, app_id))
        else:
            execute("INSERT INTO placement_results (application_id, status) VALUES (?, ?)", (app_id, new_status))

    flash(f"{app_row['student_name']}'s status updated to {new_status}.", "success")
    return redirect(request.referrer or url_for("recruiter.applicants"))


@bp.route("/interviews/schedule/<int:app_id>", methods=["GET", "POST"])
def schedule_interview(app_id):
    company = _require_approved()
    app_row = query(
        """SELECT a.*, d.company_id, d.title, s.user_id as student_user_id, s.name as student_name
           FROM applications a JOIN drives d ON d.id=a.drive_id JOIN students s ON s.id=a.student_id
           WHERE a.id=?""", (app_id,), one=True
    )
    if not app_row or app_row["company_id"] != company["id"]:
        abort(404)

    if request.method == "POST":
        form = request.form
        execute(
            """INSERT INTO interviews (application_id, scheduled_date, scheduled_time, interview_type, venue, round_name)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (app_id, form.get("scheduled_date"), form.get("scheduled_time"), form.get("interview_type", "Online"),
             form.get("venue", ""), form.get("round_name", "Round 1")),
        )
        execute("UPDATE applications SET status='Interview Scheduled', updated_at=CURRENT_TIMESTAMP WHERE id=?", (app_id,))
        notify(app_row["student_user_id"],
               f"Interview scheduled for '{app_row['title']}' on {form.get('scheduled_date')}.",
               url_for("student.interviews"))
        flash("Interview scheduled and candidate notified.", "success")
        return redirect(url_for("recruiter.applicants", drive_id=None) if False else url_for("recruiter.applicants"))

    return render_template("recruiter/schedule_interview.html", app_row=app_row)


@bp.route("/interviews")
def interview_schedule():
    company = _require_approved()
    items = query(
        """SELECT i.*, d.title as drive_title, s.name as student_name FROM interviews i
           JOIN applications a ON a.id=i.application_id JOIN drives d ON d.id=a.drive_id JOIN students s ON s.id=a.student_id
           WHERE d.company_id=? ORDER BY i.scheduled_date DESC""",
        (company["id"],)
    )
    return render_template("recruiter/interview_schedule.html", items=items)


@bp.route("/results")
def results():
    company = _require_approved()
    items = query(
        """SELECT pr.*, s.name as student_name, s.department, d.title FROM placement_results pr
           JOIN applications a ON a.id=pr.application_id JOIN students s ON s.id=a.student_id JOIN drives d ON d.id=a.drive_id
           WHERE d.company_id=? ORDER BY pr.updated_at DESC""",
        (company["id"],)
    )
    return render_template("recruiter/results.html", items=items)


@bp.route("/notifications")
def notifications():
    items = query("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC", (g.user["id"],))
    execute("UPDATE notifications SET is_read=1 WHERE user_id=?", (g.user["id"],))
    return render_template("recruiter/notifications.html", items=items)


@bp.route("/results/<int:app_id>/package", methods=["POST"])
def set_package(app_id):
    company = _require_approved()
    app_row = query(
        "SELECT a.*, d.company_id FROM applications a JOIN drives d ON d.id=a.drive_id WHERE a.id=?",
        (app_id,), one=True
    )
    if not app_row or app_row["company_id"] != company["id"]:
        abort(404)
    try:
        package = float(request.form.get("package", 0))
    except ValueError:
        flash("Package must be a number.", "danger")
        return redirect(request.referrer or url_for("recruiter.results"))

    placement_date = request.form.get("placement_date") or None
    existing = query("SELECT id FROM placement_results WHERE application_id=?", (app_id,), one=True)
    if existing:
        execute("UPDATE placement_results SET package=?, placement_date=?, updated_at=CURRENT_TIMESTAMP WHERE application_id=?",
                 (package, placement_date, app_id))
    else:
        execute("INSERT INTO placement_results (application_id, package, placement_date, status) VALUES (?, ?, ?, 'Selected')",
                 (app_id, package, placement_date))
    flash("Package details saved.", "success")
    return redirect(request.referrer or url_for("recruiter.results"))
