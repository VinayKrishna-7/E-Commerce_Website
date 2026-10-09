import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, RotateCcw, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import Button from './Button';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

const ProductCard = ({ product }) => {
  const { items, addToCart, undoAddToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgSrc, setImgSrc] = useState(product?.imageUrl || FALLBACK_IMAGE);
  const [quantity, setQuantity] = useState(1);
  const [lastAddedQty, setLastAddedQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const addedTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const inBagItem = items?.find((i) => (i.product?.id || i.productId) === product.id);
  const inBagQty = inBagItem ? inBagItem.quantity : 0;

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
      setAdded(false);
    }
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
      setAdded(false);
    }
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const qtyToAdd = quantity;
    const ok = await addToCart(product, qtyToAdd);
    setAdding(false);
    if (ok) {
      setLastAddedQty(qtyToAdd);
      setAdded(true);
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
      addedTimerRef.current = setTimeout(() => {
        setAdded(false);
      }, 5000);
    }
  };

  const handleUndo = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (undoing) return;

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    setUndoing(true);
    await undoAddToCart(product.id, lastAddedQty);
    setUndoing(false);
    setAdded(false);
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
          {inBagQty > 0 && (
            <span className="product-in-bag-badge" title={`${inBagQty} in bag`}>
              {inBagQty} in bag
            </span>
          )}
        </div>

        <div className="product-card-action-row">
          {!isOutOfStock && !added && (
            <div
              className="product-card-qty-selector"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                className="card-qty-btn"
                disabled={quantity <= 1 || adding}
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                title="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="card-qty-value">{quantity}</span>
              <button
                type="button"
                className="card-qty-btn"
                disabled={quantity >= product.stock || adding}
                onClick={handleIncrement}
                aria-label="Increase quantity"
                title="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          )}

          {added ? (
            <Button
              variant="secondary"
              size="sm"
              className="product-card-btn btn-added"
              disabled={undoing}
              onClick={handleUndo}
              icon={RotateCcw}
              title="Click to take back / undo item from bag"
              style={{ flex: 1 }}
            >
              {undoing
                ? 'Taking back...'
                : (lastAddedQty > 1 ? `Added (${lastAddedQty}) • Undo` : 'Added • Undo')}
            </Button>
          ) : (
            <Button
              variant={isOutOfStock ? 'outline' : 'primary'}
              size="sm"
              className="product-card-btn"
              disabled={isOutOfStock || adding}
              onClick={handleAddToCart}
              icon={ShoppingBag}
              style={{ flex: 1 }}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : (adding
                    ? 'Adding...'
                    : (quantity > 1 ? `Add (${quantity})` : 'Add to Bag'))}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
