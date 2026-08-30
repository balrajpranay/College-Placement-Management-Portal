from flask import Blueprint, render_template, request, redirect, url_for, session, flash, g
from werkzeug.security import generate_password_hash, check_password_hash
from db import query, execute
from utils import DEPARTMENTS

bp = Blueprint("auth", __name__, url_prefix="/auth")


def _home_for_role(role):
    return {
        "student": "student.dashboard",
        "admin": "admin.dashboard",
        "recruiter": "recruiter.dashboard",
    }.get(role, "public.landing")


@bp.route("/login", methods=["GET", "POST"])
def login():
    if g.user:
        return redirect(url_for(_home_for_role(g.user["role"])))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        role = request.form.get("role", "student")

        error = None
        user = query("SELECT * FROM users WHERE email = ?", (email,), one=True)

        if user is None or not check_password_hash(user["password_hash"], password):
            error = "Invalid email or password."
        elif user["role"] != role:
            error = f"This account is not registered as a {role}. Please choose the correct role."
        elif not user["is_active"]:
            error = "This account has been deactivated. Contact the placement office."

        if error:
            flash(error, "danger")
            return render_template("auth/login.html", role=role, email=email)

        session.clear()
        session["user_id"] = user["id"]
        flash(f"Welcome back, you're logged in as {user['role']}.", "success")
        next_url = request.args.get("next")
        return redirect(next_url or url_for(_home_for_role(user["role"])))

    role = request.args.get("role", "student")
    return render_template("auth/login.html", role=role, email="")


@bp.route("/register/student", methods=["GET", "POST"])
def register_student():
    if g.user:
        return redirect(url_for(_home_for_role(g.user["role"])))

    if request.method == "POST":
        form = request.form
        errors = []
        email = form.get("email", "").strip().lower()
        password = form.get("password", "")
        confirm = form.get("confirm_password", "")
        name = form.get("name", "").strip()
        student_no = form.get("student_no", "").strip()
        department = form.get("department", "")
        grad_year = form.get("grad_year", "")
        cgpa = form.get("cgpa", "0")

        if not email or "@" not in email:
            errors.append("A valid email is required.")
        if len(password) < 6:
            errors.append("Password must be at least 6 characters.")
        if password != confirm:
            errors.append("Passwords do not match.")
        if not name:
            errors.append("Full name is required.")
        if not student_no:
            errors.append("Student ID is required.")
        if query("SELECT id FROM users WHERE email = ?", (email,), one=True):
            errors.append("An account with this email already exists.")
        if query("SELECT id FROM students WHERE student_no = ?", (student_no,), one=True):
            errors.append("This Student ID is already registered.")

        try:
            cgpa_val = float(cgpa)
            grad_year_val = int(grad_year)
        except ValueError:
            errors.append("CGPA and Graduation Year must be numeric.")
            cgpa_val, grad_year_val = 0, 2026

        if errors:
            for e in errors:
                flash(e, "danger")
            return render_template("auth/register_student.html", departments=DEPARTMENTS, form=form)

        user_id = execute(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'student')",
            (email, generate_password_hash(password)),
        )
        execute(
            """INSERT INTO students (user_id, student_no, name, department, grad_year, cgpa)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (user_id, student_no, name, department, grad_year_val, cgpa_val),
        )
        flash("Registration successful! Please log in to complete your profile.", "success")
        return redirect(url_for("auth.login", role="student"))

    return render_template("auth/register_student.html", departments=DEPARTMENTS, form={})


@bp.route("/register/company", methods=["GET", "POST"])
def register_company():
    if g.user:
        return redirect(url_for(_home_for_role(g.user["role"])))

    if request.method == "POST":
        form = request.form
        errors = []
        email = form.get("email", "").strip().lower()
        password = form.get("password", "")
        confirm = form.get("confirm_password", "")
        name = form.get("name", "").strip()
        hr_contact = form.get("hr_contact", "").strip()

        if not email or "@" not in email:
            errors.append("A valid email is required.")
        if len(password) < 6:
            errors.append("Password must be at least 6 characters.")
        if password != confirm:
            errors.append("Passwords do not match.")
        if not name:
            errors.append("Company name is required.")
        if not hr_contact:
            errors.append("HR contact person name is required.")
        if query("SELECT id FROM users WHERE email = ?", (email,), one=True):
            errors.append("An account with this email already exists.")

        if errors:
            for e in errors:
                flash(e, "danger")
            return render_template("auth/register_company.html", form=form)

        user_id = execute(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'recruiter')",
            (email, generate_password_hash(password)),
        )
        execute(
            """INSERT INTO companies (user_id, name, industry, website, hr_contact, email, phone, location, description, approved)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)""",
            (user_id, name, form.get("industry", ""), form.get("website", ""), hr_contact,
             email, form.get("phone", ""), form.get("location", ""), form.get("description", "")),
        )
        flash("Registration submitted! Your account is pending approval from the placement office.", "success")
        return redirect(url_for("auth.login", role="recruiter"))

    return render_template("auth/register_company.html", form={})


@bp.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("public.landing"))
