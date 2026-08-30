"""
Lightweight database access layer built on Python's stdlib sqlite3.
No external ORM dependency is required (works offline / zero-install beyond Flask).
All SQL is written in a portable style (standard types, explicit FKs, parameterized
queries) so swapping the driver for MySQL/Postgres later is a config-level change,
not a rewrite of the query logic.
"""
import sqlite3
from flask import g, current_app


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE_PATH"])
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_app(app):
    app.teardown_appcontext(close_db)


def init_db(app):
    with app.app_context():
        db = get_db()
        with open(app.config.get("SCHEMA_PATH", "schema.sql")) as f:
            db.executescript(f.read())
        db.commit()


def query(sql, args=(), one=False):
    cur = get_db().execute(sql, args)
    rows = cur.fetchall()
    cur.close()
    return (rows[0] if rows else None) if one else rows


def execute(sql, args=()):
    db = get_db()
    cur = db.execute(sql, args)
    db.commit()
    last_id = cur.lastrowid
    cur.close()
    return last_id
