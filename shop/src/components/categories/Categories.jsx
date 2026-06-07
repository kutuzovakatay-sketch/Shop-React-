import React from 'react'
import './Categories.css'

export default function Categories({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="categories-container">
      <ul className="categories-list">
        {categories.map(category => (
          <li 
            key={category}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  )
}