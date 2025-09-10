import { useState } from "react";

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    // Map pickup_method to valid ACF values
    const pickupMethodLabel =
      orderData.fields?.pickup_method === "inside"
        ? "Inside Room"
        : "Outside Door";

    const payload = {
      title:
        orderData.title ||
        `Laundry Order for Room ${orderData.fields?.room_number || "Unknown"}`,
      status: "publish",
      acf: {
        room_number: orderData.fields?.room_number,
        service_id: orderData.fields?.service_id,
        pickup_method: pickupMethodLabel, // ✅ Corrected value
        slot_id: orderData.fields?.slot_id,
        camp_name: orderData.fields?.camp_name,
        customer_name: orderData.fields?.customer_name,
        Special_Instructions: orderData.fields?.special_instructions,
        total_price: orderData.fields?.total_price,
        services: orderData.fields?.services,
        camp_id: orderData.fields?.camp_id,
        pickup_slot: orderData.fields?.pickup_slot,
      },
    };

    console.log("Submitting order:", payload);

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
