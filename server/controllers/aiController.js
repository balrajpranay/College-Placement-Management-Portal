const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ChatSession = require('../models/ChatSession');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_connect_jwt_secret_dev_key';

// In-memory chat storage fallback for local dev / standalone mode per user ID
// userKey -> { advisor: [], tutor: [], chat: [] }
const userChatStore = new Map();

const getUserKey = (req) => {
  if (req.user && (req.user._id || req.user.id)) {
    return (req.user._id || req.user.id).toString();
  }
  // Try extracting from authorization header if present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        return decoded.id.toString();
      }
    } catch (e) {}
  }
  return 'demo_student_65e000000000000000000002';
};

const SYSTEM_PROMPTS = {
  advisor: `You are "Campus Connect AI Career Advisor", a specialized placement strategist and career counselor for students and graduates.
Core Responsibilities:
- Guide candidates through on-campus placement drive eligibility (CGPA thresholds, active backlog limits, department branch qualification).
- Explain application stages (Applied -> Under Review -> Shortlisted -> Interview Scheduled -> Selected).
- Provide company-specific preparation strategies for top recruiters (TechNova, Infosys, TCS, L&T, Wipro, Amazon, Google, Microsoft, Deloitte).
- Guide users on national internship initiatives like the Prime Minister's Internship Scheme (PM Internship Scheme: 21-24 years age, Rs 5,000/mo stipend + Rs 6,000 grant, 12 months duration).
- Review and advise on resume tailoring, technical skills highlights, and placement timeline planning.
Tone: Professional, supportive, strategic, and practical. Use markdown formatting with bullet points and bold key terms.`,

  tutor: `You are "Campus Connect AI Tutor & Interview Coach", an interactive technical tutor, coding instructor, and mock interview simulator.
Core Responsibilities:
- Explain Data Structures & Algorithms (Arrays, Linked Lists, Trees, Graphs, Dynamic Programming) with clean code examples in Python, Java, C++, or JavaScript.
- Conduct interactive mock technical and behavioral interviews (STAR method, system design, object-oriented design).
- Break down complex computer science concepts (DBMS, Operating Systems, Computer Networks, REST APIs, Cloud).
- If the user asks for a coding question or practice, give a realistic placement coding challenge with constraints, example inputs/outputs, and guide them through optimal time/space complexity.
Tone: Pedagogical, encouraging, clear, and structured with readable code blocks.`,

  chat: `You are "Campus Connect AI Assistant", an intelligent, knowledgeable, and versatile conversational assistant.
Core Responsibilities:
- Answer both general-purpose questions (programming, technology trends, science, productivity, academic writing) and Campus Connect platform inquiries.
- Provide comprehensive, natural, and context-aware responses with high factual accuracy.
- Support multi-turn conversation continuity.
Tone: Friendly, articulate, engaging, and genuinely helpful.`
};

const KNOWLEDGE_BASE = {
  eligibility: `🎯 **Placement Drive Eligibility Criteria on Campus Connect:**
* **CGPA Cutoffs**: Most Tier-1 tech firms (Google, Microsoft, Amazon) require **>= 8.0 CGPA**. Core & Mass IT firms (Infosys, TCS, Tech Mahindra) require **>= 7.0 CGPA**.
* **Active Backlogs**: Maximum allowed is typically **0 to 1 active backlog**. Zero backlogs is required for product MNCs.
* **Eligible Branches**: CS, IT, ECE, EEE, and allied branches for software tracks; ME/Civil for respective core tracks.
* **How to Check**: Visit **Placements & Jobs** to view real-time eligibility tags for your profile.`,

  pm_scheme: `🏛️ **Prime Minister's Internship Scheme (PM Internship Scheme):**
* **Target Scale**: 1 Crore internships across Top 500 partner enterprises over 5 years.
* **Duration**: 12 months hands-on industry internship.
* **Financial Stipend**: **₹5,000 / month** (₹4,500 Direct Benefit Transfer by Govt + ₹500 CSR contribution by company).
* **One-Time Grant**: **₹6,000 incidentals support grant** provided on commencement.
* **Age Eligibility**: Candidates aged **21 to 24 years** (not engaged in full-time employment).
* **Official Portal**: Directly accessible via our **Jobs & Internships Hub** or \`pminternship.mca.gov.in\`.`,

  mock_coding: `💻 **Placement Mock Coding Challenge:**

**Problem: Two Sum with Optimal Time Complexity**
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

\`\`\`python
def two_sum(nums, target):
    seen = {} # val -> index
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
\`\`\`

**Complexity:**
- **Time Complexity:** $O(n)$ using single-pass hash map.
- **Space Complexity:** $O(n)$ for storage.

Try implementing this with edge cases or let me know if you want to practice Binary Trees or Dynamic Programming!`,

  resume_tips: `📄 **3 Actionable Tips to Polish Your Placement Resume:**
1. **Quantify Your Impact**: Use the Google XYZ formula: *"Accomplished [X] as measured by [Y], by doing [Z]"* (e.g. *"Accelerated API response times by 35% by implementing Redis caching"*).
2. **Prioritize Relevant Skills**: Keep core technologies (Python, Java, React, SQL, AWS, Docker) at the top of your technical skills section.
3. **Live Project Links**: Always include working GitHub links and live demo URLs for at least 2 full-stack or systems projects.`
};

