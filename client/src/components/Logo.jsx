import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoPng from '../assets/logo.png';

export function LogoIcon({ size = 36, className = '', style = {} }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`brand-logo-svg ${className}`}
        style={{ flexShrink: 0, borderRadius: 8, ...style }}
      >
        <rect width="48" height="48" rx="10" fill="url(#cc_logo_grad)" />
        <path d="M24 12L37 18.5L24 25L11 18.5L24 12Z" fill="#FFFFFF" />
        <path d="M16 21.2V27.5C16 27.5 19.5 31 24 31C28.5 31 32 27.5 32 27.5V21.2L24 25.2L16 21.2Z" fill="#BAE6FD" />
        <path d="M37 18.5V28" stroke="#F0F9FF" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="37" cy="29" r="1.5" fill="#38BDF8" />
        <circle cx="24" cy="37" r="2.5" fill="#38BDF8" />
        <circle cx="16" cy="35" r="2" fill="#7DD3FC" opacity="0.85" />
        <circle cx="32" cy="35" r="2" fill="#7DD3FC" opacity="0.85" />
        <path d="M18 35.5L21.5 36.5M30 35.5L26.5 36.5" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="cc_logo_grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B2545" />
            <stop offset="0.5" stopColor="#133E87" />
            <stop offset="1" stopColor="#0096FF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <img
      src={logoPng}
      alt="Campus Connect"
      className={`brand-logo-img ${className}`}
      onError={() => setImgError(true)}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
        borderRadius: 6,
        ...style
      }}
    />
  );
}

export function BrandLockup({
  to = '/',
  size = 36,
  textLight = false,
  showSub = true,
  className = '',
  style = {}
}) {
  const content = (
    <div
      className={`brand-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        ...style
      }}
    >
      <div
        className="brand-logo-wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          flexShrink: 0
        }}
      >
        <LogoIcon size={size} />
      </div>
      <div className="brand-text-block" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span
          className="brand-name"
          style={{
            fontWeight: 800,
            fontSize: size >= 36 ? '1.15rem' : '1.02rem',
            letterSpacing: '-0.02em',
            color: textLight ? '#FFFFFF' : 'var(--brand-navy-900, #0B2545)'
          }}
        >
          Campus Connect
        </span>
        {showSub && (
          <span
            className="brand-sub"
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: textLight ? '#38BDF8' : 'var(--accent-cyan-600, #0284C7)'
            }}
          >
            Placement Portal
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {content}
      </Link>
    );
  }

  return content;
}

export default LogoIcon;
