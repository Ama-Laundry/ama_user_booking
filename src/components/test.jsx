import { useState, useEffect, useMemo } from "react";
import useServices from "src/hooks/useServices";
import usePickupSlots from "src/hooks/usePickupSlots";
import useOrderSubmission from "src/hooks/useOrderSubmission";
import useCamps from "src/hooks/useCamps";
import ServiceCategory from "src/components/ServiceCategory";
import PickupOptions from "src/components/PickupOptions";
import Totals from "src/components/Totals";
import Confirmation from "src/components/Confirmation";

function BookingForm() {
  const { services, loading: servicesLoading } = useServices();

  // FIX: Destructure the object returned from the hook
  const { slots, refreshSlots } = usePickupSlots();

  const { camps, loading: campsLoading, error: campsError } = useCamps();

  const [room, setRoom] = useState("");
  const [slot, setSlot] = useState("");
  const [pickup, setPickup] = useState("");
  const [campId, setCampId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const {
    submitOrder,
    loading: isSubmitting,
    error: submissionError,
    data: orderData,
  } = useOrderSubmission();

  const uniforms = services.filter((s) => s.slug === "uniform");
  const other = services.filter((s) => s.slug === "cloth");

  const total = useMemo(() => {
    return selectedItems.reduce(
      (sum, entry) => sum + entry.item.price * entry.quantity,
      0
    );
  }, [selectedItems]);

  //   const selectedSlotTime = useMemo(() => {
  //     return slots.find((s) => s.id === slot)?.acf.time || "";
  //   }, [slots, slot]);

  useEffect(() => {
    if (camps.length > 0 && !campId) {
      setCampId(camps[0].id);
    }
  }, [camps, campId]);

  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
    }
  }, [orderData]);

  const handleQuantityChange = (itemToUpdate, newQuantity) => {
    setSelectedItems((prevItems) => {
      const index = prevItems.findIndex(
        (entry) => entry.item.id === itemToUpdate.id
      );
      const updated = [...prevItems];

      if (newQuantity <= 0) {
        if (index > -1) updated.splice(index, 1);
      } else {
        if (index > -1) {
          updated[index] = { ...updated[index], quantity: newQuantity };
        } else {
          updated.push({ item: itemToUpdate, quantity: newQuantity });
        }
      }
      return updated;
    });
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.filter((entry) => entry.item.id !== itemId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campId || !room || !slot || !pickup || selectedItems.length === 0) {
      alert("Please complete all fields and select at least one service.");
      return;
    }

    const servicesPayload = selectedItems.map((entry) => ({
      id: entry.item.id,
      name: entry.item.name,
      quantity: entry.quantity,
      price: entry.item.price,
    }));

    const selectedSlotObject = slots.find((s) => s.id == slot);
    const selectedSlotTime = selectedSlotObject ? selectedSlotObject.time : "";
    const selectedCampObject = camps.find((c) => c.id == campId);
    const selectedCampName = selectedCampObject ? selectedCampObject.name : "";

    const bookingPayload = {
      room_number: room,
      slot_id: slot,
      pickup_slot: selectedSlotTime,
      pickup_method: pickup,
      services: JSON.stringify(servicesDetailsPayload),
      service_id: selectedItems.map((entry) => entry.item.id),
      total_price: total.toFixed(2),
      camp_name: selectedCampName,
      customer_name: customerName,
      special_instructions: specialInstructions,
    };

    await submitOrder(bookingPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <div className="relative z-10 flex flex-col gap-8">
        <div className="grid two">
          <div className="field">
            <label htmlFor="camp">Camp *</label>
            <select
              id="camp"
              value={campId}
              onChange={(e) => setCampId(e.target.value)}
              required
              disabled={campsLoading || !!campsError}
            >
              <option value="" disabled>
                {campsLoading ? "Loading camps..." : "Select a camp"}
              </option>
              {camps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {campsError && (
              <p className="text-red-500 text-sm mt-1">{campsError}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="customerName">Customer Name</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid two">
          <div className="field">
            <label htmlFor="room">Room Number *</label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="slot">Pickup Time Slot *</label>
            <div className="flex items-center">
              <select
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                required
                className="flex-grow"
              >
                <option value="" disabled>
                  Select a time slot
                </option>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.time}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={refreshSlots}
                className="ml-2 p-2 border rounded"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {servicesLoading ? (
          <p className="text-center my-8">Loading services...</p>
        ) : (
          <>
            <ServiceCategory
              title="Uniform"
              items={uniforms}
              selectedItems={selectedItems}
              onQuantityChange={handleQuantityChange}
            />
            <ServiceCategory
              title="Other Clothing"
              items={other}
              selectedItems={selectedItems}
              onQuantityChange={handleQuantityChange}
            />
          </>
        )}

        <div className="grid one mt-6">
          <PickupOptions pickup={pickup} setPickup={setPickup} />
          <div className="field mt-4">
            <label htmlFor="specialInstructions">
              Special Instructions / Care Suggestions
            </label>
            <textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Example: Wash in cold water, do not tumble dry, delicate garment…"
              rows="1"
            />
          </div>
          <div className="grid gap-4 mt-4">
            <Totals
              selectedItems={selectedItems}
              room={room}
              camp={camps.find((c) => c.id === campId)?.name || ""}
              slot={selectedSlotTime}
              pickup={pickup}
              specialInstructions={specialInstructions}
              onRemoveItem={handleRemoveItem}
            />
            <div className="actions">
              <button
                type="submit"
                className="pay-btn alt w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </div>
        </div>

        {submissionError && (
          <p className="text-red-500 text-center mt-4">{submissionError}</p>
        )}

        <div className={`confirm ${confirmed ? "active" : ""}`}>
          <Confirmation
            orderId={orderData?.id}
            room={room}
            camp={camps.find((c) => c.id === campId)?.name || ""}
            slot={selectedSlotTime}
            pickup={pickup}
            selectedItems={selectedItems}
            total={total}
            customerName={customerName}
            specialInstructions={specialInstructions}
          />
        </div>
      </div>
    </form>
  );
}

export default BookingForm;
