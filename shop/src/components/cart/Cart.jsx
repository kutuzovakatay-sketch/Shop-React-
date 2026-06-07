import React, { memo } from 'react'
import './Cart.css'

function Cart({ cartItems, onAdd, onRemove }) {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Если корзина пуста, показываем быстро
  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h2>Корзина</h2>
        <p className="empty-cart">Корзина пуста :3</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-info">
            <h3>{item.title}</h3>
            <p>{item.price}р. x {item.quantity}</p>
            <b>{item.price * item.quantity}р.</b>
          </div>
          <div className="cart-item-actions">
            <button onClick={() => onRemove(item.id)} className="cart-btn minus">-</button>
            <span className="cart-item-quantity">{item.quantity}</span>
            <button onClick={() => onAdd(item)} className="cart-btn plus">+</button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>Итого: {totalPrice}р.</h3>
        <button className="checkout-btn">Оформить заказ</button>
      </div>
    </div>
  )
}

export default memo(Cart) // Оборачиваем Cart в memo