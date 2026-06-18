import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel({ items, onAddProduct, onDeleteProduct }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    img: '',
    desc: '',
    category: '',
    price: ''
  });

  const categories = ['Свитера', 'Шапки', 'Шарфы', 'Варежки'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      img: '',
      desc: '',
      category: '',
      price: ''
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      title: formData.title,
      img: formData.img,
      desc: formData.desc,
      category: formData.category,
      price: parseInt(formData.price)
    };
    onAddProduct(newProduct);
    closeModals();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        img: file.name
      });
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>📦 Управление товарами</h2>
        <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
          ➕ Добавить товар
        </button>
      </div>

      {/* Модальное окно добавления товара */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={closeModals}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <h2>➕ Добавление товара</h2>
            
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Введите название"
                  value={formData.title}
                  onChange={handleInputChange}
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
                    value={formData.img}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="file-upload-btn">
                    <label htmlFor="file-upload-add" className="file-label">
                      📁 Выбрать файл
                    </label>
                    <input
                      id="file-upload-add"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input-hidden"
                    />
                  </div>
                </div>
                {formData.img && (
                  <div className="image-preview">
                    <span>📷 {formData.img}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="desc"
                  placeholder="Описание товара"
                  value={formData.desc}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Категория</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
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
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Сохранить</button>
                <button type="button" className="cancel-btn" onClick={closeModals}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}