function PickupOptions({ pickup, setPickup }) {
  return (
    <div className="field">
      <label>Pickup Method *</label>
      <div className="pickup">
        <label className="option">
          <input
            type="radio"
            name="pickup"
            value="Inside Room"
            checked={pickup === "Inside Room"}
            onChange={(e) => setPickup(e.target.value)}
          />
          Pickup inside the room
        </label>
        <label className="option">
          <input
            type="radio"
            name="pickup"
            value="Outside Door"
            checked={pickup === "Outside Door"}
            onChange={(e) => setPickup(e.target.value)}
          />
          Pickup outside, in front of the door
        </label>
      </div>
    </div>
  );
}

export default PickupOptions;
