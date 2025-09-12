import React, { useState } from 'react';

const SearchBar = ({ searchTerm = '', onSearchChange, placeholder = "Search..." }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClear = () => {
    setLocalSearch('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div style={{
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto 2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-light)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          padding: '0 1rem',
          fontSize: '1.25rem',
          color: 'var(--text-muted)'
        }}>
          🔍
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '1rem 0.5rem',
            border: 'none',
            background: 'transparent',
            fontSize: '1rem',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
        {localSearch && (
          <button
            onClick={handleClear}
            style={{
              padding: '0.5rem',
              margin: '0 0.5rem',
              background: 'var(--gray-100)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

