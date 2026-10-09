import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import QuantitySelector from '../components/QuantitySelector';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const CartPage = () => {
  const {
    items,
    loading,
    subtotal,
    shipping,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping bag is empty"
          description="Discover our collection of utilitarian apparel, crafted home goods, and minimalist audio."
          actionLabel="Explore Catalog"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div style={{ margin: 'var(--space-8) 0 var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
          Shopping Bag
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Review your items and proceed when ready.
        </p>
      </div>

      <div className="cart-layout">
        {/* Items List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
            <button
              type="button"
              onClick={clearCart}
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              Clear Entire Bag
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const lineTotal = Number(product.price) * item.quantity;
              const isOverStock = item.quantity > product.stock;

              return (
                <div key={item.id} className="cart-item-row">
                  {/* Thumbnail */}
                  <Link to={`/products/${product.id}`} className="cart-item-thumb">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </Link>

                  {/* Info & Quantity */}
                  <div className="cart-item-info">
                    <Link to={`/products/${product.id}`} className="cart-item-name">
                      {product.name}
                    </Link>
                    <span className="cart-item-price">
                      {formatCurrency(product.price)} each
                    </span>

                    {isOverStock && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-error)', fontWeight: 500 }}>
                        Exceeds stock ({product.stock} available)
                      </span>
                    )}

                    <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, qty, product.stock)}
                        min={1}
                        max={product.stock}
                      />

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                        }}
                        aria-label="Remove item from bag"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 'var(--text-base)' }}>
                    {formatCurrency(lineTotal)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <Link to="/shop">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div>
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            grandTotal={grandTotal}
            actionButton={
              <Link to="/checkout" style={{ width: '100%', display: 'block' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ width: '100%' }}
                  icon={ArrowRight}
                >
                  Proceed to Checkout
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
