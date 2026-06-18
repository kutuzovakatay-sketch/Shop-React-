import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Cart from '../cart/Cart';
import Categories from '../categories/Categories';
import AuthModal from '../auth/AuthModal';
import './Header.css';

export default function Header({ 
  cartItems, 
  onAdd, 
  onRemove, 
  selectedCategory, 
  onSelectCategory, 
  onSearch,
  currentPage,
  onPageChange,
  user,
  onLogout,
  onLogin,
  loadingCart
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const cartRef = useRef(null);
  const cartButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ['Все товары', 'Свитера', 'Шапки', 'Шарфы', 'Варежки'];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Закрываем дропдаун при клике вне него
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Закрываем корзину при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && 
          !cartRef.current.contains(event.target) &&
          cartButtonRef.current && 
          !cartButtonRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen]);

  const toggleCart = useCallback(() => {
    setCartOpen(prev => !prev);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout(); // ← вызываем функцию из App
  };

  const handleLogin = (userData) => {
    onLogin(userData);
    setIsAuthOpen(false);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-section">
          <span 
            className='logo' 
            onClick={() => onPageChange('shop')}
            style={{ cursor: 'pointer' }}
          >
            Knitten things
          </span>
          {currentPage === 'shop' && (
            <input 
              type="text" 
              placeholder='Поиск :3' 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}
        </div>
        
        <div className="right-section">
          <ul className='nav'>
            <li 
              onClick={() => onPageChange('contacts')}
              className={currentPage === 'contacts' ? 'active' : ''}
            >
              Контакты
            </li>
            <li 
              onClick={handleProfileClick}
              className={isAuthOpen ? 'active' : ''}
              ref={dropdownRef}
            >
              {user ? ` ${user.name}` : 'Личный кабинет'}
              
              {user && isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-item">
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <span>Выйти</span>
                  </div>
                </div>
              )}
            </li>
          </ul>
          
          {currentPage === 'shop' && (
            <div className="cart-icon-container" ref={cartButtonRef}>
              <FaShoppingCart 
                onClick={toggleCart}
                className={`shop-cart-button ${cartOpen ? 'active' : ''}`}
              />
              {loadingCart ? (
                <span className="cart-badge loading">...</span>
              ) : (
                totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )
              )}
            </div>
          )}
        </div>
      </div>
      
      {currentPage === 'shop' && (
        <>
          <Categories 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
          
          {selectedCategory === 'Все товары' && !searchTerm && (
            <div className='presentasion'></div>
          )}
        </>
      )}
      
      {cartOpen && currentPage === 'shop' && (
        <div ref={cartRef}>
          <Cart 
            cartItems={cartItems} 
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </header>
  );
}