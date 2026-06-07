import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import Cart from '../cart/Cart'
import Categories from '../categories/Categories'
import './Header.css'

export default function Header({ cartItems, onAdd, onRemove, selectedCategory, onSelectCategory, onSearch }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const categories = ['Все товары', 'Свитера', 'Шапки', 'Шарфы', 'Варежки']

  // Обработчик изменения поиска
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && 
          !cartRef.current.contains(event.target) &&
          cartButtonRef.current && 
          !cartButtonRef.current.contains(event.target)) {
        setCartOpen(false)
      }
    }

    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cartOpen])

  const toggleCart = useCallback(() => {
    setCartOpen(prev => !prev)
  }, [])

  return (
    <header>
      <div className="header-container">
        <div className="logo-section">
          <span className='logo'>Knitten things</span>
          <input 
            type="text" 
            placeholder='Поиск :3' 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="right-section">
          <ul className='nav'>
            <li>Контакты</li>
            <li>Личный кабинет</li>
          </ul>
          
          <div className="cart-icon-container" ref={cartButtonRef}>
            <FaShoppingCart 
              onClick={toggleCart}
              className={`shop-cart-button ${cartOpen ? 'active' : ''}`}
            />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </div>
        </div>
      </div>
      
      <Categories 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      
      {selectedCategory === 'Все товары' && !searchTerm && (
        <div className='presentasion'></div>
      )}
      
      {cartOpen && (
        <div ref={cartRef}>
          <Cart 
            cartItems={cartItems} 
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>
      )}
    </header>
  )
}