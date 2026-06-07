import React, { useState } from 'react'
import {FaShoppingCart} from 'react-icons/fa'
import './header.css'

export default function Header() {
  let [CartOpen,setCartOpen] = useState(false);
  return (
    <header>
      <div>
        <span className='logo'>Knitten things
          <input type="text" placeholder='Поиск :3' />
        </span>
        <ul className='nav'>
          <li>Контакты</li>
          <li>Личный кабинет</li>
        </ul>
        <FaShoppingCart onClick={() => setCartOpen(CartOpen = !CartOpen)} className={`shop-cart-button ${CartOpen && 'active'}`}/>
      </div>
        <div className='presentasion'></div>
    </header>
  )
}