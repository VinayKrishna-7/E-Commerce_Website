import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      className={`brand-logo-icon ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="se-logo-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D5A43" />
          <stop offset="100%" stopColor="#183627" />
        </linearGradient>
        <linearGradient id="se-logo-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7CBB0" />
          <stop offset="100%" stopColor="#D4E8DA" />
        </linearGradient>
      </defs>

      {/* Luxury Squircle Badge */}
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="9"
        fill="url(#se-logo-grad-bg)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.2"
      />

      {/* Architectural Handle */}
      <path
        d="M13 12V9a5 5 0 0 1 10 0v3"
        stroke="url(#se-logo-grad-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bag Body Silhouette */}
      <path
        d="M8.5 12h19l-1.4 14.5a3 3 0 0 1-3 2.5H12.9a3 3 0 0 1-3-2.5L8.5 12z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />

      {/* Fluid Luxury Monogram 'S' */}
      <path
        d="M20.5 16.5c-.8-.9-1.9-1.3-3.1-1.3-1.8 0-3 1-3 2.3 0 1.9 2.2 2.3 3.8 2.8 2 .6 3.4 1.3 3.4 3.1 0 1.9-1.6 3.1-3.6 3.1-1.9 0-3.2-.9-3.9-2"
        stroke="#1D3E2E"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Delicate Accent Sparkle */}
      <circle cx="23.5" cy="11.5" r="1.2" fill="#D4E8DA" />
    </svg>
  );
};

export default Logo;
