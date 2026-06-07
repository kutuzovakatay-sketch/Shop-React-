import React, { useState } from 'react'
import './AuthModal.css'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true) // true - вход, false - регистрация
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Очищаем ошибку при вводе
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Введите email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    } else if (formData.password.length < 4) {
      newErrors.password = 'Пароль должен быть не менее 4 символов'
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Введите ваше имя'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (isLogin) {
        // Логика входа
        console.log('Вход:', formData.email, formData.password)
        // Здесь можно добавить запрос к API
        alert(`Добро пожаловать назад, ${formData.email}!`)
        onClose()
      } else {
        // Логика регистрации
        console.log('Регистрация:', formData)
        // Здесь можно добавить запрос к API
        alert(`Регистрация успешна! Добро пожаловать, ${formData.name}!`)
        onClose()
      }
      // Очищаем форму
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
      })
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          <p>{isLogin ? 'Рады видеть вас снова!' : 'Создайте новый аккаунт'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>Подтвердите пароль</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}
          
          <button type="submit" className="auth-submit">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button onClick={switchMode} className="auth-switch">
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
        
        {isLogin && (
          <div className="auth-demo">
            <p>Демо-доступ:</p>
            <p>Email: demo@example.com</p>
            <p>Пароль: 1234</p>
          </div>
        )}
      </div>
    </div>
  )
}