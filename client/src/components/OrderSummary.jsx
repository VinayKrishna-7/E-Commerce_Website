import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from '../utils/constants';
import Button from './Button';
import { ShieldCheck, Truck } from 'lucide-react';

const OrderSummary = ({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  grandTotal = 0,
  actionButton,
  showShippingNotice = true,
}) => {
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100));

  return (
    <div className="order-summary-card">
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        Order Summary
      </h3>

      {showShippingNotice && (
        <div
          style={{
            padding: 'var(--space-3)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Truck size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>
              {amountToFreeShipping === 0 ? (
                <strong>You qualify for complimentary standard shipping!</strong>
              ) : (
                <>Add <strong>{formatCurrency(amountToFreeShipping)}</strong> more for free shipping</>
              )}
            </span>
          </div>
          <div
            style={{
              height: 4,
              backgroundColor: 'var(--border-color)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="summary-row">
        <span>Estimated Shipping</span>
        <span>
          {shipping === 0 ? (
            <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Free</span>
          ) : (
            formatCurrency(shipping)
          )}
        </span>
      </div>

      {tax > 0 && (
        <div className="summary-row">
          <span>Estimated Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>

      <div style={{ marginTop: 'var(--space-5)' }}>
        {actionButton}
      </div>

      <div
        style={{
          marginTop: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}
      >
        <ShieldCheck size={14} />
        <span>Encrypted & secure checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;
