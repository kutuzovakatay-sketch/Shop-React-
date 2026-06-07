import React, { Component } from 'react'
import Item from '../item/Item'
import './Items.css'

export class Items extends Component {
  render() {
    // Сначала фильтруем по категории
    let filteredItems = this.props.selectedCategory === 'Все товары' 
      ? this.props.items 
      : this.props.items.filter(item => item.category === this.props.selectedCategory)
    
    // Затем фильтруем по поисковому запросу
    if (this.props.searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(this.props.searchTerm.toLowerCase())
      )
    }

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
              onAdd={this.props.onAdd}
            />
          ))
        )}
      </main>
    )
  }
}

export default Items