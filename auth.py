import functools
from flask import session, g, redirect, url_for, flash, request, abort
from db import get_db, query, execute


def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = query("SELECT * FROM users WHERE id = ?", (user_id,), one=True)


def login_required(view):
    @functools.wraps(view)
    def wrapped(*args, **kwargs):
        if g.user is None:
            flash("Please log in to continue.", "warning")
            return redirect(url_for("auth.login", next=request.path))
        return view(*args, **kwargs)
    return wrapped


def role_required(*roles):
    def decorator(view):
        @functools.wraps(view)
        def wrapped(*args, **kwargs):
            if g.user is None:
                flash("Please log in to continue.", "warning")
                return redirect(url_for("auth.login", next=request.path))
            if g.user["role"] not in roles:
                abort(403)
            return view(*args, **kwargs)
        return wrapped
    return decorator


def current_student():
    """Return the students row for the logged-in user, or None."""
    if g.user is None or g.user["role"] != "student":
        return None
    return query("SELECT * FROM students WHERE user_id = ?", (g.user["id"],), one=True)


def current_company():
    """Return the companies row for the logged-in user, or None."""
    if g.user is None or g.user["role"] != "recruiter":
        return None
    return query("SELECT * FROM companies WHERE user_id = ?", (g.user["id"],), one=True)


def notify(user_id, message, link=None):
    execute(
        "INSERT INTO notifications (user_id, message, link) VALUES (?, ?, ?)",
        (user_id, message, link),
    )


def unread_notification_count(user_id):
    row = query(
        "SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0",
        (user_id,), one=True
    )
    return row["c"] if row else 0
