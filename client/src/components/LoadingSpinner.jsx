import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 28, text = 'Loading...', fullPage = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-8)',
        color: 'var(--text-secondary)',
      }}
    >
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      {text && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
