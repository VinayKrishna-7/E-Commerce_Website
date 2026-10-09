import React from 'react';
import { SORT_OPTIONS } from '../utils/constants';

const SortDropdown = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <label htmlFor="sort-select" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
        style={{
          minHeight: '38px',
          padding: '0.4rem 0.8rem',
          width: 'auto',
          cursor: 'pointer',
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
