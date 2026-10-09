import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Truck,
  RotateCcw,
  Check,
  Package,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency, calculateDiscount } from '../utils/formatters';
import Button from '../components/Button';
import QuantitySelector from '../components/QuantitySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductGrid from '../components/ProductGrid';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setQuantity(1);
      try {
        const data = await productService.getProductById(id);
        setProduct(data.product);

        // Fetch related products in the same category
        if (data.product?.category) {
          try {
            const relData = await productService.getProducts({
              category: data.product.category,
              limit: 4,
            });
            setRelated(relData.products.filter((p) => p.id !== data.product.id).slice(0, 4));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <ErrorMessage
          message={error || 'Product not found'}
          onRetry={() => window.location.reload()}
        />
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/shop">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    const ok = await addToCart(product, quantity);
    setAdding(false);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          margin: 'var(--space-6) 0 var(--space-4)',
        }}
      >
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-secondary)' }}>
          {product.category}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="product-details-grid">
        {/* Gallery Image */}
        <div className="product-gallery">
          <div className="product-main-image-wrap">
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Product Details Info */}
        <div className="product-info-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span className="badge badge-category">{product.category}</span>
            {discount && <span className="badge badge-discount">{discount}</span>}
          </div>

          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-detail-price">
            <span>{formatCurrency(product.price)}</span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="product-detail-original-price">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock status indicator */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            {isOutOfStock ? (
              <span className="badge badge-error">Out of stock</span>
            ) : isLowStock ? (
              <span className="badge badge-warning">Low Stock — Only {product.stock} units remain</span>
            ) : (
              <span className="badge badge-success">In Stock ({product.stock} available)</span>
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          {/* Action Row: Quantity & Add to Cart */}
          <div className="product-action-row">
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock}
              />
            )}

            <Button
              variant={added ? 'secondary' : isOutOfStock ? 'outline' : 'primary'}
              size="lg"
              style={{ flex: 1 }}
              disabled={isOutOfStock || adding}
              onClick={handleAddToCart}
              icon={added ? Check : ShoppingBag}
            >
              {added ? 'Added to Cart' : isOutOfStock ? 'Sold Out' : `Add to Bag • ${formatCurrency(Number(product.price) * quantity)}`}
            </Button>

            <button
              type="button"
              className="action-btn-pill"
              onClick={() => toggleWishlist(product)}
              style={{
                width: 48,
                height: 48,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: isSaved ? '#D32F2F' : 'var(--text-primary)',
              }}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Reassurance items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--border-color)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Truck size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Free delivery on orders over ₹999. Dispatched in 24 hours.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <RotateCcw size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>30-day return policy. Unconditional satisfaction guarantee.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Package size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Plastic-free recyclable shipping packaging.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-10)', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2>You May Also Admire</h2>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>
              View more in {product.category}
            </Link>
          </div>
          <ProductGrid products={related} loading={false} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
