// src/utils/api.js
import base64 from "base-64"; // You may need to install this: npm install base-64

// These are the credentials from your .env.local file.
// IMPORTANT: Make sure the variable names match what you have in your .env.local file.
// They should be VITE_API_USER and VITE_API_PASSWORD based on our previous steps.
const USERNAME = import.meta.env.VITE_API_USER;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

const API_BASE_URL = "https://amalaundry.com.au/wp-json";

/**
 * The main function to submit an order.
 * It uses Basic Authentication with an Application Password.
 * This replaces the previous JWT token logic.
 */
export const submitLaundryOrder = async (orderData) => {
  try {
    // 1. Create the Basic Authentication header.
    // This is a single, secure step that replaces the old getAuthToken() call.
    const headers = {
      "Content-Type": "application/json",
      // The 'Authorization' header tells WordPress that this is a trusted application.
      Authorization: `Basic ${base64.encode(`${USERNAME}:${PASSWORD}`)}`,
    };

    // 2. Use the new secure endpoint from the plugin to submit the order.
    console.log("📦 Submitting order payload with Basic Auth:", orderData);
    const response = await fetch(`${API_BASE_URL}/ama/v1/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server rejected the order submission:", errorData);
      throw new Error(
        errorData.message || "Server rejected the order submission."
      );
    }

    console.log("✅ Order submitted successfully.");
    return await response.json();
  } catch (error) {
    console.error("❌ Submission process failed:", error);
    // Re-throw the error to be caught by the calling hook/component
    throw error;
  }
};
