"""
Seed script for the College Placement Management Portal.
Run with: python seed_data.py
Populates: 3 core users (admin + demo), 12 students, 6 companies, 6 drives,
applications across every status, interviews, notifications and placement results.
"""
import os
import sqlite3
import random
import datetime
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), "placement.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")


def reset_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(open(SCHEMA_PATH).read())
    conn.commit()
    return conn


def main():
    conn = reset_db()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    def insert(sql, args=()):
        cur.execute(sql, args)
        return cur.lastrowid

    # ---------------- Admin ----------------
    admin_user = insert(
        "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')",
        ("admin@college.edu", generate_password_hash("admin123")),
    )

    # ---------------- Students ----------------
    departments = [
        "Computer Science", "Information Technology", "Electronics & Communication",
        "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
        "Chemical Engineering", "Biotechnology",
    ]
    student_names = [
        "Priya Sharma", "Rahul Verma", "Ananya Iyer", "Karan Mehta", "Sneha Reddy",
        "Arjun Nair", "Divya Krishnan", "Vikram Singh", "Neha Gupta", "Aditya Rao",
        "Meera Pillai", "Rohan Kapoor",
    ]
    skills_pool = ["Python", "Java", "SQL", "React", "Node.js", "AWS", "Data Structures",
                   "Machine Learning", "C++", "Communication", "Leadership", "Docker",
                   "Django", "Excel", "AutoCAD", "MATLAB"]

    student_ids = []
    for i, name in enumerate(student_names):
        email = name.lower().replace(" ", ".") + "@student.edu"
        password = "student123"
        user_id = insert(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'student')",
            (email, generate_password_hash(password)),
        )
        dept = departments[i % len(departments)]
        cgpa = round(random.uniform(6.0, 9.6), 2)
        student_id = insert(
            """INSERT INTO students (user_id, student_no, name, phone, department, grad_year, cgpa,
               tenth_pct, twelfth_pct, backlogs, soft_skills, certifications, projects, internships)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (user_id, f"STU{1000+i}", name, f"9{random.randint(100000000,999999999)}", dept, 2026,
             cgpa, round(random.uniform(75, 96), 1), round(random.uniform(70, 95), 1),
             random.choice([0, 0, 0, 1, 2]),
             "Communication, Teamwork, Problem Solving",
             "AWS Cloud Practitioner; Coursera ML Specialization",
             "Built a full-stack placement portal; Developed an ML-based recommendation engine",
             "Summer intern at a fintech startup" if i % 3 == 0 else ""),
        )
        for sk in random.sample(skills_pool, k=4):
            insert("INSERT INTO student_skills (student_id, skill) VALUES (?, ?)", (student_id, sk))
        student_ids.append((student_id, user_id, dept, cgpa, name))

    # ---------------- Companies ----------------
    companies_data = [
        ("TechNova Solutions", "Software / IT", "https://technova.example.com", "Anita Rao", "hr@technova.com", "Bengaluru"),
        ("FinEdge Analytics", "FinTech", "https://finedge.example.com", "Suresh Kumar", "hr@finedge.com", "Mumbai"),
        ("BuildRight Infra", "Construction & Infra", "https://buildright.example.com", "Kavita Joshi", "hr@buildright.com", "Hyderabad"),
        ("GreenChem Industries", "Chemical Manufacturing", "https://greenchem.example.com", "Manoj Tiwari", "hr@greenchem.com", "Pune"),
        ("Zenith Cloud Systems", "Cloud / SaaS", "https://zenithcloud.example.com", "Ritu Malhotra", "hr@zenithcloud.com", "Remote"),
        ("Orbit Motors", "Automotive / Mechanical", "https://orbitmotors.example.com", "Deepak Nanda", "hr@orbitmotors.com", "Chennai"),
    ]
    company_ids = []
    for name, industry, website, hr, email, loc in companies_data:
        user_id = insert(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'recruiter')",
            (email, generate_password_hash("recruit123")),
        )
        company_id = insert(
            """INSERT INTO companies (user_id, name, industry, website, hr_contact, email, phone, location, description, approved)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
            (user_id, name, industry, website, hr, email, f"9{random.randint(100000000,999999999)}", loc,
             f"{name} is a leading player in the {industry} space, hiring top campus talent every year."),
        )
        company_ids.append((company_id, name, user_id))

    # One pending (unapproved) company for the admin approval workflow demo
    pending_user = insert(
        "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'recruiter')",
        ("hr@novastart.com", generate_password_hash("recruit123")),
    )
    insert(
        """INSERT INTO companies (user_id, name, industry, website, hr_contact, email, phone, location, description, approved)
           VALUES (?, 'NovaStart Labs', 'AI Startup', 'https://novastart.example.com', 'Ishaan Kapoor',
           'hr@novastart.com', '9876543210', 'Bengaluru', 'An early-stage AI startup building developer tools.', 0)""",
        (pending_user,),
    )

    # ---------------- Drives ----------------
    today = datetime.date.today()
    drives_data = [
        (company_ids[0], "Software Engineer - New Grad", 12.0, "Bengaluru", "Full-Time", 7.0, 1,
         ["Computer Science", "Information Technology"], ["Python", "React", "SQL"], 20, today + datetime.timedelta(days=14), today + datetime.timedelta(days=30)),
        (company_ids[1], "Data Analyst Intern", 6.5, "Mumbai", "Internship + PPO", 7.5, 0,
         ["Computer Science", "Information Technology", "Electronics & Communication"], ["SQL", "Excel", "Python"], 10, today + datetime.timedelta(days=10), today + datetime.timedelta(days=25)),
        (company_ids[2], "Site Engineer", 8.0, "Hyderabad", "Full-Time", 6.0, 2,
         ["Civil Engineering"], ["AutoCAD", "Communication"], 8, today + datetime.timedelta(days=20), today + datetime.timedelta(days=40)),
        (company_ids[3], "Process Engineer", 9.0, "Pune", "Full-Time", 6.5, 1,
         ["Chemical Engineering", "Biotechnology"], ["MATLAB", "Communication"], 6, today + datetime.timedelta(days=18), None),
        (company_ids[4], "Cloud Support Engineer", 10.0, "Remote", "Full-Time", 6.5, 1,
         ["Computer Science", "Information Technology", "Electronics & Communication"], ["AWS", "Docker", "Python"], 15, today + datetime.timedelta(days=25), today + datetime.timedelta(days=45)),
        (company_ids[5], "Design Engineer", 7.5, "Chennai", "Full-Time", 6.0, 2,
         ["Mechanical Engineering", "Electrical Engineering"], ["AutoCAD", "MATLAB"], 5, today - datetime.timedelta(days=5), today - datetime.timedelta(days=1)),
    ]
    drive_ids = []
    for (company_id, cname, cuser), title, ctc, loc, jtype, min_cgpa, max_bl, branches, skills, openings, deadline, drive_date in drives_data:
        status = "closed" if deadline < today else "active"
        drive_id = insert(
            """INSERT INTO drives (company_id, title, description, ctc, location, job_type, min_cgpa,
               max_backlogs, openings, deadline, drive_date, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (company_id, title, f"We are hiring for the {title} role. Great opportunity to work with a passionate team on impactful products.",
             ctc, loc, jtype, min_cgpa, max_bl, openings, deadline.isoformat(),
             drive_date.isoformat() if drive_date else None, status),
        )
        for b in branches:
            insert("INSERT INTO drive_branches (drive_id, branch) VALUES (?, ?)", (drive_id, b))
        for sk in skills:
            insert("INSERT INTO drive_skills (drive_id, skill) VALUES (?, ?)", (drive_id, sk))
        drive_ids.append((drive_id, title, ctc, company_id, cname, cuser, branches, min_cgpa, max_bl))

    # ---------------- Applications, Interviews, Notifications, Results ----------------
    statuses_cycle = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"]

    for drive_id, title, ctc, company_id, cname, cuser, branches, min_cgpa, max_bl in drive_ids:
        eligible_students = [s for s in student_ids if s[2] in branches and s[3] >= min_cgpa]
        applicants = random.sample(eligible_students, k=min(len(eligible_students), random.randint(3, 7)))
        for idx, (student_id, s_user_id, dept, cgpa, name) in enumerate(applicants):
            status = statuses_cycle[idx % len(statuses_cycle)]
            applied_days_ago = random.randint(3, 60)
            applied_at = (datetime.datetime.now() - datetime.timedelta(days=applied_days_ago)).strftime("%Y-%m-%d %H:%M:%S")
            app_id = insert(
                "INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (student_id, drive_id, status, applied_at, applied_at),
            )
            insert("INSERT INTO notifications (user_id, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?)",
                   (s_user_id, f"Your application for '{title}' is now: {status}.", "/student/applications",
                    random.choice([0, 1]), applied_at))
            insert("INSERT INTO notifications (user_id, message, link, is_read, created_at) VALUES (?, ?, ?, ?, ?)",
                   (cuser, f"{name} applied to your drive '{title}'.", "/recruiter/applicants", 1, applied_at))

            if status in ("Interview Scheduled", "Selected", "Rejected"):
                interview_date = (datetime.date.today() + datetime.timedelta(days=random.randint(-10, 15))).isoformat()
                insert(
                    """INSERT INTO interviews (application_id, scheduled_date, scheduled_time, interview_type, venue, round_name, status)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (app_id, interview_date, random.choice(["10:00 AM", "2:00 PM", "11:30 AM", "4:00 PM"]),
                     random.choice(["Online", "In-Person"]), "Google Meet link shared via email", "Technical Round",
                     "Completed" if status in ("Selected", "Rejected") else "Scheduled"),
                )

            if status in ("Selected", "Rejected"):
                package = round(ctc * random.uniform(0.9, 1.15), 1) if status == "Selected" else None
                placement_date = (datetime.date.today() - datetime.timedelta(days=random.randint(0, 20))).isoformat() if status == "Selected" else None
                insert(
                    "INSERT INTO placement_results (application_id, package, placement_date, status) VALUES (?, ?, ?, ?)",
                    (app_id, package, placement_date, status),
                )

    conn.commit()
    conn.close()
    print("Database seeded successfully:")
    print(f"  - {len(student_ids)} students")
    print(f"  - {len(companies_data) + 1} companies (1 pending approval)")
    print(f"  - {len(drives_data)} placement drives")
    print("  - Applications, interviews, notifications and results generated")
    print("\nDemo credentials:")
    print("  Admin:     admin@college.edu / admin123")
    print("  Student:   priya.sharma@student.edu / student123")
    print("  Recruiter: hr@technova.com / recruit123")


if __name__ == "__main__":
    main()
