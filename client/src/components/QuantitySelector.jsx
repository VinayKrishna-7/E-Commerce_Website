import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({
  quantity = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className = '',
}) => {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={`quantity-selector ${className}`}>
      <button
        type="button"
        className="quantity-btn"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>

      <span className="quantity-value">{quantity}</span>

      <button
        type="button"
        className="quantity-btn"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
