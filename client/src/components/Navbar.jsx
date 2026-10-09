import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Search,
  Shield,
  Package,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategory = new URLSearchParams(location.search).get('category');

  const isLinkActive = (path, category = null) => {
    if (path === '/') {
      return location.pathname === '/' && !location.search;
    }
    if (path === '/shop') {
      if (location.pathname !== '/shop') return false;
      if (!category) {
        return !currentCategory || currentCategory === 'All Products';
      }
      return currentCategory === category;
    }
    return location.pathname === path;
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Complimentary delivery across India on orders over ₹999</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <Link to="/shop">Shop the new arrivals</Link>
      </div>

      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar">
            {/* Left: Mobile menu toggle + Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="action-btn-pill mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation menu"
              >
                <Menu size={20} />
              </button>

              <Link to="/" className="navbar-brand">
                <span className="brand-mark">S</span>
                <span>ShopEase</span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <div className="navbar-links">
              <Link to="/" className={`nav-link ${isLinkActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/shop" className={`nav-link ${isLinkActive('/shop') ? 'active' : ''}`}>
                Shop All
              </Link>
              <Link
                to="/shop?category=Audio%20%26%20Electronics"
                className={`nav-link ${isLinkActive('/shop', 'Audio & Electronics') ? 'active' : ''}`}
              >
                Audio & Tech
              </Link>
              <Link
                to="/shop?category=Apparel%20%26%20Footwear"
                className={`nav-link ${isLinkActive('/shop', 'Apparel & Footwear') ? 'active' : ''}`}
              >
                Apparel
              </Link>
              <Link
                to="/shop?category=Home%20%26%20Living"
                className={`nav-link ${isLinkActive('/shop', 'Home & Living') ? 'active' : ''}`}
              >
                Living
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="navbar-actions">
              {/* Search toggle / field */}
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search goods..."
                    autoFocus
                    className="form-input"
                    style={{
                      height: '38px',
                      padding: '0.4rem 2rem 0.4rem 0.8rem',
                      width: '180px',
                      fontSize: 'var(--text-xs)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    style={{ position: 'absolute', right: '6px', color: 'var(--text-muted)' }}
                    aria-label="Close search"
                  >
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="action-btn-pill"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search input"
                  title="Search products"
                >
                  <Search size={19} />
                </button>
              )}

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="action-btn-pill"
                aria-label={`Wishlist with ${wishlistCount} items`}
                title="Wishlist"
              >
                <Heart size={19} />
                {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="action-btn-pill"
                aria-label={`Shopping cart with ${totalItemsCount} items`}
                title="Cart"
              >
                <ShoppingBag size={19} />
                {totalItemsCount > 0 && <span className="action-badge">{totalItemsCount}</span>}
              </Link>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* User Account / Dropdown */}
              <div className="user-menu-dropdown" ref={dropdownRef}>
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="action-btn-pill"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    aria-label="User account menu"
                    title={user?.name || 'Account'}
                    style={{ display: 'flex', alignItems: 'center', gap: '3px', width: 'auto', padding: '0 8px' }}
                  >
                    <User size={19} />
                    <ChevronDown size={14} style={{ opacity: 0.7 }} />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'none', minHeight: '36px', '@media (minWidth: 600px)': { display: 'inline-flex' } }}
                  >
                    Sign In
                  </Link>
                )}

                {/* Popover Dropdown */}
                {userDropdownOpen && (
                  <div className="user-menu-popover">
                    <div className="user-menu-header">
                      <div className="user-menu-name">{user?.name}</div>
                      <div className="user-menu-email">{user?.email}</div>
                    </div>

                    <Link to="/profile" className="user-menu-item">
                      <User size={15} />
                      <span>My Profile</span>
                    </Link>

                    <Link to="/orders" className="user-menu-item">
                      <Package size={15} />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" className="user-menu-item" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        <Shield size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: 'var(--space-1) 0' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="user-menu-item"
                      style={{ width: '100%', textAlign: 'left', color: 'var(--status-error)' }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="brand-mark" style={{ width: 24, height: 24, fontSize: 13 }}>S</span>
                <span style={{ fontWeight: 700 }}>ShopEase</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
              <Link to="/" className={`nav-link ${isLinkActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/shop" className={`nav-link ${isLinkActive('/shop') ? 'active' : ''}`}>
                Shop All Products
              </Link>
              <Link
                to="/shop?category=Audio%20%26%20Electronics"
                className={`nav-link ${isLinkActive('/shop', 'Audio & Electronics') ? 'active' : ''}`}
              >
                Audio & Electronics
              </Link>
              <Link
                to="/shop?category=Apparel%20%26%20Footwear"
                className={`nav-link ${isLinkActive('/shop', 'Apparel & Footwear') ? 'active' : ''}`}
              >
                Apparel & Footwear
              </Link>
              <Link
                to="/shop?category=Home%20%26%20Living"
                className={`nav-link ${isLinkActive('/shop', 'Home & Living') ? 'active' : ''}`}
              >
                Home & Living
              </Link>
              <Link
                to="/shop?category=Carry%20%26%20Accessories"
                className={`nav-link ${isLinkActive('/shop', 'Carry & Accessories') ? 'active' : ''}`}
              >
                Carry & Accessories
              </Link>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: 'var(--space-2) 0' }} />

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className={`nav-link ${isLinkActive('/profile') ? 'active' : ''}`}>
                    My Account ({user?.name})
                  </Link>
                  <Link to="/orders" className={`nav-link ${isLinkActive('/orders') ? 'active' : ''}`}>
                    Order History
                  </Link>
                  {isAdmin && (
                    <NavLink to="/admin" className="nav-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Admin Dashboard
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="nav-link"
                    style={{ textAlign: 'left', color: 'var(--status-error)' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Toggle Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
