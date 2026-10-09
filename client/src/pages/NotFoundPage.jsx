import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div
      className="container animate-fade-in"
      style={{
        padding: 'var(--space-20) 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
      <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>404</h1>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: 'var(--space-6)' }}>
        The page or item you are looking for has been retired or relocated.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
