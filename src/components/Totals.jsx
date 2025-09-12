import React from "react";

export default function Totals({
  selectedItems,
  room,
  camp,
  slot,
  pickup,
  onRemoveItem,
  specialInstructions,
}) {
  if (selectedItems.length === 0) {
    return (
      <div className="totals">
        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
        <p>No items selected yet.</p>
      </div>
    );
  }

  // ✅ FIX: Filter out any items that might be malformed before reducing.
  const validItems = selectedItems.filter((entry) => entry && entry.item);

  const total = validItems.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );

  return (
    <div className="totals">
      <h2 className="text-xl font-semibold mb-4">Your Order</h2>
      <div className="order-summary">
        <p>
          <strong>Camp:</strong> {camp}
        </p>
        <p>
          <strong>Room:</strong> {room}
        </p>
        <p>
          <strong>Pickup Slot:</strong> {slot}
        </p>
        <p>
          <strong>Pickup Method:</strong> {pickup}
        </p>
        {specialInstructions && (
          <p>
            <strong>Instructions:</strong> {specialInstructions}
          </p>
        )}
      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-2">Selected Items:</h3>
      <ul className="list-disc pl-5 space-y-2">
        {/* ✅ FIX: Filter out any items that might be malformed before mapping. */}
        {validItems.map(({ item, quantity }) => (
          <li key={item.id} className="item">
            <div className="details">
              <span className="font-semibold">{item.title}</span>
              <span className="quantity"> (x{quantity})</span>
            </div>
            <div className="actions">
              <span>${(item.price * quantity).toFixed(2)}</span>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr className="my-4" />

      <div className="text-right">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
