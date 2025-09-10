// src/components/ServiceListItem.jsx

import { useState } from 'react';

function ServiceListItem({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Prevent form submission if it's a link
    onAddToCart(item, quantity);
  };

  return (
    <div className="service-list-item">
      <img src={item.image} alt={item.name} className="item-image" />
      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-price">Price: ৳{item.price}</p>
        <div className="item-controls">
          <div className="quantity-selector">
            <button type="button" onClick={handleDecrement}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={handleIncrement}>+</button>
          </div>
          <a href="#" className="add-to-cart-link" onClick={handleAddToCartClick}>
            Add to Cart
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServiceListItem;
