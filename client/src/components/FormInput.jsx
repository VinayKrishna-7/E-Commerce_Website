import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  min,
  max,
  step,
  name,
  className = '',
  rows,
  as = 'input',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).slice(2, 7)}`;

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--status-error)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {as === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows || 3}
            className={`form-textarea ${error ? 'border-error' : ''}`}
            required={required}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`form-input ${error ? 'border-error' : ''}`}
            required={required}
            style={isPassword ? { paddingRight: '40px' } : undefined}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="form-error">{error}</span>}
      {!error && hint && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormInput;
