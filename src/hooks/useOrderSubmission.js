import { useState } from "react";

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    const payload = {
      title: `Order for Room ${orderData.roomNumber}`, // Optional but useful
      acf: {
        room_number: orderData.roomNumber,
        service_id: orderData.serviceIds,
        pickup_method: orderData.pickupMethod,
        slot_id: orderData.slotId,
        camp_name: orderData.campName,
        customer_name: orderData.customerName,
        Special_Instructions: orderData.specialInstructions,
      },
    };

    console.log("Submitting order:", payload); // ✅ Confirm structure

    try {
      const response = await fetch(
        "https://amalaundry.com.au/wp-json/wp/v2/laundry_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error?.message || "Order submission failed.");
      }

      setData(result);
    } catch (err) {
      console.error("Order submission failed:", err);
      setError(err.message || "Could not place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
