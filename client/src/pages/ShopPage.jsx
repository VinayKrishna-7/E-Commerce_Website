import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import { CATEGORIES } from '../utils/constants';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import PriceFilter from '../components/PriceFilter';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state derived from URL searchParams
  const categoryParam = searchParams.get('category') || 'All Products';
  const searchParam = searchParams.get('search') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageParam,
        limit: 12,
        sort: sortParam,
      };

      if (categoryParam && categoryParam !== 'All Products') {
        params.category = categoryParam;
      }
      if (searchParam) {
        params.search = searchParam;
      }
      if (minPriceParam) {
        params.minPrice = minPriceParam;
      }
      if (maxPriceParam) {
        params.maxPrice = maxPriceParam;
      }

      const res = await productService.getProducts(params);
      setProducts(res.products || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, minPriceParam, maxPriceParam, sortParam, pageParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update query params helper
  const updateQuery = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'All Products') {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });
    // Whenever filters change (except page change), reset to page 1
    if (!('page' in newParams)) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleCategorySelect = (cat) => {
    updateQuery({ category: cat });
  };

  const handleSearch = (q) => {
    updateQuery({ search: q });
  };

  const handlePriceApply = (min, max) => {
    updateQuery({ minPrice: min, maxPrice: max });
  };

  const handlePriceClear = () => {
    updateQuery({ minPrice: undefined, maxPrice: undefined });
  };

  const handleSortChange = (sortVal) => {
    updateQuery({ sort: sortVal });
  };

  const handlePageChange = (newPage) => {
    updateQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    categoryParam !== 'All Products' ||
    searchParam ||
    minPriceParam ||
    maxPriceParam ||
    sortParam !== 'newest';

  return (
    <div className="container animate-fade-in">
      <div className="shop-layout">
        {/* Sidebar Filters Desktop */}
        <aside className="shop-sidebar">
          {/* Search Box */}
          <div className="shop-filter-card">
            <h4 className="shop-filter-title">Search</h4>
            <SearchBar
              value={searchParam}
              onChange={(val) => handleSearch(val)}
              onSubmit={(val) => handleSearch(val)}
            />
          </div>

          {/* Category Filter */}
          <div className="shop-filter-card">
            <h4 className="shop-filter-title">Categories</h4>
            <div className="category-filter-list">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className={`category-filter-item ${categoryParam === cat ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  <span>{cat}</span>
                  {categoryParam === cat && <span style={{ fontSize: '11px', opacity: 0.8 }}>Selected</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="shop-filter-card">
            <h4 className="shop-filter-title">Price Range</h4>
            <PriceFilter
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              onApply={handlePriceApply}
              onClear={handlePriceClear}
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetFilters}
              style={{ width: '100%' }}
            >
              Reset All Filters
            </Button>
          )}
        </aside>

        {/* Main Product Area */}
        <main>
          {/* Header Bar */}
          <div className="shop-main-header">
            <div>
              <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
                {categoryParam === 'All Products' ? 'All Products' : categoryParam}
              </h1>
              <span className="shop-count">
                {loading ? 'Updating catalog...' : `Showing ${products.length} of ${totalCount} items`}
              </span>
            </div>

            <div className="shop-controls">
              <SortDropdown value={sortParam} onChange={handleSortChange} />
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-6)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Filters:</span>
              {categoryParam !== 'All Products' && (
                <span className="badge badge-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {categoryParam}
                  <X
                    size={13}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCategorySelect('All Products')}
                  />
                </span>
              )}
              {searchParam && (
                <span className="badge badge-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  "{searchParam}"
                  <X
                    size={13}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSearch('')}
                  />
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="badge badge-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ${minPriceParam || '0'} – ${maxPriceParam || 'Any'}
                  <X
                    size={13}
                    style={{ cursor: 'pointer' }}
                    onClick={handlePriceClear}
                  />
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && <ErrorMessage message={error} onRetry={fetchProducts} />}

          {/* Product Grid / Empty State */}
          {!loading && !error && products.length === 0 ? (
            <EmptyState
              title="No matching products found"
              description="We could not find any products that match your current filters. Try relaxing your price range or clearing keywords."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <ProductGrid products={products} loading={loading} skeletonCount={9} />
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
