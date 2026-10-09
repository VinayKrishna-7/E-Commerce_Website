import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      success('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      toastError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join ShopEase to manage orders and save preferences.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--status-error-bg)',
              border: '1px solid var(--status-error)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--status-error)',
              fontSize: 'var(--text-xs)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            autoFocus
          />

          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />

          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            icon={UserPlus}
          >
            Create Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
