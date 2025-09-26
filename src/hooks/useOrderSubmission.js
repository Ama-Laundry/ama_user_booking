import { useState } from "react";
import { submitOrder as apiSubmitOrder } from "../utils/api";

export const useOrderSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const submit = async (orderData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    const payload = {
      title: `Order for ${orderData.customer_name} - Room ${orderData.room_number}`,
      status: "publish",
      acf: {
        room_number: orderData.room_number,
        service_id: orderData.service_id,
        pickup_method: orderData.pickup_method,
        slot_id: orderData.slot_id,
        camp_name: orderData.camp_name,
        customer_name: orderData.customer_name,
        special_instructions: orderData.special_instructions,
        total_price: orderData.total_price,
        services: orderData.services,
        service_names: orderData.service_names,
        order_status: "pending",
        order_timestamp: new Date().toISOString(),
      },
    };

    console.log("📦 Simplified payload:", payload);

    try {
      const result = await apiSubmitOrder(payload);
      setSubmittedOrder(result);
      return result;
    } catch (error) {
      setSubmissionError(
        error.message || "An unknown submission error occurred."
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submissionError, submittedOrder, submit };
};
