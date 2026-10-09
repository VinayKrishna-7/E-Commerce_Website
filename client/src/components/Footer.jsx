import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-compact">
      <div className="container">
        <div className="footer-compact-single">
          {/* Brand & Copyright */}
          <div className="footer-compact-left">
            <Link to="/" className="footer-compact-brand">
              <ShoppingBag size={17} className="footer-compact-icon" />
              <span>ShopEase</span>
            </Link>
            <span className="footer-compact-divider">•</span>
            <span className="footer-compact-copy">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          {/* Essential Meta & Policies */}
          <div className="footer-compact-meta">
            <span className="footer-meta-pill">
              <ShieldCheck size={13} />
              <span>Secure SSL</span>
            </span>
            <span>•</span>
            <span>Free Delivery &gt; ₹999</span>
            <span>•</span>
            <span>INR (₹)</span>
            <span>•</span>
            <span className="footer-meta-link">Privacy</span>
            <span>•</span>
            <span className="footer-meta-link">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
