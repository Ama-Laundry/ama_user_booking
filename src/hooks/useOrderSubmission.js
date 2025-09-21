import { useState } from "react";
import { submitLaundryOrder } from "../utils/api"; // Import your API function

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

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
        camp_name: [parseInt(orderData.fields?.camp_id, 10)],
        customer_name: orderData.fields?.customer_name,
        Special_Instructions: orderData.fields?.special_instructions,
        total_price: orderData.fields?.total_price,
        services: orderData.fields?.services,
        camp_id: orderData.fields?.camp_id,
        pickup_slot: orderData.fields?.pickup_slot,
        order_timestamp: new Date().toLocaleString("en-AU"),
      },
    };

    console.log("📦 Submitting order payload:", payload);

    try {
      // Use your existing submitLaundryOrder function from api.js
      const result = await submitLaundryOrder(payload);

      setData(result);
      return { success: true, order: result };
    } catch (err) {
      console.error("⚠️ Submission failed:", err);
      const errorMessage =
        err.message || "Could not place your order. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
