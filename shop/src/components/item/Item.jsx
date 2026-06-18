import React, { Component } from 'react';
import './Item.css';

export class Item extends Component {
  state = {
    showMenu: false
  };

  toggleMenu = (e) => {
    e.stopPropagation();
    this.setState(prev => ({ showMenu: !prev.showMenu }));
  };

  closeMenu = () => {
    this.setState({ showMenu: false });
  };

  handleEdit = () => {
    this.props.onEdit(this.props.item);
    this.closeMenu();
  };

  handleDelete = () => {
    this.props.onDelete(this.props.item.id);
    this.closeMenu();
  };

  render() {
    const { item, onAdd, isAdmin } = this.props;
    const { showMenu } = this.state;

    return (
      <div className="item">
        <img src={"./img/" + item.img} alt={item.title} />
        <h2>{item.title}</h2>
        <p>{item.description || item.desc}</p>
        <b>{item.price}р.</b>
        <div 
          className="add-to-cart" 
          onClick={() => onAdd(item)}
        >
          +
        </div>
        
        {isAdmin && (
          <div className="item-admin-menu">
            <button 
              className="menu-dots" 
              onClick={this.toggleMenu}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button className="menu-item edit" onClick={this.handleEdit}>
                  ✏️ Редактировать
                </button>
                <button className="menu-item delete" onClick={this.handleDelete}>
                  🗑️ Удалить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Item;  