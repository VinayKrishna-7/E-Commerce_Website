import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-simple">
      <div className="container">
        <div className="footer-simple-grid">
          {/* Brand Info */}
          <div className="footer-simple-brand">
            <Link to="/" className="footer-simple-logo">
              <ShoppingBag size={19} className="footer-simple-logo-icon" />
              <span>ShopEase</span>
            </Link>
            <p className="footer-simple-desc">
              Thoughtfully curated everyday essentials. Crafted for longevity, ease, and modern living.
            </p>
            <a href="mailto:support@shopease.com" className="footer-simple-contact">
              support@shopease.com
            </a>
          </div>

          {/* Navigation - Explore */}
          <div className="footer-simple-col">
            <h4 className="footer-simple-heading">Shop</h4>
            <ul className="footer-simple-links">
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
            </ul>
          </div>

          {/* Navigation - Customer Care */}
          <div className="footer-simple-col">
            <h4 className="footer-simple-heading">Customer Care</h4>
            <ul className="footer-simple-links">
              <li>
                <Link to="/orders">Track Orders</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Bag</Link>
              </li>
              <li>
                <Link to="/wishlist">Saved Wishlist</Link>
              </li>
              <li>
                <span className="footer-simple-static">Free Shipping &gt; ₹999</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-simple-bottom">
          <p className="footer-simple-copy">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>

          <div className="footer-simple-meta">
            <span>India • INR (₹)</span>
            <span className="footer-simple-sep">•</span>
            <span className="footer-simple-link">Privacy Policy</span>
            <span className="footer-simple-sep">•</span>
            <span className="footer-simple-link">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
