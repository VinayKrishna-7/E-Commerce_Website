import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import Button from './Button';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgSrc, setImgSrc] = useState(product?.imageUrl || FALLBACK_IMAGE);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const ok = await addToCart(product, 1);
    setAdding(false);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/products/${product.id}`} className="product-image-box">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />

          {product.featured && (
            <div className="product-badge-group">
              <span className="badge badge-category">Featured</span>
            </div>
          )}
        </Link>

        <button
          type="button"
          className={`product-wishlist-btn ${isSaved ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-content">
        <span className="product-category-text">{product.category}</span>

        <Link to={`/products/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>

        {isOutOfStock ? (
          <div className="product-stock-tag out">Out of stock</div>
        ) : isLowStock ? (
          <div className="product-stock-tag low">Only {product.stock} units remaining</div>
        ) : (
          <div className="product-stock-tag in">In stock ({product.stock})</div>
        )}

        <div className="product-price-row">
          <span className="product-price-current">{formatCurrency(product.price)}</span>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <span className="product-price-original">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <Button
          variant={added ? 'secondary' : isOutOfStock ? 'outline' : 'primary'}
          size="sm"
          className="product-card-btn"
          disabled={isOutOfStock || adding}
          onClick={handleAddToCart}
          icon={added ? Check : ShoppingBag}
        >
          {added ? 'Added to Bag' : isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
