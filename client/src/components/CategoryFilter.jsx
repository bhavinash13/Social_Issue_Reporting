import React from 'react';

const categories = [
  { id: 'general', name: 'General Issues', icon: '📋' },
  { id: 'sanitation', name: 'Sanitation', icon: '🗑️' },
  { id: 'road', name: 'Road', icon: '🛣️' },
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'water', name: 'Water', icon: '💧' },
  { id: 'safety', name: 'Hospital', icon: '🏥' },
  { id: 'other', name: 'Other', icon: '📝' }
];

const CategoryFilter = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="category-list">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;