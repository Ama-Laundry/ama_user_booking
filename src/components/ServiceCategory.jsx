import ServiceItem from './ServiceItem';

function ServiceCategory({ title, items, selectedItems, onQuantityChange }) {
  return (
    <section className="category">
      <h2>{title}</h2>
      <ul className="service-list">
        {items.map(item => {
          const selectedItem = selectedItems.find(i => i.item.id === item.id) || { quantity: 0 };
          return (
            <ServiceItem
              key={item.id}
              item={item}
              quantity={selectedItem.quantity}
              onQuantityChange={onQuantityChange}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default ServiceCategory;
