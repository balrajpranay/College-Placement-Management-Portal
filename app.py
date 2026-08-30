import os
from flask import Flask, g, render_template, session
import db as db_module
from auth import load_logged_in_user, unread_notification_count
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SCHEMA_PATH"] = os.path.join(os.path.dirname(__file__), "schema.sql")

    os.makedirs(app.config["UPLOAD_FOLDER_RESUMES"], exist_ok=True)
    os.makedirs(app.config["UPLOAD_FOLDER_LOGOS"], exist_ok=True)

    db_module.init_app(app)

    if not os.path.exists(app.config["DATABASE_PATH"]):
        db_module.init_db(app)

    @app.before_request
    def before():
        load_logged_in_user()

    @app.context_processor
    def inject_globals():
        notif_count = 0
        if g.get("user"):
            notif_count = unread_notification_count(g.user["id"])
        return {
            "current_user": g.get("user"),
            "unread_notif_count": notif_count,
            "theme": session.get("theme", "light"),
        }

    from routes.public_routes import bp as public_bp
    from routes.auth_routes import bp as auth_bp
    from routes.student_routes import bp as student_bp
    from routes.admin_routes import bp as admin_bp
    from routes.recruiter_routes import bp as recruiter_bp
    from routes.api_routes import bp as api_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(recruiter_bp)
    app.register_blueprint(api_bp)

    @app.errorhandler(403)
    def forbidden(e):
        return render_template("errors.html", code=403, message="You don't have permission to view this page."), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template("errors.html", code=404, message="Page not found."), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template("errors.html", code=500, message="Something went wrong on our end."), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
