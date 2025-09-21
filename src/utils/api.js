// src/utils/api.js

// These are the credentials from your .env.local file
const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;
const API_BASE_URL = "https://amalaundry.com.au/wp-json";

/**
 * Fetches a new JWT from the WordPress backend using the application credentials.
 * This should be called before making any authenticated request.
 */
const getAuthToken = async () => {
  const response = await fetch(`${API_BASE_URL}/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to fetch auth token:", errorData);
    throw new Error("Could not authenticate with the server.");
  }

  const data = await response.json();
  return data.token; // Return the new token
};

/**
 * The main function to submit an order. It gets a fresh token first,
 * then submits the order with that token.
 */
export const submitLaundryOrder = async (orderData) => {
  try {
    // 1. Get a fresh token for this specific submission
    console.log("📦 Getting a new authentication token...");
    const token = await getAuthToken();
    console.log("✅ Token received.");

    // 2. Use the new token to submit the order
    console.log("📦 Submitting order payload:", orderData);
    const response = await fetch(`${API_BASE_URL}/wp/v2/laundry_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      // If the server returns an error even with a new token, throw it.
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Server rejected the order submission."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Submission process failed:", error);
    // Re-throw the error to be caught by the calling hook/component
    throw error;
  }
};
