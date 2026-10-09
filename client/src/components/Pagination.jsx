import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-10)',
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onPageChange(p)}
          style={{ minWidth: '36px' }}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;
