import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CategoryCard = ({ title, count, image, categoryQuery }) => {
  return (
    <Link to={`/shop?category=${encodeURIComponent(categoryQuery)}`} className="category-card">
      <img src={image} alt={title} loading="lazy" />
      <div className="category-card-overlay">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="category-card-title">{title}</h3>
            {count && <span className="category-card-subtitle">{count} items</span>}
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
