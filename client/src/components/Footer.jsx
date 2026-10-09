import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

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
    <footer className="footer-stylish">
      <div className="container">
        {/* Top Tier: Editorial Headline & Modern Glassmorphic Newsletter Box */}
        <div className="footer-top-marquee">
          <div>
            <div className="footer-tagline-badge">
              <span className="footer-pulse-dot" />
              <span>The ShopEase Archive & Journal</span>
            </div>
            <h2 className="footer-hero-headline">
              Objects of permanence for everyday rituals.
            </h2>
            <p className="footer-hero-desc">
              We design and curate utilitarian apparel, tactile homewares, and minimalist tech accessories crafted with mindful proportions and ethical provenance.
            </p>
          </div>

          <div className="footer-subscribe-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <Sparkles size={16} style={{ color: '#9DBBA0' }} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#FFFFFF' }}>
                Join The Private Dispatch
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: '#8C9488', marginBottom: 'var(--space-4)' }}>
              Early access to seasonal drops, artisan archives, and private invitations.
            </p>

            {subscribed ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: '#78BD8F',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  padding: 'var(--space-3)',
                  backgroundColor: 'rgba(120, 189, 143, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(120, 189, 143, 0.25)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>You are on the private dispatch list. Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <div className="footer-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="footer-input"
                  />
                  <button
                    type="submit"
                    className="footer-submit-btn"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>

                <div className="footer-micro-perks">
                  <span>✓ 10% off first order</span>
                  <span>•</span>
                  <span>✓ No spam guarantee</span>
                  <span>•</span>
                  <span>✓ Instant unsubscribe</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: 4 Editorial Link Columns */}
        <div className="footer-columns-grid">
          {/* Column 1: Curated Collections */}
          <div>
            <h4 className="footer-col-title">Curated Catalog</h4>
            <div className="footer-col-links">
              <Link to="/shop" className="footer-nav-link">
                <span>All Products</span>
              </Link>
              <Link to="/shop?category=Audio%20%26%20Electronics" className="footer-nav-link">
                <span>Audio & Tech</span>
              </Link>
              <Link to="/shop?category=Apparel%20%26%20Footwear" className="footer-nav-link">
                <span>Apparel & Footwear</span>
              </Link>
              <Link to="/shop?category=Home%20%26%20Living" className="footer-nav-link">
                <span>Studio Living & Ceramics</span>
              </Link>
              <Link to="/shop?category=Carry%20%26%20Accessories" className="footer-nav-link">
                <span>Leather & Carry</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Client Services */}
          <div>
            <h4 className="footer-col-title">Client Services</h4>
            <div className="footer-col-links">
              <Link to="/orders" className="footer-nav-link">
                <span>Track Your Shipment</span>
              </Link>
              <Link to="/cart" className="footer-nav-link">
                <span>Shopping Bag</span>
              </Link>
              <Link to="/wishlist" className="footer-nav-link">
                <span>Saved Wishlist</span>
              </Link>
              <Link to="/profile" className="footer-nav-link">
                <span>Customer Account</span>
              </Link>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Complimentary Delivery &gt; ₹999</span>
              </span>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>30-Day Hassle-Free Exchange</span>
              </span>
            </div>
          </div>

          {/* Column 3: The Workshop & Ethics */}
          <div>
            <h4 className="footer-col-title">The Workshop</h4>
            <div className="footer-col-links">
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Ethical Craft Manifesto</span>
              </span>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Plastic-Free Packing</span>
              </span>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Traceable Sourcing</span>
              </span>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Care & Repair Archive</span>
              </span>
              <span className="footer-nav-link" style={{ cursor: 'default' }}>
                <span>Direct Artisan Partners</span>
              </span>
            </div>
          </div>

          {/* Column 4: Studio Presence & Contact */}
          <div>
            <h4 className="footer-col-title">Flagship Presence</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="footer-contact-item">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={15} style={{ color: '#9DBBA0', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    100ft Road, Indiranagar<br />
                    Bengaluru, Karnataka 560038
                  </span>
                </div>
              </div>

              <div className="footer-contact-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} style={{ color: '#9DBBA0', flexShrink: 0 }} />
                  <span>Mon – Sat: 10:00 – 20:00 IST</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} style={{ color: '#9DBBA0', flexShrink: 0 }} />
                  <span>concierge@shopease.in</span>
                </div>
              </div>

              <div>
                <span className="footer-live-badge">
                  <span className="footer-pulse-dot" style={{ width: 6, height: 6 }} />
                  <span>Studio Flagship Open</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Giant Architectural Typographic Watermark */}
        <div className="footer-watermark-wrap" aria-hidden="true">
          <span className="footer-watermark-text">S H O P E A S E</span>
        </div>

        {/* Bottom Tier: Utility & Copyright */}
        <div className="footer-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} ShopEase Goods Inc. All rights reserved.</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} style={{ color: '#78BD8F' }} />
              <span>PCI-DSS 256-bit Encrypted Checkout</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="footer-currency-pill">
              <span>🇮🇳 INR (₹)</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>India</span>
            </span>
            <span>Zero Waste Certified</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
