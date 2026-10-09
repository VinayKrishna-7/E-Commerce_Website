import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { formatCurrency } from '../utils/formatters';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import OrderSummary from '../components/OrderSummary';
import { CreditCard, Banknote, ShieldCheck, ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, shipping, grandTotal, refreshCart } = useCart();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty or not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items.length, navigate]);

  // Form State
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Load saved addresses if available
  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (isAuthenticated) {
        try {
          const res = await addressService.getAddresses();
          const list = res.addresses || [];
          setSavedAddresses(list);
          if (list.length > 0) {
            const def = list.find((a) => a.isDefault) || list[0];
            setRecipientName(def.recipientName);
            setPhone(def.phone);
            setAddressLine(def.addressLine);
            setCity(def.city);
            setState(def.state);
            setPostalCode(def.postalCode);
          }
        } catch {
          // ignore
        }
      }
    };
    loadSavedAddresses();
  }, [isAuthenticated]);

  const handleSelectSavedAddress = (addr) => {
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!recipientName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim()) {
      toastError('Please complete all required delivery details.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Mock Card Payment',
        shippingAddress: {
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        },
      };

      const res = await orderService.createOrder(orderPayload);

      // Optionally save address if requested
      if (saveAddressForFuture && savedAddresses.length === 0) {
        try {
          await addressService.createAddress({
            ...orderPayload.shippingAddress,
            isDefault: true,
          });
        } catch {
          // ignore
        }
      }

      await refreshCart();
      success('Order placed successfully!');
      navigate(`/order-success/${res.order.id}`, { state: { order: res.order } });
    } catch (err) {
      console.error('Order creation error:', err);
      toastError(err.message || 'Failed to place order. Please review your stock or details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          Checkout
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Please provide delivery details and select your payment option.
        </p>
      </div>

      <div className="checkout-layout">
        {/* Left Form: Delivery details & Payment */}
        <div>
          <form onSubmit={handleSubmitOrder}>
            {/* Saved Addresses Quick Selector */}
            {savedAddresses.length > 0 && (
              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                  Saved Addresses
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '12px' }}
                    >
                      {addr.recipientName} ({addr.city})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Details Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                1. Delivery Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <FormInput
                  label="Recipient Full Name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
                <FormInput
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <FormInput
                label="Street Address / Apartment / Suite"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="123 Serene Boulevard, Apt 4B"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                <FormInput
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Portland"
                  required
                />
                <FormInput
                  label="State / Province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="OR"
                />
                <FormInput
                  label="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="97201"
                  required
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', cursor: 'pointer', marginTop: 'var(--space-2)' }}>
                <input
                  type="checkbox"
                  checked={saveAddressForFuture}
                  onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                />
                <span>Save this delivery address to my account</span>
              </label>
            </div>

            {/* Payment Method Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                2. Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {/* Cash on Delivery option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    border: `1px solid ${paymentMethod === 'COD' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: paymentMethod === 'COD' ? 'var(--accent-subtle)' : 'var(--bg-card)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <Banknote size={20} style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Pay with cash or card upon package receipt.</div>
                  </div>
                </label>

                {/* Mock Card option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    border: `1px solid ${paymentMethod === 'CARD' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: paymentMethod === 'CARD' ? 'var(--accent-subtle)' : 'var(--bg-card)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                  />
                  <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Instant Demo Card (Simulated Sandbox)</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Safe mock payment flow for portfolio demonstration.</div>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <Link to="/cart">
                <Button variant="outline" icon={ArrowLeft}>
                  Return to Bag
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                style={{ flex: 1 }}
                icon={ShieldCheck}
              >
                Place Order • {formatCurrency(grandTotal)}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Summary */}
        <div>
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            actionButton={null}
          />

          {/* Items preview in sidebar */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
              marginTop: 'var(--space-4)',
            }}
          >
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Order Items ({items.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.product?.name}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {formatCurrency(Number(item.product?.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
