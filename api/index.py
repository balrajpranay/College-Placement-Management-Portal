import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app

class VercelPathFixMiddleware:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get("PATH_INFO", "")
        # When Vercel rewrites routes to /api/index or /api/index.py
        if path_info in ["/api/index", "/api/index.py", "api/index.py"]:
            orig_uri = (
                environ.get("HTTP_X_MATCHED_PATH")
                or environ.get("RAW_URI")
                or environ.get("REQUEST_URI")
                or "/"
            )
            clean_path = orig_uri.split("?")[0]
            environ["PATH_INFO"] = clean_path if clean_path else "/"
        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)
handler = app
