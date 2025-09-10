// src/hooks/usePickupSlots.js

import { useEffect, useState } from "react";

export default function usePickupSlots() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // MODIFIED: Added cache-busting timestamp
    const url = new URL("https://amalaundry.com.au/wp-json/wp/v2/pickup_slot");
    url.searchParams.append("v", new Date().getTime());

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const activeSlots = data
          .filter((item) => item.acf?.is_active)
          .map((item) => ({
            id: item.id,
            time: item.acf?.time || "Unknown",
          }));
        setSlots(activeSlots);
      })
      .catch((err) => console.error("Pickup slot fetch failed:", err));
  }, []);

  return slots;
}
