import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrderById(id);
          setOrder(res.order);
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving confirmed order..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <h2>Order Confirmation</h2>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <Link to="/orders">
          <Button variant="primary">View My Orders</Button>
        </Link>
      </div>
    );
  }

  const badge = getOrderStatusBadge(order.status);
  const address = typeof order.shippingAddressSnapshot === 'string'
    ? JSON.parse(order.shippingAddressSnapshot)
    : order.shippingAddressSnapshot || {};

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)', maxWidth: '780px' }}>
      {/* Top Banner */}
      <div
        style={{
          textAlign: 'center',
          margin: 'var(--space-12) 0 var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          Order Confirmed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
          Thank you for choosing ShopEase. A receipt and dispatch updates have been logged.
        </p>
      </div>

      {/* Main Order Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        {/* Header Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            paddingBottom: 'var(--space-6)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Order Reference
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {order.orderNumber || order.id}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Date: {formatDate(order.createdAt)}
            </div>
            <span className={`badge ${badge.className}`}>{badge.label}</span>
          </div>
        </div>

        {/* Ordered Items */}
        <div style={{ padding: 'var(--space-6) 0', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
            Items in Shipment ({order.items?.length || 0})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80';
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
        </div>

        {/* Delivery & Payment Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-6)',
            padding: 'var(--space-6) 0',
            borderBottom: '1px solid var(--border-color)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Delivery Address
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>{address.recipientName}</strong><br />
              {address.phone && <span>Phone: {address.phone}<br /></span>}
              {address.addressLine}<br />
              {address.city}, {address.state} {address.postalCode}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Payment Method
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {order.paymentMethod}<br />
              Status: <span style={{ textTransform: 'capitalize' }}>{order.paymentStatus || 'Pending'}</span>
            </div>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div style={{ padding: 'var(--space-6) 0 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Shipping Fee</span>
            <span>
              {Number(order.shippingAmount) === 0 ? 'Complimentary' : formatCurrency(order.shippingAmount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
        <Link to="/orders">
          <Button variant="secondary" icon={Package}>
            View My Orders
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="primary" icon={ShoppingBag}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
