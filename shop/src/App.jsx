import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Items from './components/items/Items';
import Contacts from './components/contacts/Contacts';
import AdminPanel from './components/admin/AdminPanel';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все товары');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('shop');
  const [user, setUser] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    img: '',
    description: '',
    category: '',
    price: ''
  });

  const isAdmin = user?.isAdmin === true;
  const getToken = () => localStorage.getItem('token');

  
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      setItems(response.data);
    } catch (error) {
      console.error(' Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка корзины
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
      console.error(' Ошибка загрузки корзины:', error);
      if (error.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoadingCart(false);
    }
  }, [items]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  
  const onAdd = useCallback(async (item) => {
    const token = getToken();
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/cart`,
        { productId: item.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
      console.error(' Ошибка добавления в корзину:', error);
      alert('Ошибка добавления в корзину');
    }
  }, []);

  const onRemove = useCallback(async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      const item = cartItems.find(x => x.id === id);
      if (item.quantity === 1) {
        await axios.delete(`${API_URL}/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(prev => prev.filter(x => x.id !== id));
      } else {
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
      console.error(' Ошибка удаления из корзины:', error);
    }
  }, [cartItems]);

  
  const handleAddProduct = async (newProduct) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_URL}/products`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(prev => [...prev, response.data]);
    } catch (error) {
      console.error(' Ошибка добавления товара:', error);
      alert('Ошибка добавления товара');
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/products/${updatedProduct.id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(prev => prev.map(item => 
        item.id === updatedProduct.id ? response.data : item
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error(' Ошибка обновления товара:', error);
      alert('Ошибка обновления товара');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error(' Ошибка удаления товара:', error);
      alert('Ошибка удаления товара');
    }
  };

  
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title || '',
      img: product.img || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price ? product.price.toString() : ''
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditFormData({
      title: '',
      img: '',
      description: '',
      category: '',
      price: ''
    });
  };

  
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        img: file.name
      });
    }
  };

  
  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      id: editingProduct.id,
      title: editFormData.title,
      img: editFormData.img,
      description: editFormData.description,
      category: editFormData.category,
      price: parseInt(editFormData.price)
    };
    handleEditProduct(updatedProduct);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    loadCart();
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

  if (loading) {
    return (
      <div className="wrapper">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Загрузка товаров...</h2>
        </div>
      </div>
    );
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
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
        loadingCart={loadingCart}
      />
      
      {currentPage === 'shop' ? (
        <>
          {isAdmin && (
            <AdminPanel 
              items={items}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          
          <Items
            items={items}
            onAdd={onAdd}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            isAdmin={isAdmin}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />

          {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ (с выбором файла) */}
          {editingProduct && (
            <div className="admin-modal-overlay" onClick={closeEditModal}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeEditModal}>×</button>
                <h2> Редактирование товара</h2>
                <p className="edit-hint">Редактируем: <strong>{editingProduct.title}</strong></p>
                
                <form onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label>Название</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Введите название"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Изображение</label>
                    <div className="image-upload-wrapper">
                      <input
                        type="text"
                        name="img"
                        placeholder="sweater.jpg"
                        value={editFormData.img}
                        onChange={handleEditInputChange}
                        required
                      />
                      <div className="file-upload-btn">
                        <label htmlFor="file-upload-edit" className="file-label">
                          📁 Выбрать файл
                        </label>
                        <input
                          id="file-upload-edit"
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="file-input-hidden"
                        />
                      </div>
                    </div>
                    {editFormData.img && (
                      <div className="image-preview">
                        <span> {editFormData.img}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Описание</label>
                    <textarea
                      name="description"
                      placeholder="Описание товара"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Категория</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditInputChange}
                        required
                      >
                        {['Свитера', 'Шапки', 'Шарфы', 'Варежки'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group half">
                      <label>Цена (₽)</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="0"
                        value={editFormData.price}
                        onChange={handleEditInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="submit-btn">Сохранить изменения</button>
                    <button type="button" className="cancel-btn" onClick={closeEditModal}>Отмена</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <Contacts />
      )}
      
      <Footer />
    </div>
  );
}

export default App;