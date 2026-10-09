import React, { useState, useEffect } from 'react';
import Button from './Button';

const PriceFilter = ({ minPrice, maxPrice, onApply, onClear }) => {
  const [min, setMin] = useState(minPrice || '');
  const [max, setMax] = useState(maxPrice || '');

  useEffect(() => {
    setMin(minPrice || '');
    setMax(maxPrice || '');
  }, [minPrice, maxPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(min ? Number(min) : undefined, max ? Number(max) : undefined);
  };

  const handleReset = () => {
    setMin('');
    setMax('');
    if (onClear) onClear();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div className="price-range-inputs">
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Min (₹)</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="form-input"
            style={{ padding: '0.4rem 0.6rem', minHeight: '36px' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Max (₹)</label>
          <input
            type="number"
            min="0"
            placeholder="25000"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="form-input"
            style={{ padding: '0.4rem 0.6rem', minHeight: '36px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button type="submit" size="sm" variant="primary" style={{ flex: 1 }}>
          Apply Price
        </Button>
        {(min || max) && (
          <Button type="button" size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};

export default PriceFilter;
