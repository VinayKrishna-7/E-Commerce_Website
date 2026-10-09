import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { productService } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import CategoryCard from '../components/CategoryCard';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({ limit: 12 });
      const prods = data.products || [];
      // Split into featured and trending
      setFeaturedProducts(prods.filter((p) => p.featured).slice(0, 4));
      setTrendingProducts(prods.slice(4, 8).length > 0 ? prods.slice(4, 8) : prods.slice(0, 4));
    } catch (err) {
      console.error('Failed to load homepage products:', err);
      setError(err.message || 'Unable to load products. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = [
    {
      title: 'Audio & Tech',
      count: '6',
      categoryQuery: 'Audio & Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Apparel & Footwear',
      count: '6',
      categoryQuery: 'Apparel & Footwear',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Home & Living',
      count: '6',
      categoryQuery: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Carry & Accessories',
      count: '6',
      categoryQuery: 'Carry & Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <Sparkles size={14} />
                <span>NEW ARRIVALS • 2026</span>
              </div>
              <h1 className="hero-title">
                Effortless style for <span className="hero-accent-text">modern living.</span>
              </h1>
              <p className="hero-desc">
                Discover curated collections of premium audio, elevated apparel, and contemporary living essentials designed for comfort and crafted to last.
              </p>
              <div className="hero-cta-group">
                <Link to="/shop">
                  <Button variant="primary" size="lg" iconRight={ArrowRight}>
                    Shop Now
                  </Button>
                </Link>
                <a href="#categories">
                  <Button variant="secondary" size="lg">
                    Explore Categories
                  </Button>
                </a>
              </div>
            </div>

            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80"
                alt="Curated minimalist lifestyle objects"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories" style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Departments
              </span>
              <h2 style={{ marginTop: 'var(--space-1)' }}>Shop by Category</h2>
            </div>
            <Link to="/shop" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.title}
                title={cat.title}
                count={cat.count}
                image={cat.image}
                categoryQuery={cat.categoryQuery}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: 'var(--space-10) 0 var(--space-16)', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Curated Selection
              </span>
              <h2 style={{ marginTop: 'var(--space-1)' }}>Featured Products</h2>
            </div>
            <Link to="/shop" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Browse Catalog</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {error && <ErrorMessage message={error} onRetry={loadData} />}

          <ProductGrid products={featuredProducts} loading={loading} skeletonCount={4} />
        </div>
      </section>

      {/* Editorial Story / Brand Banner */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-10)',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-8)',
              alignItems: 'center',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span className="badge badge-category" style={{ marginBottom: 'var(--space-3)' }}>
                The ShopEase Standard
              </span>
              <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', lineHeight: 1.2 }}>
                Goods built for decades, not seasons.
              </h2>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                We believe the objects you use every day should feel substantial, perform reliably, and mature gracefully over time. We partner directly with dedicated artisans and manufacturers who prioritize sustainable raw materials and ethical labor standards.
              </p>
              <Link to="/shop">
                <Button variant="primary" icon={ArrowRight}>
                  Discover Our Story & Goods
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending / Best Selling Products */}
      <section style={{ padding: 'var(--space-10) 0 var(--space-16)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Customer Favorites
              </span>
              <h2 style={{ marginTop: 'var(--space-1)' }}>Trending Goods</h2>
            </div>
            <Link to="/shop?sort=price_desc" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All Trending</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <ProductGrid products={trendingProducts} loading={loading} skeletonCount={4} />
        </div>
      </section>

      {/* Value Proposition / Benefits Banner */}
      <section>
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-item">
              <Truck size={24} className="benefit-icon" />
              <div>
                <h4 className="benefit-title">Complimentary Shipping</h4>
                <p className="benefit-text">On orders over ₹999 across all states in India.</p>
              </div>
            </div>

            <div className="benefit-item">
              <RefreshCw size={24} className="benefit-icon" />
              <div>
                <h4 className="benefit-title">30-Day Hassle-Free Returns</h4>
                <p className="benefit-text">Prepaid return labels with quick, honest refunds.</p>
              </div>
            </div>

            <div className="benefit-item">
              <ShieldCheck size={24} className="benefit-icon" />
              <div>
                <h4 className="benefit-title">Transparent Provenance</h4>
                <p className="benefit-text">100% genuine craftsmanship and verified origins.</p>
              </div>
            </div>

            <div className="benefit-item">
              <Headphones size={24} className="benefit-icon" />
              <div>
                <h4 className="benefit-title">Attentive Client Care</h4>
                <p className="benefit-text">Dedicated human support ready to assist every step.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
