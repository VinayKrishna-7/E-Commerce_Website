import React from 'react';

const Logo = ({ size = 28, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={`brand-logo-icon ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shopease-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A6A51" />
          <stop offset="100%" stopColor="#244735" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#shopease-logo-grad)" />
      <path
        d="M11.5 11V8.5a4.5 4.5 0 0 1 9 0V11"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M7 11.5h18l-1.2 13a2.5 2.5 0 0 1-2.5 2.2H10.7a2.5 2.5 0 0 1-2.5-2.2L7 11.5z"
        fill="#FFFFFF"
      />
      <path
        d="M18.2 15.6c-.6-.7-1.4-1-2.3-1-1.4 0-2.2.8-2.2 1.8 0 1.4 1.5 1.8 2.8 2.2 1.5.5 2.7 1 2.7 2.4 0 1.4-1.2 2.3-2.7 2.3-1.4 0-2.4-.7-2.9-1.5"
        stroke="#2D5541"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
