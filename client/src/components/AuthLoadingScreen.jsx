import React, { useState, useEffect } from 'react';

const MILESTONES = [
  { progress: 25, message: "Connecting to secure GitHub OAuth gateway...", sub: "Establishing cryptographic handshake" },
  { progress: 55, message: "Verifying developer identity & permissions...", sub: "Exchanging authorization token with GitHub" },
  { progress: 85, message: "Synchronizing student academic portfolio...", sub: "Linking registered drives & skill credentials" },
  { progress: 100, message: "Authentication verified! Launching portal...", sub: "Redirecting to your workspace" }
];

export default function AuthLoadingScreen({
  title = "Authenticating with GitHub",
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

          {/* GitHub Crest */}
          <div className="auth-dock-node node-github" title="GitHub Verified">
            <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
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
