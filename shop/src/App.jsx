import React, { useState, useCallback } from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Items from './components/items/Items'
import Contacts from './components/contacts/Contacts'
import './index.css'

function App() {
  const [items] = useState([
    {
      id: 1,
      title: 'Кардиган',
      img: 'sweater.jpg',
      desc: 'Свитер связан из пряжи Alize, размер oversize.',
      category: 'Свитера',
      price: 2500
    },
    {
      id: 2,
      title: 'Чепчик',
      img: 'hephik2.jpg',
      desc: 'Тренд сезона - чепчик с ушками. Связан из пряжи Pehorka.',
      category: 'Шапки',
      price: 900
    },
    {
      id: 3,
      title: 'Варежки',
      img: 'varehki.jpg',
      desc: 'Самые нежные и теплые! Связаны из пуха норки.',
      category: 'Варежки', 
      price: 500
    },
    {
      id: 4,
      title: 'Свитер "Shy"',
      img: 'sweater2.jpg',
      desc: 'Укороченый свитер из пуха норки.',
      category: 'Свитера', 
      price: 1500
    },
    {
      id: 5,
      title: 'Свитшот',
      img: 'sweater3.jpg',
      desc: 'Милый розовый свитер, связаный крючком 3:',
      category: 'Свитера', 
      price: 2050
    },
    {
      id: 6,
      title: 'Кроп-топ',
      img: 'sweater4.jpg',
      desc: 'Свитер с овечкой из крупной вязки.',
      category: 'Свитера', 
      price: 1800
    },
    {
      id: 7,
      title: 'Шапка',
      img: 'varehki.jpg',
      desc: 'Зимняя шапка из овечей шерсти.',
      category: 'Шапки', 
      price: 850
    },
    {
      id: 8,
      title: 'Шарф "Уют"',
      img: 'scarf.jpg',
      desc: 'Теплый и мягкий шарф из alpaca.',
      category: 'Шарфы', 
      price: 1200
    },
    {
      id: 9,
      title: 'Шарф "Снежинка"',
      img: 'scarf2.jpg',
      desc: 'Ажурный шарф из тонкой шерсти.',
      category: 'Шарфы', 
      price: 1100
    }
  ])

  const [cartItems, setCartItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Все товары')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('shop') // 'shop' или 'contacts'

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

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Сбрасываем поиск и категорию при переходе на главную
    if (page === 'shop') {
      setSearchTerm('')
      setSelectedCategory('Все товары')
    }
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