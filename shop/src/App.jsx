import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Items from './components/items/Items'
import Contacts from './components/contacts/Contacts'
import './index.css'

function App() {
  // ============================================================
  // 1. СОСТОЯНИЯ (теперь пустые, данные придут с сервера)
  // ============================================================
  const [items, setItems] = useState([])              // ← пустой массив
  const [loading, setLoading] = useState(true)        // ← состояние загрузки
  const [cartItems, setCartItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Все товары')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('shop')

  // ============================================================
  // 2. ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА
  // ============================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products')
        setItems(response.data)  // ← данные пришли с сервера
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
        // Можно показать сообщение об ошибке
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])  // Выполняется только один раз при монтировании

  // ============================================================
  // 3. РАБОТА С КОРЗИНОЙ
  // ============================================================
  const onAdd = useCallback((item) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(x => x.id === item.id)
      if (exist) {
        return prevItems.map(x =>
          x.id === item.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }, [])

  const onRemove = useCallback((id) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(x => x.id === id)
      if (exist.quantity === 1) {
        return prevItems.filter(x => x.id !== id)
      } else {
        return prevItems.map(x =>
          x.id === id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      }
    })
  }, [])

  // ============================================================
  // 4. ПОИСК И НАВИГАЦИЯ
  // ============================================================
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (page === 'shop') {
      setSearchTerm('')
      setSelectedCategory('Все товары')
    }
  }

  // ============================================================
  // 5. RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="wrapper">
        <div className="loader">Загрузка товаров...</div>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <Header
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSearch={handleSearch}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {currentPage === 'shop' ? (
        <Items
          items={items}
          onAdd={onAdd}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
      ) : (
        <Contacts />
      )}

      <Footer />
    </div>
  )
}

export default App