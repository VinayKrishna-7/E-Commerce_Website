import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search minimalist goods, apparel, audio...',
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  const handleClear = () => {
    if (onChange) onChange('');
    if (onSubmit) onSubmit('');
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar-form ${className}`}>
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search products"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Clear search query"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
