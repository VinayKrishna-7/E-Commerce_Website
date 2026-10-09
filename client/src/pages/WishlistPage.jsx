import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = async (product) => {
    const ok = await addToCart(product, 1);
    if (ok) {
      removeFromWishlist(product.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save the items you admire by clicking the heart icon on any product."
          actionLabel="Browse Collection"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          Saved Items
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved in your personal wishlist.
        </p>
      </div>

      <div className="product-grid">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;
          const isOutOfStock = product.stock <= 0;

          return (
            <div key={item.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-image-box">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </Link>

              <div className="product-content">
                <span className="product-category-text">{product.category}</span>
                <Link to={`/products/${product.id}`}>
                  <h3 className="product-title">{product.name}</h3>
                </Link>

                <div className="product-price-row">
                  <span className="product-price-current">{formatCurrency(product.price)}</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ flex: 1 }}
                    disabled={isOutOfStock}
                    onClick={() => handleMoveToCart(product)}
                    icon={ShoppingBag}
                  >
                    {isOutOfStock ? 'Sold Out' : 'Move to Cart'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <Link to="/shop">
          <Button variant="outline" icon={ArrowLeft}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
