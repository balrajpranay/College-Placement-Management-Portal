import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, margin: '20px auto', maxWidth: 800, background: 'var(--bg-surface, #FFFFFF)', border: '1px solid #EF4444', borderRadius: 12, color: 'var(--text-main, #0F172A)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>!</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#EF4444', fontWeight: 800 }}>Something went wrong</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #64748B)' }}>An unexpected error occurred while rendering this section.</p>
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface-alt, #F8FAFC)', padding: 14, borderRadius: 8, fontFamily: 'monospace', fontSize: '0.825rem', color: '#DC2626', overflowX: 'auto', marginBottom: 16, border: '1px solid var(--border-subtle, #E2E8F0)' }}>
            {this.state.error?.toString() || 'Unknown React error'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              style={{ background: '#0A66C2', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
            >
              Reload Page
            </button>
            <button
              onClick={() => { window.location.href = '/student/dashboard'; }}
              style={{ background: 'transparent', color: 'var(--text-main, #0F172A)', border: '1px solid var(--border-color, #CBD5E1)', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
