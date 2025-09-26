import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const API_BASE = "https://amalaundry.com.au/wp-json/wp/v2";
const CUSTOM_API_BASE = "https://amalaundry.com.au/wp-json/ama/v1";

// Allow CORS for your local React app to talk to this BFF
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    origin === "http://localhost:5173" ||
    origin === "https://your-production-app.vercel.app"
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Add a root route to show the server is running.
app.get("/", (req, res) => {
  res.json({ message: "BFF Server is alive and running!" });
});

// --- API Endpoints ---

// Generic proxy function for GET requests
const createProxyEndpoint = (path, wpEndpoint) => {
  app.get(`/api/${path}`, async (req, res) => {
    try {
      const response = await fetch(`${API_BASE}/${wpEndpoint}?per_page=100`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      res.status(500).json({ message: `Failed to fetch ${path}` });
    }
  });
};

createProxyEndpoint("services", "service");
createProxyEndpoint("camps", "camp");
createProxyEndpoint("pickup_slots", "pickup_slot");
createProxyEndpoint("payment_methods", "payment_method");

// Proxy endpoint for creating an order
app.post("/api/orders", async (req, res) => {
  try {
    const response = await fetch(`${CUSTOM_API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res
        .status(response.status)
        .json({ message: errorData.message || "Failed to create order." });
    }

    const data = await response.json();
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server only when running locally
if (process.env.NODE_ENV !== "production") {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`BFF server is running on http://localhost:${PORT}`);
  });
}

export default app;
