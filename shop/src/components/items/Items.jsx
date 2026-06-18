import React, { Component } from 'react';
import Item from '../item/Item';
import './Items.css';

export class Items extends Component {
  render() {
    const { items, onAdd, selectedCategory, searchTerm, isAdmin, onEdit, onDelete } = this.props;
    
    let filteredItems = selectedCategory === 'Все товары' 
      ? items 
      : items.filter(item => item.category === selectedCategory);
    
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('📦 Items props:', { isAdmin, onEdit, onDelete }); // ← Добавьте для проверки

    return (
      <main>
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>Товаров не найдено :(</p>
            <p className="no-items-suggestion">Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          filteredItems.map(el => (
            <Item 
              key={el.id} 
              item={el} 
              onAdd={onAdd}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </main>
    );
  }
}

export default Items;