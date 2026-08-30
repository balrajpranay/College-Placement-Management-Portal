import csv
import io
from flask import Blueprint, render_template, request, redirect, url_for, flash, g, abort, Response
from db import query, execute
from auth import role_required, notify
from utils import DEPARTMENTS

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.before_request
@role_required("admin")
def guard():
    pass


@bp.route("/dashboard")
def dashboard():
    total_students = query("SELECT COUNT(*) c FROM students", one=True)["c"]
    total_companies = query("SELECT COUNT(*) c FROM companies WHERE approved=1", one=True)["c"]
    active_drives = query("SELECT COUNT(*) c FROM drives WHERE status='active'", one=True)["c"]
    total_applications = query("SELECT COUNT(*) c FROM applications", one=True)["c"]
    placed = query("SELECT COUNT(DISTINCT student_id) c FROM applications a JOIN placement_results pr ON pr.application_id=a.id WHERE pr.status='Selected'", one=True)["c"]
    placement_pct = round((placed / total_students) * 100, 1) if total_students else 0
    avg_pkg_row = query("SELECT AVG(package) a FROM placement_results WHERE status='Selected'", one=True)
    avg_package = round(avg_pkg_row["a"], 2) if avg_pkg_row and avg_pkg_row["a"] else 0
    highest_pkg_row = query("SELECT MAX(package) m FROM placement_results WHERE status='Selected'", one=True)
    highest_package = highest_pkg_row["m"] if highest_pkg_row and highest_pkg_row["m"] else 0

    dept_placements = query(
        """SELECT s.department, COUNT(DISTINCT s.id) as placed FROM students s
           JOIN applications a ON a.student_id=s.id
           JOIN placement_results pr ON pr.application_id=a.id AND pr.status='Selected'
           GROUP BY s.department"""
    )
    monthly_apps = query(
        """SELECT strftime('%Y-%m', applied_at) as ym, COUNT(*) as c FROM applications
           GROUP BY ym ORDER BY ym"""
    )
    company_selections = query(
        """SELECT c.name, COUNT(*) as c FROM placement_results pr
           JOIN applications a ON a.id=pr.application_id JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id
           WHERE pr.status='Selected' GROUP BY c.name ORDER BY c DESC LIMIT 8"""
    )
    package_buckets = query(
        """SELECT CASE
             WHEN package < 5 THEN '<5 LPA'
             WHEN package < 10 THEN '5-10 LPA'
             WHEN package < 15 THEN '10-15 LPA'
             WHEN package < 20 THEN '15-20 LPA'
             ELSE '20+ LPA' END as bucket, COUNT(*) as c
           FROM placement_results WHERE status='Selected' AND package IS NOT NULL GROUP BY bucket"""
    )
    pending_companies = query("SELECT COUNT(*) c FROM companies WHERE approved=0", one=True)["c"]

    return render_template(
        "admin/dashboard.html",
        total_students=total_students, total_companies=total_companies, active_drives=active_drives,
        total_applications=total_applications, placed=placed, placement_pct=placement_pct,
        avg_package=avg_package, highest_package=highest_package, pending_companies=pending_companies,
        dept_placements=dept_placements, monthly_apps=monthly_apps,
        company_selections=company_selections, package_buckets=package_buckets,
    )


