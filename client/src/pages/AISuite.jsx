import React, { useState } from 'react';
import Icon from '../components/Icon';

export default function AISuite() {
  const [currentMode, setCurrentMode] = useState('advisor');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Placement & Career Advisor. How can I assist your campus placement journey today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (text) => {
    const prompt = text || inputText;
    if (!prompt.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: prompt }];
    setMessages(newMsgs);
    setInputText('');

    setTimeout(() => {
      let reply = "Based on institutional placement standards, maintain an 8.0+ CGPA with 0 active backlogs to remain eligible for Tier-1 Super Dream drives.";
      if (currentMode === 'tutor') {
        reply = "For technical interviews, focus on core Data Structures (Trees, Graphs, DP) and explain time/space complexities clearly.";
      } else if (currentMode === 'chat') {
        reply = "Feel free to ask any career, resume, or company-specific questions!";
      }
      setMessages([...newMsgs, { role: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <main className="page-body" style={{ padding: 'var(--space-8) 0 var(--space-16)' }}>
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-6)' }}>
          <div>
            <div className="badge badge-accent mb-2" style={{ display: 'inline-block', fontSize: '0.75rem', padding: '3px 8px', marginBottom: 'var(--space-2)' }}>Google Gemini Powered</div>
            <h1 className="h1" style={{ margin: '0 0 var(--space-2)', fontSize: '2.25rem', fontWeight: 800 }}>AI Career &amp; Intelligence Suite</h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.05rem' }}>
              Specialized AI personas for placement strategy, coding interview coaching, and general career inquiries.
            </p>
          </div>
          <div>
            <button className="btn btn-outline" onClick={() => setMessages([{ role: 'ai', text: 'Session cleared. How can I assist you now?' }])}>
              <Icon name="trash" size={15} /> Clear Session
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="ai-mode-tabs mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 'var(--space-6)' }}>
          <button
            className={`card ${currentMode === 'advisor' ? 'active' : ''}`}
            onClick={() => setCurrentMode('advisor')}
            style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'advisor' ? '2px solid var(--accent-cyan-500)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
          >
            <div className="stat-icon brand" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)' }}>
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
            style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'tutor' ? '2px solid var(--accent-cyan-500)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
          >
            <div className="stat-icon accent" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)' }}>
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
            style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: currentMode === 'chat' ? '2px solid var(--accent-cyan-500)' : '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left' }}
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
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)' }}>
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
            </div>
          </aside>

          <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', minHeight: 450 }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: m.role === 'user' ? 'var(--brand-navy-600, #2563EB)' : 'var(--bg-surface-alt)',
                    color: m.role === 'user' ? '#FFFFFF' : 'var(--text-main)',
                    border: m.role === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                    fontSize: '0.92rem',
                    lineHeight: 1.5
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Ask about placement cutoffs, interview prep, or PM internships..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
              />
              <button type="submit" className="btn btn-primary">
                Send <Icon name="send" size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
