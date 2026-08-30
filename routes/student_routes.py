import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, g, send_from_directory, current_app, abort
from db import query, execute
from auth import role_required, login_required, current_student, notify
from utils import check_eligibility, profile_completion_pct, allowed_file, safe_filename, DEPARTMENTS

bp = Blueprint("student", __name__, url_prefix="/student")


@bp.before_request
@role_required("student")
def guard():
    pass


@bp.route("/dashboard")
def dashboard():
    student = current_student()
    if not student:
        abort(404)

    app_count = query("SELECT COUNT(*) c FROM applications WHERE student_id = ?", (student["id"],), one=True)["c"]
    shortlisted = query(
        "SELECT COUNT(*) c FROM applications WHERE student_id = ? AND status IN ('Shortlisted','Interview Scheduled')",
        (student["id"],), one=True
    )["c"]
    selected = query(
        """SELECT d.title, c.name as company_name, pr.package, pr.placement_date
           FROM placement_results pr
           JOIN applications a ON a.id = pr.application_id
           JOIN drives d ON d.id = a.drive_id
           JOIN companies c ON c.id = d.company_id
           WHERE a.student_id = ? AND pr.status = 'Selected'""",
        (student["id"],)
    )

    upcoming_interviews = query(
        """SELECT i.*, d.title as drive_title, c.name as company_name FROM interviews i
           JOIN applications a ON a.id = i.application_id
           JOIN drives d ON d.id = a.drive_id
           JOIN companies c ON c.id = d.company_id
           WHERE a.student_id = ? AND i.status = 'Scheduled' AND date(i.scheduled_date) >= date('now')
           ORDER BY i.scheduled_date ASC LIMIT 5""",
        (student["id"],)
    )

    recent_notifications = query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", (g.user["id"],)
    )

    skills = query("SELECT skill FROM student_skills WHERE student_id = ?", (student["id"],))

    return render_template(
        "student/dashboard.html",
        student=student,
        completion=profile_completion_pct(student),
        app_count=app_count,
        shortlisted=shortlisted,
        selected=selected,
        upcoming_interviews=upcoming_interviews,
        recent_notifications=recent_notifications,
        skills=[s["skill"] for s in skills],
    )


@bp.route("/profile", methods=["GET", "POST"])
def profile():
    student = current_student()
    if not student:
        abort(404)

    if request.method == "POST":
        form = request.form
        try:
            cgpa = float(form.get("cgpa", 0) or 0)
            tenth = float(form.get("tenth_pct", 0) or 0)
            twelfth = float(form.get("twelfth_pct", 0) or 0)
            backlogs = int(form.get("backlogs", 0) or 0)
            grad_year = int(form.get("grad_year", student["grad_year"]) or student["grad_year"])
        except ValueError:
            flash("Please enter valid numbers for CGPA, percentages, backlogs and graduation year.", "danger")
            return redirect(url_for("student.profile"))

        execute(
            """UPDATE students SET name=?, phone=?, department=?, grad_year=?, cgpa=?, tenth_pct=?, twelfth_pct=?,
               backlogs=?, soft_skills=?, certifications=?, projects=?, internships=?, updated_at=CURRENT_TIMESTAMP
               WHERE id=?""",
            (form.get("name", student["name"]), form.get("phone", ""), form.get("department", student["department"]),
             grad_year, cgpa, tenth, twelfth, backlogs, form.get("soft_skills", ""), form.get("certifications", ""),
             form.get("projects", ""), form.get("internships", ""), student["id"]),
        )

        execute("DELETE FROM student_skills WHERE student_id = ?", (student["id"],))
        raw_skills = form.get("technical_skills", "")
        for sk in [s.strip() for s in raw_skills.split(",") if s.strip()]:
            execute("INSERT INTO student_skills (student_id, skill) VALUES (?, ?)", (student["id"], sk))

        resume_file = request.files.get("resume")
        if resume_file and resume_file.filename:
            if allowed_file(resume_file.filename, current_app.config["ALLOWED_RESUME_EXTENSIONS"]):
                fname = f"student_{student['id']}_{safe_filename(resume_file.filename)}"
                path = os.path.join(current_app.config["UPLOAD_FOLDER_RESUMES"], fname)
                resume_file.save(path)
                execute(
                    "UPDATE students SET resume_filename=?, resume_original_name=? WHERE id=?",
                    (fname, resume_file.filename, student["id"]),
                )
            else:
                flash("Resume must be a PDF, DOC or DOCX file.", "danger")

        flash("Profile updated successfully.", "success")
        return redirect(url_for("student.profile"))

    skills = query("SELECT skill FROM student_skills WHERE student_id = ?", (student["id"],))
    student = current_student()
    return render_template(
        "student/profile.html", student=student, departments=DEPARTMENTS,
        completion=profile_completion_pct(student), skills=", ".join(s["skill"] for s in skills)
    )


@bp.route("/resume/<int:student_id>")
def download_resume(student_id):
    student = query("SELECT * FROM students WHERE id = ?", (student_id,), one=True)
    if not student or not student["resume_filename"]:
        abort(404)
    if g.user["role"] == "student" and current_student()["id"] != student_id:
        abort(403)
    return send_from_directory(
        current_app.config["UPLOAD_FOLDER_RESUMES"], student["resume_filename"], as_attachment=False,
        download_name=student["resume_original_name"] or "resume.pdf"
    )


