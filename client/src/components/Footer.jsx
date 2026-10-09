import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-clean">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <ShoppingBag size={20} className="footer-logo-icon" />
              <span>ShopEase</span>
            </Link>
            <p className="footer-tagline">
              Thoughtfully curated everyday essentials. Crafted for longevity, ease, and modern living.
            </p>
          </div>

          {/* Shop Column */}
          <div className="footer-nav-group">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/shop">All Products</Link>
              </li>
              <li>
                <Link to="/shop?category=Audio%20%26%20Electronics">Audio & Tech</Link>
              </li>
              <li>
                <Link to="/shop?category=Apparel%20%26%20Footwear">Apparel</Link>
              </li>
              <li>
                <Link to="/shop?category=Home%20%26%20Living">Home & Living</Link>
              </li>
              <li>
                <Link to="/shop?category=Carry%20%26%20Accessories">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="footer-nav-group">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/orders">Order History</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Bag</Link>
              </li>
              <li>
                <Link to="/wishlist">Saved Wishlist</Link>
              </li>
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies Column */}
          <div className="footer-nav-group">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-link-list">
              <li>
                <span className="footer-note">Free Delivery above ₹999</span>
              </li>
              <li>
                <span className="footer-note">Cash on Delivery Available</span>
              </li>
              <li>
                <span className="footer-note">30-Day Easy Returns</span>
              </li>
              <li>
                <span className="footer-note">support@shopease.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>

          <div className="footer-meta">
            <span className="footer-meta-tag">
              <ShieldCheck size={14} />
              <span>Secure SSL Checkout</span>
            </span>
            <span className="footer-meta-sep">•</span>
            <span className="footer-meta-tag">INR (₹)</span>
            <span className="footer-meta-sep">•</span>
            <span className="footer-meta-link">Privacy Policy</span>
            <span className="footer-meta-sep">•</span>
            <span className="footer-meta-link">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
