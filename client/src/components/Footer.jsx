import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-compact">
      <div className="container">
        {/* Top Row: Brand & Inline Quick Navigation */}
        <div className="footer-compact-top">
          <div className="footer-compact-brand-wrap">
            <Link to="/" className="footer-compact-brand">
              <ShoppingBag size={18} className="footer-compact-icon" />
              <span>ShopEase</span>
            </Link>
            <span className="footer-compact-divider">|</span>
            <span className="footer-compact-desc">Curated everyday essentials</span>
          </div>

          <nav className="footer-compact-nav" aria-label="Footer Navigation">
            <Link to="/shop">Shop All</Link>
            <Link to="/shop?category=Audio%20%26%20Electronics">Audio</Link>
            <Link to="/shop?category=Apparel%20%26%20Footwear">Apparel</Link>
            <Link to="/shop?category=Home%20%26%20Living">Home</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </nav>
        </div>

        {/* Bottom Row: Minimal Legal & Meta Bar */}
        <div className="footer-compact-bottom">
          <p className="footer-compact-copy">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>

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
