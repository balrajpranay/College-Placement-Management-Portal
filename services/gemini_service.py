import os
import requests
import json
import logging
from flask import current_app

logger = logging.getLogger(__name__)

GEMINI_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemma-4-31b-it"
]

SYSTEM_PROMPTS = {
    "advisor": """You are "Campus Connect AI Career Advisor", a specialized placement strategist and career counselor for students and graduates.

Core Responsibilities:
- Guide candidates through on-campus placement drive eligibility (CGPA thresholds, active backlog limits, department branch qualification).
- Explain application stages (Applied -> Under Review -> Shortlisted -> Interview Scheduled -> Selected).
- Provide company-specific preparation strategies for top recruiters (TechNova, Infosys, TCS, L&T, Wipro, Amazon, Google).
- Guide users on national internship initiatives like the Prime Minister's Internship Scheme (PM Internship Scheme: 21-24 years age, Rs 5,000/mo stipend + Rs 6,000 grant, 12 months duration).
- Review and advise on resume tailoring, technical skills highlights, and placement timeline planning.

Tone: Professional, supportive, strategic, and practical. Use markdown formatting with bullet points and bold key terms.""",

    "tutor": """You are "Campus Connect AI Tutor & Interview Coach", an interactive technical tutor, coding instructor, and mock interview simulator.

Core Responsibilities:
- Explain Data Structures & Algorithms (Arrays, Linked Lists, Trees, Graphs, Dynamic Programming) with clean code examples in Python, Java, C++, or JavaScript.
- Conduct interactive mock technical and behavioral interviews (STAR method, system design, object-oriented design).
- Break down complex computer science concepts (DBMS, Operating Systems, Computer Networks, REST APIs, Cloud).
- If the user asks for a coding question or practice, give a realistic placement coding challenge with constraints, example inputs/outputs, and guide them through optimal time/space complexity.

Tone: Pedagogical, encouraging, clear, and structured with readable code blocks.""",

    "chat": """You are "Campus Connect AI Assistant", an intelligent, knowledgeable, and versatile conversational assistant.

Core Responsibilities:
- Answer both general-purpose questions (programming, technology trends, science, productivity, academic writing) and Campus Connect platform inquiries.
- Provide comprehensive, natural, and context-aware responses with high factual accuracy.
- Support multi-turn conversation continuity.

Tone: Friendly, articulate, engaging, and genuinely helpful."""
}

def dispatch_ai_query(mode="advisor", messages=None, user_context=None):
    if messages is None:
        messages = []

    # Instant response for simple greetings to maximize responsiveness
    if len(messages) == 1 and messages[0].get("role") in ["user", "human"]:
        raw_text = messages[0].get("content", "").strip().lower()
        if raw_text in ["hi", "hello", "hey", "hola", "namaste", "good morning", "good evening"]:
            greetings = {
                "advisor": "👋 **Hello! I'm your Campus Connect AI Career Advisor.**\n\nHow can I help you today? You can ask about:\n- **Drive Eligibility Rules** (CGPA & backlogs)\n- **PM Internship Scheme** details & stipends\n- **Resume Review** & tailoring strategies\n- **Company-Specific** placement prep",
                "tutor": "💻 **Hello! I'm your AI Technical Tutor & Interview Coach.**\n\nReady to level up your technical skills! We can practice:\n- **Data Structures & Algorithms** (Python/Java/C++)\n- **Mock Coding Challenges** with test cases\n- **Mock Behavioral Interviews** (STAR method)\n- **System Design & DBMS Fundamentals**",
                "chat": "💬 **Hello! I am your Campus Connect AI Assistant.**\n\nHow can I assist you with your career roadmaps, technology questions, or platform workflows today?"
            }
            return {
                "success": True,
                "mode": mode,
                "model": "instant-response",
                "response": greetings.get(mode, greetings["advisor"])
            }

    api_key = current_app.config.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return {
            "success": True,
            "mode": mode,
            "error": "Gemini API key is not configured.",
            "response": "Hello! The Google Gemini API key has not been configured in the server environment. Please add GEMINI_API_KEY to your .env file to enable live AI responses."
        }

    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["advisor"])
    
    context_prefix = ""
    if user_context:
        context_prefix = f"\n[User Profile: Name={user_context.get('name', 'Student')}, Role={user_context.get('role', 'Candidate')}, Dept={user_context.get('department', 'Engineering')}, CGPA={user_context.get('cgpa', 'N/A')}]\n"

    gemini_contents = []
    for idx, msg in enumerate(messages):
        role = "user" if msg.get("role") in ["user", "human"] else "model"
        text = msg.get("content", "").strip()
        if not text:
            continue
        
        if idx == 0 and role == "user":
            text = f"{system_prompt}{context_prefix}\n\nUser question: {text}"
            
        gemini_contents.append({
            "role": role,
            "parts": [{"text": text}]
        })

    if not gemini_contents:
        return {
            "success": True,
            "mode": mode,
            "response": "How can I assist you with your career, interview prep, or technical questions today?"
        }

    payload = {
        "contents": gemini_contents,
        "generationConfig": {
            "temperature": 0.7 if mode != "tutor" else 0.35,
            "maxOutputTokens": 1400,
            "topP": 0.95
        }
    }

    configured_model = current_app.config.get("GEMINI_MODEL", "gemini-3.5-flash")
    models_to_try = [configured_model] + [m for m in GEMINI_MODELS if m != configured_model]

    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=20)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return {
                            "success": True,
                            "mode": mode,
                            "model": model_name,
                            "response": parts[0]["text"].strip()
                        }
            else:
                last_error = f"Model {model_name} HTTP {res.status_code}: {res.text[:120]}"
                logger.warning(last_error)
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Error calling Gemini {model_name}: {e}")

    fallback_response = (
        "Here is what you need to know:\n\n"
        "- **Drive Eligibility**: Keep your CGPA above 7.0 and clear any active backlogs to unlock Tier-1 recruiter drives.\n"
        "- **PM Internship Scheme**: 12-month program with **₹5,000/month stipend + ₹6,000 grant** across top 500 companies for candidates aged 21–24.\n"
        "- **Technical Practice**: Explore [Jobs & Internships Hub](/jobs) for live openings and practice DSA core structures!"
    )
    return {
        "success": True,
        "mode": mode,
        "error": last_error,
        "response": fallback_response
    }
