import os
import shutil
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env file if present
load_dotenv(os.path.join(BASE_DIR, ".env"))

IS_VERCEL = bool(os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"))

if IS_VERCEL:
    TMP_DIR = "/tmp"
    DATABASE_PATH = os.path.join(TMP_DIR, "placement.db")
    UPLOAD_FOLDER_RESUMES = os.path.join(TMP_DIR, "uploads", "resumes")
    UPLOAD_FOLDER_LOGOS = os.path.join(TMP_DIR, "uploads", "logos")
    
    # Pre-seed placement.db into /tmp if not already present
    bundled_db = os.path.join(BASE_DIR, "placement.db")
    if os.path.exists(bundled_db) and not os.path.exists(DATABASE_PATH):
        try:
            shutil.copy2(bundled_db, DATABASE_PATH)
        except Exception:
            pass
else:
    DATABASE_PATH = os.environ.get("DATABASE_PATH", os.path.join(BASE_DIR, "placement.db"))
    UPLOAD_FOLDER_RESUMES = os.path.join(BASE_DIR, "uploads", "resumes")
    UPLOAD_FOLDER_LOGOS = os.path.join(BASE_DIR, "uploads", "logos")


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "campus-connect-production-secret-key-2026")
    DATABASE_PATH = DATABASE_PATH
    UPLOAD_FOLDER_RESUMES = UPLOAD_FOLDER_RESUMES
    UPLOAD_FOLDER_LOGOS = UPLOAD_FOLDER_LOGOS
    ALLOWED_RESUME_EXTENSIONS = {"pdf", "doc", "docx"}
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "svg", "webp"}
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB max upload
    WTF_CSRF_TIME_LIMIT = None

    # Google Gemini AI Settings
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")

    # Job Aggregator Settings
    JOB_CACHE_TTL = int(os.environ.get("JOB_CACHE_TTL", 900))
