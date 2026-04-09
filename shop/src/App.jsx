import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Items from './components/Items'

function App() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Свитер',
      img: 'sweater.jpg',
      desc: 'Свитер связан из пряжи Alize, размер oversize.',
      category: 'одежда',
      price: '2500'
    },
    {
      id: 2,
      title: 'Чепчик',
      img: 'hephik2.jpg',
      desc: 'Тренд сезона - чепчик с ушками. Связан из пряжи Pehorka.',
      category: 'шапки',
      price: '900'
    },
    {
      id: 3,
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