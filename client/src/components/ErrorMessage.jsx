import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({
  message = 'An error occurred while loading content.',
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        backgroundColor: 'var(--status-error-bg)',
        border: '1px solid var(--status-error)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-3)',
        maxWidth: '480px',
        margin: 'var(--space-8) auto',
      }}
    >
      <AlertCircle size={28} style={{ color: 'var(--status-error)' }} />
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
