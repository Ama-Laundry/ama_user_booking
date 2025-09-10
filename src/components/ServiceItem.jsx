// src/components/ServiceItem.jsx

import { useState, useEffect } from "react";

function ServiceItem({ item, quantity, onQuantityChange }) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  // This effect syncs the component if the item is removed from the "Totals" box
  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    onQuantityChange(item, newQuantity);
  };

  const handleDecrement = () => {
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      onQuantityChange(item, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newQuantity = isNaN(value) || value < 0 ? 0 : value;
    setCurrentQuantity(newQuantity);
    onQuantityChange(item, newQuantity);
  };

  return (
    <div className="service-card-item">
      <img
        src={item.image}
        alt={item.name}
        className="service-img"
        loading="lazy"
      />
      <div className="service-info">
        <h4 dangerouslySetInnerHTML={{ __html: item.name }} />

        {/* ✅ FIX: New container for price and counter */}
        <div className="price-counter-row">
          <p className="price">৳{item.price}</p>
          <div className="quantity-control">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={currentQuantity === 0}
            >
              -
            </button>
            <input
              type="number"
              value={currentQuantity}
              onChange={handleInputChange}
              min="0"
            />
            <button type="button" onClick={handleIncrement}>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;
