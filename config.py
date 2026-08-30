import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env file if present
load_dotenv(os.path.join(BASE_DIR, ".env"))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "campus-connect-production-secret-key-2026")
    DATABASE_PATH = os.environ.get("DATABASE_PATH", os.path.join(BASE_DIR, "placement.db"))
    UPLOAD_FOLDER_RESUMES = os.environ.get("UPLOAD_FOLDER_RESUMES", os.path.join(BASE_DIR, "uploads", "resumes"))
    UPLOAD_FOLDER_LOGOS = os.environ.get("UPLOAD_FOLDER_LOGOS", os.path.join(BASE_DIR, "uploads", "logos"))
    ALLOWED_RESUME_EXTENSIONS = {"pdf", "doc", "docx"}
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "svg", "webp"}
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB max upload
    WTF_CSRF_TIME_LIMIT = None

    # Google Gemini AI Settings
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")

    # Job Aggregator Settings
    JOB_CACHE_TTL = int(os.environ.get("JOB_CACHE_TTL", 900))
