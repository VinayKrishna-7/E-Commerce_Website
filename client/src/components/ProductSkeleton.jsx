import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      <div className="product-image-box skeleton" />
      <div className="product-content">
        <div className="skeleton" style={{ width: '40%', height: '12px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '85%', height: '18px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ width: '50%', height: '20px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ width: '100%', height: '38px', borderRadius: 'var(--radius-sm)' }} />
      </div>
    </div>
  );
};

export default ProductSkeleton;
