import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving your orders..." />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <ErrorMessage message={error} onRetry={fetchOrders} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <EmptyState
          icon={Package}
          title="No previous orders found"
          description="You haven't placed any orders yet. Discover timeless items in our catalog."
          actionLabel="Start Shopping"
          onAction={() => window.location.href = '/shop'}
        />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          Order History
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          View and track your previous purchases.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const badge = getOrderStatusBadge(order.status);
          const address = typeof order.shippingAddressSnapshot === 'string'
            ? JSON.parse(order.shippingAddressSnapshot)
            : order.shippingAddressSnapshot || {};

          return (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              {/* Order Header Row */}
              <div
                style={{
                  padding: 'var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-4)',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  transition: 'background-color var(--transition-fast)',
                }}
                onClick={() => toggleExpand(order.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Order No.</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                      {order.orderNumber || order.id.slice(0, 8)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Date Placed</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Total Amount</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`badge ${badge.className}`}>{badge.label}</span>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Collapsed Brief Preview */}
              {!isExpanded && (
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-5)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Package size={14} />
                  <span>
                    {order.items?.length || 0} items: {order.items?.map((i) => i.productName).join(', ')}
                  </span>
                </div>
              )}

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div style={{ padding: 'var(--space-6)', borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                    Purchased Items
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-4)',
                          paddingBottom: 'var(--space-3)',
                          borderBottom: '1px solid var(--border-color)',
                        }}
                      >
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-color)',
                          }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.productName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            Qty: {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                          {formatCurrency(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Shipping Destination:</strong><br />
                      {address.recipientName}<br />
                      {address.addressLine}<br />
                      {address.city}, {address.state} {address.postalCode}
                    </div>

                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Payment Summary:</strong><br />
                      Method: {order.paymentMethod}<br />
                      Shipping: {Number(order.shippingAmount) === 0 ? 'Complimentary' : formatCurrency(order.shippingAmount)}<br />
                      Total: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
