/**
 * @file Centralizes all API calls to the BFF.
 */

const BFF_BASE_URL = "http://localhost:3001/api";

const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BFF_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok for ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
};

export const fetchServices = () => fetchData("services");
export const fetchCamps = () => fetchData("camps");
export const fetchPickupSlots = () => fetchData("pickup_slots");
export const fetchPaymentMethods = () => fetchData("payment_methods");

/**
 * Submits the pre-formatted order payload to the BFF.
 * @param {object} payload - The complete order object.
 * @returns {Promise<object>}
 */
export const submitOrder = async (payload) => {
  try {
    const response = await fetch(`${BFF_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Order submission failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};