@bp.route("/drives")
def drives():
    student = current_student()
    search = request.args.get("q", "").strip()
    filter_eligible = request.args.get("eligible", "")

    sql = """SELECT d.*, c.name as company_name, c.logo_filename FROM drives d
              JOIN companies c ON c.id = d.company_id WHERE d.status = 'active'"""
    args = []
    if search:
        sql += " AND (d.title LIKE ? OR c.name LIKE ?)"
        args += [f"%{search}%", f"%{search}%"]
    sql += " ORDER BY d.deadline ASC"
    all_drives = query(sql, args)

    drives_with_eligibility = []
    for d in all_drives:
        is_eligible, reasons = check_eligibility(student, d)
        already_applied = query(
            "SELECT status FROM applications WHERE student_id=? AND drive_id=?", (student["id"], d["id"]), one=True
        )
        if filter_eligible == "1" and not is_eligible:
            continue
        drives_with_eligibility.append({
            "drive": d, "eligible": is_eligible, "reasons": reasons,
            "applied_status": already_applied["status"] if already_applied else None
        })

    return render_template("student/drives.html", items=drives_with_eligibility, search=search, filter_eligible=filter_eligible)


@bp.route("/drives/<int:drive_id>")
def drive_detail(drive_id):
    student = current_student()
    drive = query(
        """SELECT d.*, c.name as company_name, c.logo_filename, c.industry, c.description as company_desc
           FROM drives d JOIN companies c ON c.id = d.company_id WHERE d.id = ?""",
        (drive_id,), one=True
    )
    if not drive:
        abort(404)
    branches = [r["branch"] for r in query("SELECT branch FROM drive_branches WHERE drive_id=?", (drive_id,))]
    skills = [r["skill"] for r in query("SELECT skill FROM drive_skills WHERE drive_id=?", (drive_id,))]
    is_eligible, reasons = check_eligibility(student, drive)
    applied = query(
        "SELECT * FROM applications WHERE student_id=? AND drive_id=?", (student["id"], drive_id), one=True
    )
    return render_template(
        "student/drive_detail.html", drive=drive, branches=branches, skills=skills,
        eligible=is_eligible, reasons=reasons, applied=applied
    )


@bp.route("/drives/<int:drive_id>/apply", methods=["POST"])
def apply(drive_id):
    student = current_student()
    drive = query("SELECT * FROM drives WHERE id = ?", (drive_id,), one=True)
    if not drive:
        abort(404)
    is_eligible, reasons = check_eligibility(student, drive)
    if not is_eligible:
        flash("You are not eligible to apply: " + " ".join(reasons), "danger")
        return redirect(url_for("student.drive_detail", drive_id=drive_id))

    execute(
        "INSERT INTO applications (student_id, drive_id, status) VALUES (?, ?, 'Applied')",
        (student["id"], drive_id),
    )
    company = query("SELECT * FROM companies WHERE id = ?", (drive["company_id"],), one=True)
    notify(company["user_id"], f"{student['name']} applied to your drive '{drive['title']}'.",
           url_for("recruiter.applicants", drive_id=drive_id))
    flash(f"Application submitted for {drive['title']}!", "success")
    return redirect(url_for("student.applications"))


@bp.route("/applications")
def applications():
    student = current_student()
    apps = query(
        """SELECT a.*, d.title, d.ctc, c.name as company_name,
                  (SELECT scheduled_date FROM interviews i WHERE i.application_id = a.id
                   ORDER BY i.scheduled_date DESC LIMIT 1) as interview_date
           FROM applications a
           JOIN drives d ON d.id = a.drive_id
           JOIN companies c ON c.id = d.company_id
           WHERE a.student_id = ? ORDER BY a.applied_at DESC""",
        (student["id"],)
    )
    return render_template("student/applications.html", apps=apps)


@bp.route("/interviews")
def interviews():
    student = current_student()
    items = query(
        """SELECT i.*, d.title as drive_title, c.name as company_name FROM interviews i
           JOIN applications a ON a.id = i.application_id
           JOIN drives d ON d.id = a.drive_id
           JOIN companies c ON c.id = d.company_id
           WHERE a.student_id = ? ORDER BY i.scheduled_date DESC""",
        (student["id"],)
    )
    return render_template("student/interviews.html", items=items)


@bp.route("/status")
def placement_status():
    student = current_student()
    results = query(
        """SELECT pr.*, d.title, c.name as company_name FROM placement_results pr
           JOIN applications a ON a.id = pr.application_id
           JOIN drives d ON d.id = a.drive_id
           JOIN companies c ON c.id = d.company_id
           WHERE a.student_id = ?""",
        (student["id"],)
    )
    return render_template("student/status.html", results=results, student=student)


@bp.route("/notifications")
def notifications():
    items = query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", (g.user["id"],))
    execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (g.user["id"],))
    return render_template("student/notifications.html", items=items)


@bp.route("/applications/<int:application_id>/withdraw", methods=["POST"])
@login_required
@role_required("student")
def withdraw_application(application_id):
    student = current_student()
    if not student:
        flash("Student profile not found.", "danger")
        return redirect(url_for("student.applications"))

    app_record = query(
        "SELECT * FROM applications WHERE id=? AND student_id=?",
        (application_id, student["id"]),
        one=True
    )
    if not app_record:
        flash("Application not found or unauthorized.", "danger")
        return redirect(url_for("student.applications"))

    if app_record["status"] not in ["Applied", "Under Review"]:
        flash("Cannot withdraw an application that has already progressed in the review cycle.", "warning")
        return redirect(url_for("student.applications"))

    execute("DELETE FROM applications WHERE id=?", (application_id,))
    flash("Application successfully withdrawn.", "success")
    return redirect(url_for("student.applications"))
