import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductGrid = ({ products = [], loading = false, skeletonCount = 8 }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
