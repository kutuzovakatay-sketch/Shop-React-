import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Items from './components/items/Items';
import Contacts from './components/contacts/Contacts';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // Товары (локально в JSON)
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
      img: 'hat.jpg',
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
  ]);

  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все товары');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('shop');
  const [user, setUser] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // Получаем токен из localStorage
  const getToken = () => localStorage.getItem('token');

  // Загрузка корзины из БД
  const loadCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoadingCart(true);
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Преобразуем данные из БД в формат корзины
      const cartFromDB = response.data.map(item => {
        const product = items.find(p => p.id === item.product_id);
        return {
          id: item.product_id,
          title: product?.title || 'Товар',
          price: product?.price || 0,
          img: product?.img || '',
          quantity: item.quantity
        };
      });
      
      setCartItems(cartFromDB);
    } catch (error) {
      console.error('❌ Ошибка загрузки корзины:', error);
      // Если ошибка авторизации, очищаем корзину
      if (error.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoadingCart(false);
    }
  }, [items]);

  // Загружаем корзину при входе пользователя
  useEffect(() => {
    const token = getToken();
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        loadCart();
      } catch (e) {
        console.error('Ошибка парсинга user:', e);
      }
    }
  }, [loadCart]);

  // Добавление товара в корзину
  const onAdd = useCallback(async (item) => {
    const token = getToken();
    
    if (!token) {
      // Если не авторизованы — показываем сообщение
      alert('Пожалуйста, войдите в аккаунт, чтобы добавить товары в корзину');
      return;
    }

    try {
      // Отправляем запрос на сервер
      await axios.post(
        `${API_URL}/cart`,
        { productId: item.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Обновляем локальное состояние
      setCartItems(prev => {
        const exist = prev.find(x => x.id === item.id);
        if (exist) {
          return prev.map(x =>
            x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    } catch (error) {
      console.error('❌ Ошибка добавления в корзину:', error);
      if (error.response?.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите заново.');
      } else {
        alert('Ошибка добавления в корзину');
      }
    }
  }, []);

  // Удаление товара из корзины
  const onRemove = useCallback(async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      // Находим товар в корзине
      const item = cartItems.find(x => x.id === id);
      
      if (item.quantity === 1) {
        // Удаляем полностью
        await axios.delete(`${API_URL}/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(prev => prev.filter(x => x.id !== id));
      } else {
        // Уменьшаем количество
        await axios.put(
          `${API_URL}/cart/${id}`,
          { quantity: item.quantity - 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(prev =>
          prev.map(x =>
            x.id === id ? { ...x, quantity: x.quantity - 1 } : x
          )
        );
      }
    } catch (error) {
      console.error('❌ Ошибка удаления из корзины:', error);
    }
  }, [cartItems]);

  // Очистка корзины при выходе
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]); // Очищаем корзину
  }, []);

  // Обработчик входа
  const handleLogin = useCallback((userData) => {
    setUser(userData);
    loadCart(); // Загружаем корзину после входа
  }, [loadCart]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page === 'shop') {
      setSearchTerm('');
      setSelectedCategory('Все товары');
    }
  };

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
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
        loadingCart={loadingCart}
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
  );
}

export default App;