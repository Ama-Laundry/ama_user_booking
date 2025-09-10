function Confirmation({
  orderId,
  room,
  camp,
  slot,
  pickup,
  selectedItems,
  total,
  customerName,
  specialInstructions,
}) {
  return (
    <div className="confirmation">
      <h2 className="text-2xl font-bold text-center mb-6">
        Booking Confirmed!
      </h2>
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-center mb-4">
          Thank you for your order, {customerName}!
        </p>
        <p className="text-center mb-6">Your Order ID is: #{orderId}</p>
        <div className="grid gap-4">
          <div>
            <h4 className="font-bold mb-2">Order Details</h4>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <p>Camp:</p>
                <p>{camp}</p>
              </div>
              <div className="flex justify-between">
                <p>Room:</p>
                <p>{room}</p>
              </div>
              <div className="flex justify-between">
                <p>Pickup Slot:</p>
                <p>{slot}</p>
              </div>
              <div className="flex justify-between">
                <p>Pickup Method:</p>
                <p>{pickup}</p>
              </div>
              {specialInstructions && (
                <div className="flex justify-between">
                  <p>Special Instructions:</p>
                  <p>{specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Selected Services</h4>
            <div className="grid gap-2">
              {selectedItems.map((entry) => (
                <div
                  key={entry.item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p>{entry.item.name}</p>
                    <p className="text-sm text-gray-500">
                      {entry.quantity} x ${entry.item.price.toFixed(2)}
                    </p>
                  </div>
                  <p>${(entry.item.price * entry.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-xl">
            <p>Total:</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
