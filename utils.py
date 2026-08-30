import os
import re
import datetime
from db import query


def allowed_file(filename, allowed_exts):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_exts


def safe_filename(filename):
    """A minimal, dependency-free secure_filename-style sanitizer (Werkzeug's is also fine,
    this is kept explicit so the logic is auditable)."""
    filename = os.path.basename(filename)
    filename = re.sub(r"[^A-Za-z0-9_.\-]", "_", filename)
    return filename or "file"


def check_eligibility(student, drive):
    """
    Server-side eligibility engine.
    Returns (is_eligible: bool, reasons: list[str])
    A student must satisfy ALL criteria: branch match, min CGPA, max backlogs, deadline not passed.
    """
    reasons = []

    if drive["status"] != "active":
        reasons.append("This drive is no longer active.")

    deadline = drive["deadline"]
    if isinstance(deadline, str):
        try:
            deadline_date = datetime.date.fromisoformat(deadline)
        except ValueError:
            deadline_date = None
    else:
        deadline_date = deadline
    if deadline_date and datetime.date.today() > deadline_date:
        reasons.append(f"Application deadline ({deadline}) has passed.")

    if student["cgpa"] < drive["min_cgpa"]:
        reasons.append(
            f"Not eligible: Minimum CGPA required is {drive['min_cgpa']}, your CGPA is {student['cgpa']}."
        )

    if student["backlogs"] > drive["max_backlogs"]:
        reasons.append(
            f"Not eligible: Maximum {drive['max_backlogs']} backlog(s) allowed, you have {student['backlogs']}."
        )

    branches = [r["branch"] for r in query(
        "SELECT branch FROM drive_branches WHERE drive_id = ?", (drive["id"],)
    )]
    if branches and student["department"] not in branches:
        reasons.append(
            f"Not eligible: This drive is open to {', '.join(branches)}, your department is {student['department']}."
        )

    already_applied = query(
        "SELECT id FROM applications WHERE student_id = ? AND drive_id = ?",
        (student["id"], drive["id"]), one=True
    )
    if already_applied:
        reasons.append("You have already applied to this drive.")

    return (len(reasons) == 0, reasons)


def profile_completion_pct(student):
    if not student:
        return 0
    fields = [
        student["name"], student["phone"], student["department"], student["grad_year"],
        student["cgpa"], student["tenth_pct"], student["twelfth_pct"],
        student["soft_skills"], student["certifications"], student["projects"],
        student["resume_filename"],
    ]
    filled = sum(1 for f in fields if f not in (None, "", 0))
    skills = query("SELECT COUNT(*) as c FROM student_skills WHERE student_id = ?", (student["id"],), one=True)
    total_fields = len(fields) + 1
    filled += 1 if skills and skills["c"] > 0 else 0
    return round((filled / total_fields) * 100)


DEPARTMENTS = [
    "Computer Science", "Information Technology", "Electronics & Communication",
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
    "Chemical Engineering", "Biotechnology",
]

JOB_TYPES = ["Full-Time", "Internship", "Internship + PPO", "Part-Time"]
