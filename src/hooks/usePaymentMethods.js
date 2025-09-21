// src/hooks/usePaymentMethods.js

import { useEffect, useState } from "react";

export default function usePaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // MODIFIED: Added cache-busting timestamp
        const url = new URL(
          "https://amalaundry.com.au/wp-json/wp/v2/payment_method"
        );
        url.searchParams.append("acf_format", "standard");
        url.searchParams.append("v", new Date().getTime());

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch payment methods");
        }

        const data = await response.json();

        const formattedMethods = data.map((item) => ({
          id: item.id,
          name: item.title?.rendered || "Unknown",
          provider: item.acf?.provider_code || "Unknown",
          icon: item.acf?.icon?.url || "/images/default-icon.png",
          is_active: item.acf?.is_active || false,
        }));

        setMethods(formattedMethods);
      } catch (err) {
        console.error("Payment method fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { methods, loading, error };
}
