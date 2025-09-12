function Totals({
  selectedItems,
  room,
  camp,
  slot,
  pickup,
  specialInstructions,
  onRemoveItem,
}) {
  const total = selectedItems.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  return (
    <div className="totals">
      <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
      <div className="grid gap-2">
        {selectedItems.map((entry) => (
          <div
            key={entry.item.id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{entry.item.name}</p>
              <p className="text-sm text-gray-500">
                {entry.quantity} x ${entry.item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold mr-4">
                ${(entry.item.price * entry.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => onRemoveItem(entry.item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <div className="grid gap-2">
        <div className="flex justify-between">
          <p className="font-semibold">Camp:</p>
          <p>{camp}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Room:</p>
          <p>{room}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Pickup Slot:</p>
          <p>{slot}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Pickup Method:</p>
          <p>{pickup}</p>
        </div>
        {specialInstructions && (
          <div className="flex justify-between">
            <p className="font-semibold">Special Instructions:</p>
            <p>{specialInstructions}</p>
          </div>
        )}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between font-bold text-xl">
        <p>Total:</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Totals;
