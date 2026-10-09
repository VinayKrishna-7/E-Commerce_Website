import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from './Button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Editorial Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <span className="brand-mark" style={{ width: 26, height: 26, fontSize: 14 }}>S</span>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>ShopEase</span>
            </div>
            <p style={{ maxWidth: '320px', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
              Curated everyday essentials, minimalist electronics, tactile homewares, and utilitarian apparel crafted for durability, simplicity, and longevity.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span className="badge badge-category">Est. 2026</span>
              <span className="badge badge-category">Pure Craft</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="footer-heading">Shop Catalog</h4>
            <div className="footer-links">
              <Link to="/shop" className="footer-link">All Products</Link>
              <Link to="/shop?category=Audio%20%26%20Electronics" className="footer-link">Audio & Tech</Link>
              <Link to="/shop?category=Apparel%20%26%20Footwear" className="footer-link">Apparel & Footwear</Link>
              <Link to="/shop?category=Home%20%26%20Living" className="footer-link">Home & Living</Link>
              <Link to="/shop?category=Carry%20%26%20Accessories" className="footer-link">Carry & Accessories</Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="footer-heading">Customer Care</h4>
            <div className="footer-links">
              <Link to="/orders" className="footer-link">Order Status</Link>
              <Link to="/cart" className="footer-link">Shopping Bag</Link>
              <Link to="/wishlist" className="footer-link">Saved Items</Link>
              <span className="footer-link" style={{ cursor: 'default' }}>Complimentary Shipping</span>
              <span className="footer-link" style={{ cursor: 'default' }}>30-Day Hassle-Free Returns</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="footer-heading">The Dispatch</h4>
            <p style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
              Receive seasonal dispatches, product launches, and editorial design notes. Never spam.
            </p>
            {subscribed ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--status-success)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--status-success-bg)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>Thank you. You are on the subscriber list.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                  style={{ minHeight: '38px', fontSize: 'var(--text-xs)' }}
                />
                <Button type="submit" variant="primary" size="sm" icon={ArrowRight}>
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ShopEase Goods Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span style={{ cursor: 'default' }}>Ethical Production</span>
            <span>•</span>
            <span style={{ cursor: 'default' }}>Zero Waste Packaging</span>
            <span>•</span>
            <span style={{ cursor: 'default' }}>Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
