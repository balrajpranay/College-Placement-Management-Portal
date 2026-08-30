-- College Placement Management Portal - Database Schema
-- SQLite (written in DB-agnostic style: explicit FKs, standard types, no SQLite-only syntax)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('student','admin','recruiter')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_no VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    grad_year INTEGER NOT NULL,
    cgpa REAL NOT NULL DEFAULT 0,
    tenth_pct REAL,
    twelfth_pct REAL,
    backlogs INTEGER NOT NULL DEFAULT 0,
    soft_skills TEXT,
    certifications TEXT,
    projects TEXT,
    internships TEXT,
    resume_filename VARCHAR(255),
    resume_original_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    hr_contact VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(150),
    description TEXT,
    logo_filename VARCHAR(255),
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    ctc REAL NOT NULL DEFAULT 0,
    location VARCHAR(150),
    job_type VARCHAR(50) NOT NULL DEFAULT 'Full-Time',
    min_cgpa REAL NOT NULL DEFAULT 0,
    max_backlogs INTEGER NOT NULL DEFAULT 0,
    openings INTEGER NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    drive_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(status IN ('active','closed','cancelled')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drive_branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_id INTEGER NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    branch VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS drive_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drive_id INTEGER NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    drive_id INTEGER NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied' CHECK(status IN ('Applied','Under Review','Shortlisted','Interview Scheduled','Selected','Rejected')),
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, drive_id)
);

CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    interview_type VARCHAR(50) NOT NULL DEFAULT 'Online',
    venue VARCHAR(255),
    round_name VARCHAR(100) NOT NULL DEFAULT 'Round 1',
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled' CHECK(status IN ('Scheduled','Completed','Cancelled')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message VARCHAR(500) NOT NULL,
    link VARCHAR(255),
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placement_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    package REAL,
    placement_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Waiting' CHECK(status IN ('Waiting','Selected','Rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_drive ON applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_drives_company ON drives(company_id);