@bp.route("/students")
def students():
    search = request.args.get("q", "").strip()
    dept = request.args.get("department", "")
    min_cgpa = request.args.get("min_cgpa", "")
    max_cgpa = request.args.get("max_cgpa", "")
    page = max(int(request.args.get("page", 1)), 1)
    per_page = 10

    sql = "SELECT s.*, u.email, u.is_active FROM students s JOIN users u ON u.id=s.user_id WHERE 1=1"
    args = []
    if search:
        sql += " AND (s.name LIKE ? OR s.student_no LIKE ?)"
        args += [f"%{search}%", f"%{search}%"]
    if dept:
        sql += " AND s.department = ?"
        args.append(dept)
    if min_cgpa:
        sql += " AND s.cgpa >= ?"
        args.append(float(min_cgpa))
    if max_cgpa:
        sql += " AND s.cgpa <= ?"
        args.append(float(max_cgpa))

    all_rows = query(sql, args)
    total = len(all_rows)
    start = (page - 1) * per_page
    rows = all_rows[start:start + per_page]
    total_pages = max((total + per_page - 1) // per_page, 1)

    return render_template(
        "admin/students.html", students=rows, search=search, dept=dept, min_cgpa=min_cgpa, max_cgpa=max_cgpa,
        departments=DEPARTMENTS, page=page, total_pages=total_pages, total=total
    )


@bp.route("/students/<int:student_id>")
def student_detail(student_id):
    student = query("SELECT s.*, u.email FROM students s JOIN users u ON u.id=s.user_id WHERE s.id=?", (student_id,), one=True)
    if not student:
        abort(404)
    skills = query("SELECT skill FROM student_skills WHERE student_id=?", (student_id,))
    apps = query(
        """SELECT a.*, d.title, c.name as company_name FROM applications a
           JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id WHERE a.student_id=?""",
        (student_id,)
    )
    return render_template("admin/student_detail.html", student=student, skills=skills, apps=apps)


@bp.route("/students/<int:student_id>/toggle-active", methods=["POST"])
def toggle_student_active(student_id):
    student = query("SELECT * FROM students WHERE id=?", (student_id,), one=True)
    if not student:
        abort(404)
    user = query("SELECT * FROM users WHERE id=?", (student["user_id"],), one=True)
    execute("UPDATE users SET is_active=? WHERE id=?", (0 if user["is_active"] else 1, user["id"]))
    flash("Student account status updated.", "success")
    return redirect(request.referrer or url_for("admin.students"))


@bp.route("/students/<int:student_id>/delete", methods=["POST"])
def delete_student(student_id):
    student = query("SELECT * FROM students WHERE id=?", (student_id,), one=True)
    if not student:
        abort(404)
    execute("DELETE FROM users WHERE id=?", (student["user_id"],))
    flash("Student record deleted.", "success")
    return redirect(url_for("admin.students"))


@bp.route("/companies")
def companies():
    status = request.args.get("status", "")
    sql = "SELECT c.*, u.email, u.is_active FROM companies c JOIN users u ON u.id=c.user_id WHERE 1=1"
    args = []
    if status == "pending":
        sql += " AND c.approved=0"
    elif status == "approved":
        sql += " AND c.approved=1"
    sql += " ORDER BY c.created_at DESC"
    rows = query(sql, args)
    return render_template("admin/companies.html", companies=rows, status=status)


@bp.route("/companies/<int:company_id>")
def company_detail(company_id):
    company = query("SELECT c.*, u.email FROM companies c JOIN users u ON u.id=c.user_id WHERE c.id=?", (company_id,), one=True)
    if not company:
        abort(404)
    drives = query("SELECT * FROM drives WHERE company_id=? ORDER BY created_at DESC", (company_id,))
    return render_template("admin/company_detail.html", company=company, drives=drives)


@bp.route("/companies/<int:company_id>/approve", methods=["POST"])
def approve_company(company_id):
    company = query("SELECT * FROM companies WHERE id=?", (company_id,), one=True)
    if not company:
        abort(404)
    execute("UPDATE companies SET approved=1 WHERE id=?", (company_id,))
    notify(company["user_id"], "Your company account has been approved. You can now post placement drives.",
           url_for("recruiter.dashboard"))
    flash(f"{company['name']} approved.", "success")
    return redirect(request.referrer or url_for("admin.companies"))


@bp.route("/companies/<int:company_id>/reject", methods=["POST"])
def reject_company(company_id):
    company = query("SELECT * FROM companies WHERE id=?", (company_id,), one=True)
    if not company:
        abort(404)
    execute("UPDATE users SET is_active=0 WHERE id=?", (company["user_id"],))
    flash(f"{company['name']} registration rejected.", "success")
    return redirect(request.referrer or url_for("admin.companies"))


@bp.route("/companies/<int:company_id>/delete", methods=["POST"])
def delete_company(company_id):
    company = query("SELECT * FROM companies WHERE id=?", (company_id,), one=True)
    if not company:
        abort(404)
    execute("DELETE FROM users WHERE id=?", (company["user_id"],))
    flash("Company deleted.", "success")
    return redirect(url_for("admin.companies"))


@bp.route("/drives")
def drives():
    status = request.args.get("status", "")
    sql = """SELECT d.*, c.name as company_name,
             (SELECT COUNT(*) FROM applications a WHERE a.drive_id=d.id) as applicant_count
             FROM drives d JOIN companies c ON c.id=d.company_id WHERE 1=1"""
    args = []
    if status:
        sql += " AND d.status=?"
        args.append(status)
    sql += " ORDER BY d.created_at DESC"
    rows = query(sql, args)
    return render_template("admin/drives.html", drives=rows, status=status)


@bp.route("/drives/<int:drive_id>")
def drive_detail(drive_id):
    drive = query(
        "SELECT d.*, c.name as company_name FROM drives d JOIN companies c ON c.id=d.company_id WHERE d.id=?",
        (drive_id,), one=True
    )
    if not drive:
        abort(404)
    branches = [r["branch"] for r in query("SELECT branch FROM drive_branches WHERE drive_id=?", (drive_id,))]
    skills = [r["skill"] for r in query("SELECT skill FROM drive_skills WHERE drive_id=?", (drive_id,))]
    apps = query(
        """SELECT a.*, s.name, s.department, s.cgpa FROM applications a JOIN students s ON s.id=a.student_id
           WHERE a.drive_id=?""", (drive_id,)
    )
    return render_template("admin/drive_detail.html", drive=drive, branches=branches, skills=skills, apps=apps)


@bp.route("/applications")
def applications():
    status = request.args.get("status", "")
    search = request.args.get("q", "")
    sql = """SELECT a.*, s.name as student_name, s.department, d.title, c.name as company_name
              FROM applications a JOIN students s ON s.id=a.student_id
              JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id WHERE 1=1"""
    args = []
    if status:
        sql += " AND a.status=?"
        args.append(status)
    if search:
        sql += " AND (s.name LIKE ? OR d.title LIKE ? OR c.name LIKE ?)"
        args += [f"%{search}%"] * 3
    sql += " ORDER BY a.applied_at DESC LIMIT 300"
    rows = query(sql, args)
    return render_template("admin/applications.html", apps=rows, status=status, search=search)


@bp.route("/interviews")
def interviews():
    items = query(
        """SELECT i.*, s.name as student_name, d.title as drive_title, c.name as company_name FROM interviews i
           JOIN applications a ON a.id=i.application_id JOIN students s ON s.id=a.student_id
           JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id
           ORDER BY i.scheduled_date DESC"""
    )
    return render_template("admin/interviews.html", items=items)


@bp.route("/results")
def results():
    items = query(
        """SELECT pr.*, s.name as student_name, s.department, d.title, c.name as company_name FROM placement_results pr
           JOIN applications a ON a.id=pr.application_id JOIN students s ON s.id=a.student_id
           JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id
           ORDER BY pr.updated_at DESC"""
    )
    return render_template("admin/results.html", items=items)


@bp.route("/reports")
def reports():
    dept_stats = query(
        """SELECT s.department,
             COUNT(DISTINCT s.id) as total,
             COUNT(DISTINCT a.student_id) as applied,
             COUNT(DISTINCT CASE WHEN a.status IN ('Shortlisted','Interview Scheduled') THEN a.student_id END) as shortlisted,
             COUNT(DISTINCT CASE WHEN pr.status='Selected' THEN a.student_id END) as placed
           FROM students s
           LEFT JOIN applications a ON a.student_id=s.id
           LEFT JOIN placement_results pr ON pr.application_id=a.id
           GROUP BY s.department"""
    )
    company_hiring = query(
        """SELECT c.name, COUNT(*) as hires, AVG(pr.package) as avg_pkg FROM placement_results pr
           JOIN applications a ON a.id=pr.application_id JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id
           WHERE pr.status='Selected' GROUP BY c.name ORDER BY hires DESC"""
    )
    pkg_stats = query(
        "SELECT MAX(package) mx, MIN(package) mn, AVG(package) av FROM placement_results WHERE status='Selected'", one=True
    )
    return render_template("admin/reports.html", dept_stats=dept_stats, company_hiring=company_hiring, pkg_stats=pkg_stats)


@bp.route("/reports/export/students.csv")
def export_students_csv():
    rows = query("SELECT * FROM students ORDER BY name")
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student No", "Name", "Department", "Grad Year", "CGPA", "Backlogs"])
    for r in rows:
        writer.writerow([r["student_no"], r["name"], r["department"], r["grad_year"], r["cgpa"], r["backlogs"]])
    return Response(output.getvalue(), mimetype="text/csv",
                     headers={"Content-Disposition": "attachment;filename=students_report.csv"})


@bp.route("/reports/export/placements.csv")
def export_placements_csv():
    rows = query(
        """SELECT s.student_no, s.name, s.department, c.name as company_name, d.title, pr.package, pr.placement_date, pr.status
           FROM placement_results pr JOIN applications a ON a.id=pr.application_id JOIN students s ON s.id=a.student_id
           JOIN drives d ON d.id=a.drive_id JOIN companies c ON c.id=d.company_id"""
    )
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student No", "Name", "Department", "Company", "Role", "Package (LPA)", "Placement Date", "Status"])
    for r in rows:
        writer.writerow([r["student_no"], r["name"], r["department"], r["company_name"], r["title"],
                          r["package"], r["placement_date"], r["status"]])
    return Response(output.getvalue(), mimetype="text/csv",
                     headers={"Content-Disposition": "attachment;filename=placement_results.csv"})


@bp.route("/notifications")
def notifications():
    items = query("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC", (g.user["id"],))
    execute("UPDATE notifications SET is_read=1 WHERE user_id=?", (g.user["id"],))
    return render_template("admin/notifications.html", items=items)


@bp.route("/settings")
def settings():
    return render_template("admin/settings.html")
