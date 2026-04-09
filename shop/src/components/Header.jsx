import React, { useState } from 'react'
import {FaShoppingCart} from 'react-icons/fa'

export default function Header() {
  let [CartOpen,setCartOpen] = useState(false);
  return (
    <header>
      <div>
        <span className='logo'>Knitten things</span>
        <ul className='nav'>
          <li>Про нас</li>
          <li>Контакты</li>
          <li>Личный кабинет</li>
        </ul>
        <FaShoppingCart onClick={() => setCartOpen(CartOpen = !CartOpen)} className={`shop-cart-button ${CartOpen && 'active'}`}/>
      </div>
        <div className='presentasion'></div>
    </header>
  )
}
