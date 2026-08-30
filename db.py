import os
import sqlite3
from flask import g, current_app


def get_db():
    if "db" not in g:
        db_path = current_app.config["DATABASE_PATH"]
        if not os.path.exists(db_path):
            os.makedirs(os.path.dirname(db_path), exist_ok=True)
            schema_path = current_app.config.get("SCHEMA_PATH", os.path.join(os.path.dirname(__file__), "schema.sql"))
            con = sqlite3.connect(db_path)
            if os.path.exists(schema_path):
                with open(schema_path, "r", encoding="utf-8") as f:
                    con.executescript(f.read())
            con.commit()
            con.close()

        g.db = sqlite3.connect(db_path)
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
