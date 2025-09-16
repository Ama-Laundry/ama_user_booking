import { useState } from "react";

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    const jwtToken = import.meta.env.VITE_GUEST_JWT_TOKEN;

    if (!jwtToken) {
      setError("Authentication token missing. Please contact support.");
      setLoading(false);
      return { success: false, error: "JWT token not found." };
    }

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
        pickup_method: pickupMethodLabel,
        slot_id: orderData.fields?.slot_id,

        // ✅ FIX: Send camp_name as an array of integers
        camp_name: [parseInt(orderData.fields?.camp_id, 10)],

        customer_name: orderData.fields?.customer_name,
        Special_Instructions: orderData.fields?.special_instructions,
        total_price: orderData.fields?.total_price,
        services: orderData.fields?.services,
        camp_id: orderData.fields?.camp_id,
        pickup_slot: orderData.fields?.pickup_slot,
      },
    };

    console.log("📦 Submitting order payload:", payload);

    try {
      const response = await fetch(
        "https://amalaundry.com.au/wp-json/wp/v2/laundry_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Order submission failed.";
        console.error("❌ Server Error:", result);
        throw new Error(errorMessage);
      }

      setData(result);
      return { success: true, order: result };
    } catch (err) {
      console.error("⚠️ Submission failed:", err);
      setError(err.message || "Could not place your order. Please try again.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