async function dispatchQuery(mode, messages, userContext) {
  const lastMsg = messages[messages.length - 1];
  const query = (lastMsg ? lastMsg.content : '').toLowerCase();

  // 1. Check instant knowledge base for common student topics
  if (query.includes('pm internship') || query.includes('stipend') || query.includes('pm scheme') || query.includes('pminternship')) {
    return { success: true, mode, response: KNOWLEDGE_BASE.pm_scheme };
  }
  if (query.includes('eligib') || query.includes('cutoff') || query.includes('criteria')) {
    return { success: true, mode, response: KNOWLEDGE_BASE.eligibility };
  }
  if (query.includes('mock') || query.includes('coding') || query.includes('dsa') || query.includes('problem') || query.includes('binary tree')) {
    return { success: true, mode, response: KNOWLEDGE_BASE.mock_coding };
  }
  if (query.includes('resume') || query.includes('cv') || query.includes('polish') || query.includes('ats')) {
    return { success: true, mode, response: KNOWLEDGE_BASE.resume_tips };
  }
  if (['hi', 'hello', 'hey', 'namaste'].some(g => query.trim() === g)) {
    const greetings = {
      advisor: `👋 **Hello! I'm your Campus Connect AI Career Advisor.**\n\nHow can I help you today? You can ask about:\n- **Drive Eligibility Rules** (CGPA & backlogs)\n- **PM Internship Scheme** details & stipends\n- **Resume Review** & tailoring strategies\n- **Company-Specific** placement prep`,
      tutor: `💻 **Hello! I'm your AI Technical Tutor & Interview Coach.**\n\nReady to practice technical topics! Ask me about:\n- **Data Structures & Algorithms**\n- **Mock Coding Challenges**\n- **System Design & DBMS Fundamentals**`,
      chat: `💬 **Hello! I am your Campus Connect AI Assistant.**\n\nHow can I assist you with career insights or technology topics today?`
    };
    return { success: true, mode, response: greetings[mode] || greetings.advisor };
  }

  // 2. If GEMINI_API_KEY is configured in env, call Google Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.advisor;
      const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const contents = messages.map((m, idx) => ({
        role: m.role === 'user' || m.role === 'human' ? 'user' : 'model',
        parts: [{ text: idx === 0 && m.role === 'user' ? `${systemPrompt}\n\nUser question: ${m.content}` : m.content }]
      }));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates && data.candidates[0];
        const text = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;
        if (text) {
          return { success: true, mode, response: text };
        }
      }
    } catch (e) {
      console.error('[Gemini AI Fetch Error]:', e);
    }
  }

  // 3. Fallback intelligent assistance
  const fallbacks = {
    advisor: `💡 **AI Career Advisor Guidance:**\n\nFor this topic, check our **Placements & Jobs** and **Internships & PM Scheme** sections for real-time cutoffs and application deadlines. Ensure your verified CGPA meets the institutional thresholds.`,
    tutor: `💻 **AI Technical Tutor Guidance:**\n\nStructure your approach by breaking the problem into sub-cases, defining inputs/outputs, and aiming for optimal $O(n)$ or $O(n \\log n)$ complexity.`,
    chat: `💬 **Campus Connect AI:**\n\nI am here to guide your career path and platform navigation. Feel free to ask about any placement or technical preparation topic!`
  };

  return { success: true, mode, response: fallbacks[mode] || fallbacks.advisor };
}

