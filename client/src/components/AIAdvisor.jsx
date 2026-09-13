import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { aiQueryApi, getAiHistoryApi, clearAiHistoryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AIAdvisor() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('advisor');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [histories, setHistories] = useState({
    advisor: [],
    tutor: [],
    chat: []
  });

  const messagesEndRef = useRef(null);

  const modeGreetings = {
    advisor: '👋 <strong>Campus Connect AI Advisor Active.</strong> Ask me about placement drives, eligibility criteria, or the PM Internship Scheme!',
    tutor: '💻 <strong>Technical Tutor Active.</strong> Ready to practice DSA problems, mock interviews, or explain CS concepts!',
    chat: '💬 <strong>AI Assistant Active.</strong> Ask me anything regarding programming, career paths, or general inquiries!'
  };

  const headerTitles = {
    advisor: 'AI Career Advisor',
    tutor: 'AI Technical Tutor',
    chat: 'AI Chat Assistant'
  };

  const starterChips = [
    { label: 'Check Drive Eligibility', prompt: 'How do I check my placement drive eligibility?' },
    { label: 'PM Internship Scheme', prompt: 'Explain the PM Internship Scheme stipend and eligibility.' },
    { label: 'Mock Coding Question', prompt: 'Give me a mock interview coding question with constraints.' },
    { label: 'Resume Polish Tips', prompt: 'Give me 3 actionable tips to improve my resume.' }
  ];

  // Load persistent conversation history from Express backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAiHistoryApi();
        if (res && res.histories) {
          setHistories(res.histories);
        }
      } catch (err) {
        console.warn('[AIAdvisor] Could not load stored chat history:', err.message);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, histories, mode, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');

    const currentHistory = histories[mode] || [];
    const updatedHistory = [...currentHistory, { role: 'user', content: text, timestamp: new Date().toISOString() }];

    setHistories(prev => ({
      ...prev,
      [mode]: updatedHistory
    }));

    setIsTyping(true);

    try {
      const res = await aiQueryApi(mode, updatedHistory);
      const botResponse = res.response || 'I am here to support your placement journey.';

      setHistories(prev => ({
        ...prev,
        [mode]: [
          ...prev[mode],
          { role: 'model', content: botResponse, timestamp: new Date().toISOString() }
        ]
      }));
    } catch (err) {
      setHistories(prev => ({
        ...prev,
        [mode]: [
          ...prev[mode],
          { role: 'model', content: 'Sorry, a connection issue occurred. Please try again.', timestamp: new Date().toISOString() }
        ]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearAiHistoryApi(mode);
    } catch (e) {}

    setHistories(prev => ({
      ...prev,
      [mode]: []
    }));
  };

  const formatText = (text) => {
    if (!text) return '';
    let formatted = text;
    // Replace code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 0.8rem; margin: 6px 0; border: 1px solid var(--border-subtle);"><code>$1</code></pre>');
    // Replace inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.25); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.88em;">$1</code>');
    // Replace headings
    formatted = formatted.replace(/^#### (.*?)$/gm, '<h5 style="margin: 10px 0 4px; font-weight: 700; color: var(--brand-500, #0096FF);">$1</h5>');
    formatted = formatted.replace(/^### (.*?)$/gm, '<h4 style="margin: 12px 0 4px; font-weight: 700; font-size: 0.95rem; color: var(--text-main);">$1</h4>');
    formatted = formatted.replace(/^## (.*?)$/gm, '<h3 style="margin: 14px 0 6px; font-weight: 800; font-size: 1.05rem; color: var(--text-main); border-bottom: 1px solid var(--border-subtle); padding-bottom: 2px;">$1</h3>');
    // Replace bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace bullet points
    formatted = formatted.replace(/^\* (.*?)$/gm, '<li style="margin-left: 16px; list-style-type: disc;">$1</li>');
    formatted = formatted.replace(/^- (.*?)$/gm, '<li style="margin-left: 16px; list-style-type: disc;">$1</li>');
    // Replace newlines
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  const [minimized, setMinimized] = useState(false);

  return (
    <div id="campus-chatbot-widget" className="chatbot-widget">
      {/* Floating Trigger Button */}
      {minimized ? (
        <button
          className="chatbot-trigger-btn minimized"
          aria-label="Open Campus Connect AI Advisor"
          title="Click to open AI Career Advisor (Minimized)"
          onClick={() => {
            setMinimized(false);
            setIsOpen(true);
          }}
          style={{ width: 44, height: 44, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="chatbot-trigger-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
              <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
            </svg>
          </div>
          <span className="chatbot-status-pulse" title="Gemini AI Online"></span>
        </button>
      ) : (
        <button
          id="chatbot-toggle-btn"
          className={`chatbot-trigger-btn ${isOpen ? 'active' : ''}`}
          aria-label="Open Campus Connect AI Advisor"
          title="Campus Connect AI Career Advisor"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="chatbot-trigger-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
              <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
            </svg>
          </div>
          <span className="chatbot-trigger-label">AI Advisor</span>
          <span className="chatbot-status-pulse" title="Gemini AI Online"></span>
          <span
            className="chatbot-pill-dismiss"
            title="Minimize pill"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            style={{
              marginLeft: 4,
              opacity: 0.7,
              fontSize: '0.75rem',
              lineHeight: 1,
              padding: '2px 5px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </span>
        </button>
      )}

      {/* Floating Chatbot Modal Window */}
      <div id="chatbot-modal" className={`chatbot-modal ${isOpen ? 'active' : ''}`} aria-hidden={!isOpen}>
        <div className="chatbot-header">
          <div className="flex-align-center" style={{ gap: 10 }}>
            <div className="chatbot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <div className="chatbot-title" id="chatbot-header-title">{headerTitles[mode]}</div>
              <div className="chatbot-subtitle">
                <span className="chatbot-dot"></span> Powered by Google Gemini
              </div>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <Link to="/ai-suite" className="chatbot-icon-btn" title="Open Full AI Suite" aria-label="Open Full AI Suite">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </Link>
            <button id="chatbot-clear-btn" className="chatbot-icon-btn" title="Clear chat" aria-label="Clear chat" onClick={handleClear}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button id="chatbot-close-btn" className="chatbot-icon-btn" title="Close chat" aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Starter Chips */}
        <div id="chatbot-starter-chips" className="chatbot-chips-bar">
          {starterChips.map((chip, idx) => (
            <button key={idx} className="chat-chip" onClick={() => handleSendMessage(chip.prompt)}>
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div id="chatbot-messages" className="chatbot-messages-body">
          <div className="chat-msg chat-msg-bot">
            <div className="chat-msg-bubble" dangerouslySetInnerHTML={{ __html: modeGreetings[mode] }} />
            <div className="chat-msg-time">Just now</div>
          </div>

          {(histories[mode] || []).map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
              <div className="chat-msg-bubble" dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
              <div className="chat-msg-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))}

          {isTyping && (
            <div id="chatbot-typing" className="chatbot-typing" style={{ display: 'flex' }}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <span className="text-xs text-muted" style={{ marginLeft: 6 }}>Gemini AI is analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Form */}
        <form
          id="chatbot-form"
          className="chatbot-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            id="chatbot-input"
            className="chatbot-input"
            placeholder="Ask your AI Career Advisor..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoComplete="off"
            required
          />
          <button type="submit" id="chatbot-send-btn" className="chatbot-send-btn" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
