import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { aiQueryApi, getAiHistoryApi, clearAiHistoryApi } from '../services/api';

export default function AISuite() {
  const [currentMode, setCurrentMode] = useState('advisor');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Placement & Career Advisor powered by Google Gemini. How can I assist your campus placement journey today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const prompt = (text || inputText).trim();
    if (!prompt || isTyping) return;

    const newMsgs = [...messages, { role: 'user', text: prompt }];
    setMessages(newMsgs);
    setInputText('');
    setIsTyping(true);

    try {
      // Map messages for backend Gemini controller
      const formattedHistory = newMsgs.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await aiQueryApi(currentMode, formattedHistory);
      const reply = res?.response || "I am here to support your campus placement and technical preparation journey.";
      setMessages([...newMsgs, { role: 'ai', text: reply }]);
    } catch (err) {
      console.error('[AISuite Fetch Error]:', err);
      setMessages([
        ...newMsgs,
        { role: 'ai', text: 'Sorry, a connection issue occurred while reaching Gemini AI. Please try again in a moment.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  const handleClear = () => {
    setMessages([
      { role: 'ai', text: `Session cleared. I am ready to help you with ${currentMode === 'tutor' ? 'DSA, Coding & Interview Prep' : 'Placement Eligibility & Career Strategy'}!` }
    ]);
  };

  return (
    <div className="ai-suite-page-container student-portal-hub-view" style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div className="card mb-6" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="flex-align-center mb-2" style={{ gap: 8, display: 'flex', alignItems: 'center' }}>
              <span className="live-pulse-dot"></span>
              <span className="badge badge-accent" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>Google Gemini Powered</span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>Active Advisor &amp; Tutor</span>
            </div>
            <h1 className="h2" style={{ margin: '0 0 6px', fontSize: '1.85rem', fontWeight: 800 }}>
              AI Career &amp; Intelligence Suite
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              Specialized AI personas for placement strategy, coding interview coaching, and general career inquiries.
            </p>
          </div>
          <div>
            <button className="btn btn-outline btn-sm" onClick={handleClear}>
              <Icon name="trash" size={14} /> Clear Session
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="ai-mode-tabs mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 'var(--space-6)' }}>
        <button
          className={`card ${currentMode === 'advisor' ? 'active' : ''}`}
          onClick={() => setCurrentMode('advisor')}
          style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'advisor' ? '2px solid var(--brand-500, #0096FF)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="stat-icon brand" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--brand-500, #0096FF)' }}>
            <Icon name="award" size={18} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>AI Career Advisor</div>
            <div className="text-xs text-muted">Placement Eligibility &amp; Strategy</div>
          </div>
        </button>

        <button
          className={`card ${currentMode === 'tutor' ? 'active' : ''}`}
          onClick={() => setCurrentMode('tutor')}
          style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'tutor' ? '2px solid var(--brand-500, #0096FF)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="stat-icon accent" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--brand-500, #0096FF)' }}>
            <Icon name="code" size={18} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>AI Technical Tutor</div>
            <div className="text-xs text-muted">DSA, Coding &amp; Mock Interviews</div>
          </div>
        </button>

        <button
          className={`card ${currentMode === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentMode('chat')}
          style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'chat' ? '2px solid var(--brand-500, #0096FF)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="stat-icon success" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-500)' }}>
            <Icon name="message-circle" size={18} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>AI Chat Assistant</div>
            <div className="text-xs text-muted">General Knowledge &amp; Q&amp;A</div>
          </div>
        </button>
      </div>

      {/* 2-Column Suite Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-6)' }}>
        <aside className="card" style={{ padding: 'var(--space-5)', height: 'fit-content' }}>
          <h3 className="h4 mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Suggested Prompts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-outline btn-sm text-left" style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '8px 10px' }} onClick={() => handleSend("How do I verify if I am eligible for top software engineering drives with my current CGPA?")}>
              📋 Check Drive Eligibility Rules
            </button>
            <button className="btn btn-outline btn-sm text-left" style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '8px 10px' }} onClick={() => handleSend("What are the complete eligibility criteria and application steps for the PM Internship Scheme?")}>
              🏛️ PM Internship Scheme Details
            </button>
            <button className="btn btn-outline btn-sm text-left" style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '8px 10px' }} onClick={() => handleSend("Explain the two-pointer approach in DSA with an example problem.")}>
              💻 Master Two-Pointer Pattern
            </button>
            <button className="btn btn-outline btn-sm text-left" style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '8px 10px' }} onClick={() => handleSend("Give me 3 actionable tips to improve my resume for Tier-1 placement drives.")}>
              📄 Polish My Placement Resume
            </button>
          </div>
        </aside>

        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', minHeight: 480 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16, maxHeight: '60vh' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: m.role === 'user' ? 'var(--brand-500, #0096FF)' : 'var(--bg-surface-alt)',
                  color: m.role === 'user' ? '#FFFFFF' : 'var(--text-main)',
                  border: m.role === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '0.92rem',
                  lineHeight: 1.6
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-pulse-dot"></span>
                <span className="text-xs text-muted">Gemini AI is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder={`Ask your ${currentMode === 'tutor' ? 'AI Technical Tutor' : currentMode === 'advisor' ? 'AI Career Advisor' : 'AI Assistant'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
            />
            <button type="submit" className="btn btn-primary" disabled={isTyping || !inputText.trim()}>
              Send <Icon name="send" size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