// Persistent Store Helper
async function saveMessagePair(userKey, mode, userMsg, botMsg) {
  // In-Memory store
  if (!userChatStore.has(userKey)) {
    userChatStore.set(userKey, { advisor: [], tutor: [], chat: [] });
  }
  const userStore = userChatStore.get(userKey);
  if (!userStore[mode]) userStore[mode] = [];
  userStore[mode].push({ role: 'user', content: userMsg, timestamp: new Date() });
  userStore[mode].push({ role: 'model', content: botMsg, timestamp: new Date() });

  // MongoDB persistent store if connected
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userKey)) {
    try {
      await ChatSession.findOneAndUpdate(
        { user: userKey, mode },
        {
          $push: {
            messages: {
              $each: [
                { role: 'user', content: userMsg, timestamp: new Date() },
                { role: 'model', content: botMsg, timestamp: new Date() }
              ]
            }
          },
          $set: { updatedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('[ChatSession] MongoDB save notice:', e.message);
    }
  }
}

// GET /api/ai/history
exports.getHistory = async (req, res) => {
  try {
    const userKey = getUserKey(req);
    const mode = req.query.mode;

    let histories = { advisor: [], tutor: [], chat: [] };

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userKey)) {
      try {
        const sessions = await ChatSession.find({ user: userKey });
        sessions.forEach(s => {
          histories[s.mode] = s.messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          }));
        });
      } catch (e) {}
    }

    // Merge or fallback with in-memory store
    if (userChatStore.has(userKey)) {
      const mem = userChatStore.get(userKey);
      ['advisor', 'tutor', 'chat'].forEach(m => {
        if ((!histories[m] || histories[m].length === 0) && mem[m]) {
          histories[m] = mem[m];
        }
      });
    }

    if (mode && histories[mode]) {
      return res.json({ success: true, mode, messages: histories[mode] });
    }

    return res.json({ success: true, histories });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/ai/history
exports.clearHistory = async (req, res) => {
  try {
    const userKey = getUserKey(req);
    const mode = req.query.mode;

    if (userChatStore.has(userKey)) {
      if (mode) {
        userChatStore.get(userKey)[mode] = [];
      } else {
        userChatStore.set(userKey, { advisor: [], tutor: [], chat: [] });
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userKey)) {
      if (mode) {
        await ChatSession.deleteOne({ user: userKey, mode });
      } else {
        await ChatSession.deleteMany({ user: userKey });
      }
    }

    return res.json({ success: true, message: 'Chat history cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.advisor = async (req, res) => {
  try {
    const userKey = getUserKey(req);
    const messages = req.body.messages || (req.body.message ? [{ role: 'user', content: req.body.message }] : []);
    const result = await dispatchQuery('advisor', messages, req.user);

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.content) {
      await saveMessagePair(userKey, 'advisor', lastUserMsg.content, result.response);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.tutor = async (req, res) => {
  try {
    const userKey = getUserKey(req);
    const messages = req.body.messages || (req.body.message ? [{ role: 'user', content: req.body.message }] : []);
    const result = await dispatchQuery('tutor', messages, req.user);

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.content) {
      await saveMessagePair(userKey, 'tutor', lastUserMsg.content, result.response);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const userKey = getUserKey(req);
    const mode = req.body.mode || 'chat';
    const messages = req.body.messages || (req.body.message ? [{ role: 'user', content: req.body.message }] : []);
    const result = await dispatchQuery(mode, messages, req.user);

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.content) {
      await saveMessagePair(userKey, mode, lastUserMsg.content, result.response);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.modes = async (req, res) => {
  res.json({
    modes: [
      { id: 'advisor', name: 'AI Career Advisor', tagline: 'Drive Eligibility & Placement Strategy', icon: 'award' },
      { id: 'tutor', name: 'AI Technical Tutor', tagline: 'DSA, Coding & Mock Interviews', icon: 'code' },
      { id: 'chat', name: 'AI Chat Assistant', tagline: 'General & Career Knowledge', icon: 'message-circle' }
    ]
  });
};
