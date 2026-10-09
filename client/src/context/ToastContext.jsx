import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000, action = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, action }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, action = null) => addToast(msg, 'success', 4000, action), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg, action = null) => addToast(msg, 'info', 4000, action), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, addToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role="alert"
            >
              {isSuccess && <CheckCircle2 size={18} style={{ color: 'var(--status-success)', flexShrink: 0 }} />}
              {isError && <AlertCircle size={18} style={{ color: 'var(--status-error)', flexShrink: 0 }} />}
              {!isSuccess && !isError && <Info size={18} style={{ color: 'var(--status-info)', flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick?.();
                    removeToast(toast.id);
                  }}
                  style={{
                    marginLeft: 'var(--space-2)',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--status-success)',
                    backgroundColor: 'transparent',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid currentColor',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {toast.action.label || 'Undo'}
                </button>
              )}
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
