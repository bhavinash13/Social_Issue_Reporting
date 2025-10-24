import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;