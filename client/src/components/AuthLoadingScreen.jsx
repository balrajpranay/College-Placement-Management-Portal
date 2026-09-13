import React, { useState, useEffect } from 'react';

const MILESTONES = [
  { progress: 25, message: "Connecting to secure Google OAuth gateway...", sub: "Establishing cryptographic handshake" },
  { progress: 55, message: "Verifying developer identity & permissions...", sub: "Exchanging authorization token with Google Cloud" },
  { progress: 85, message: "Synchronizing student academic portfolio...", sub: "Linking registered drives & skill credentials" },
  { progress: 100, message: "Authentication verified! Launching portal...", sub: "Redirecting to your workspace" }
];

export default function AuthLoadingScreen({
  title = "Authenticating with Google",
  subtitle = "Please hold on while we secure your placement workspace",
  currentStep = 0,
  manualAction
}) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [progressVal, setProgressVal] = useState(25);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setActiveStep(1);
      setProgressVal(55);
    }, 600);

    const timer2 = setTimeout(() => {
      setActiveStep(2);
      setProgressVal(85);
    }, 1300);

    const timer3 = setTimeout(() => {
      setActiveStep(3);
      setProgressVal(100);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const milestone = MILESTONES[Math.min(activeStep, MILESTONES.length - 1)];

  return (
    <div className="impeccable-auth-loading-overlay" role="status" aria-live="polite">
      {/* Ambient background light orbs */}
      <div className="auth-ambient-orb orb-primary" />
      <div className="auth-ambient-orb orb-accent" />
      <div className="auth-ambient-grid" />

      <div className="impeccable-auth-loading-card">
        {/* Holographic Crest / Dual Docking Badges */}
        <div className="auth-dock-container">
          {/* Concentric orbital rings */}
          <div className="auth-orbit-ring ring-1" />
          <div className="auth-orbit-ring ring-2" />
          <div className="auth-orbit-ring ring-3" />

          {/* Google Crest */}
          <div className="auth-dock-node node-google" title="Google Identity Verified">
            <svg viewBox="0 0 24 24" width="36" height="36">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          {/* Glowing Energy Sync Bridge */}
          <div className="auth-dock-bridge">
            <div className="auth-bridge-line" />
            <div className="auth-bridge-pulse" />
            <div className="auth-bridge-dot" />
          </div>

          {/* Campus Connect Crest */}
          <div className="auth-dock-node node-campus" title="Campus Connect Portal">
            <img
              src="/static/images/logo.png"
              alt="Campus Connect"
              className="auth-node-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/images/companies/google.svg';
              }}
            />
          </div>
        </div>

        {/* Title & Live Status */}
        <h2 className="auth-loading-title">{title}</h2>
        <p className="auth-loading-subtitle">{subtitle}</p>

        {/* Dynamic Milestone Text with smooth transition */}
        <div className="auth-step-pill">
          <span className="auth-step-dot" />
          <div className="auth-step-text-wrap">
            <span className="auth-step-message">{milestone.message}</span>
            <span className="auth-step-sub">{milestone.sub}</span>
          </div>
        </div>

        {/* Sleek Gradient Progress Track */}
        <div className="auth-progress-track">
          <div
            className="auth-progress-bar"
            style={{ width: `${progressVal}%` }}
          />
        </div>

        {/* Security & Cryptographic Trust Badges */}
        <div className="auth-trust-badges">
          <span className="auth-trust-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            256-Bit TLS Vault
          </span>
          <span className="auth-trust-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            SSO Certified
          </span>
          <span className="auth-trust-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Instant Handshake
          </span>
        </div>

        {/* Fallback button if needed */}
        {manualAction && (
          <div className="mt-4 pt-2">
            <button onClick={manualAction.onClick} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              {manualAction.label || "Click here if not redirected automatically →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
