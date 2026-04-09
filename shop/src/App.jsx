import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Items from './components/Items'

function App() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Кардиган',
      img: 'sweater.jpg',
      desc: 'Свитер связан из пряжи Alize, размер oversize.',
      category: 'Одежда',
      price: '2500'
    },
    {
      id: 2,
      title: 'Чепчик',
      img: 'hephik2.jpg',
      desc: 'Тренд сезона - чепчик с ушками. Связан из пряжи Pehorka.',
      category: 'Шапки',
      price: '900'
    },
    {
      id: 3,
      title: 'Варежки',
      img: 'varehki.jpg',
      desc: 'Самые нежные и теплые! Связаны из пуха норки.',
      category: 'Варежки', 
      price: '500'
    },
    {
      id: 4,
      title: 'Свитер "Shy"',
      img: 'sweater2.jpg',
      desc: 'Укороченый свитер из пуха норки.',
      category: 'Одежда', 
      price: '1500'
    },
    {
      id: 5,
      title: 'Свитшот',
      img: 'sweater3.jpg',
      desc: 'Милый розовый свитер, связаный крючком 3:',
      category: 'Одежда', 
      price: '2050'
    },
    {
      id: 6,
      title: 'Кроп-топ',
      img: 'sweater4.jpg',
      desc: 'Свитер с овечкой из крупной вязки.',
      category: 'Одежда', 
      price: '1800'
    },
    {
      id: 7,
      title: 'Шапка',
      img: 'varehki.jpg',
      desc: 'Зимняя шапка из овечей шерсти.',
      category: 'Шапки', 
      price: '850'
    },
    {
      id: 8,
      title: 'Варежки',
      img: 'varehki.jpg',
      desc: 'Самые нежные и теплые! Связаны из пуха норки.',
      category: 'Варежки', 
      price: '500'
    },
    {
      id: 9,
      title: 'Варежки',
      img: 'varehki.jpg',
      desc: 'Самые нежные и теплые! Связаны из пуха норки.',
      category: 'Варежки', 
      price: '500'
    }
  ])

  return (
    <div className="wrapper">
      <Header />
      <Items items = {items}/>
      <Footer />
    </div>
  )
}

export default App