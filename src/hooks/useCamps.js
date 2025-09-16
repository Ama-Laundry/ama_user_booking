import { useState, useEffect } from "react";

const CAMPS_API_URL =
  "https://amalaundry.com.au/wp-json/wp/v2/camp?per_page=100";

function useCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCamps = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(CAMPS_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const formattedCamps = data.map((camp) => ({
          id: camp.id,
          name: camp.title.rendered,
        }));

        setCamps(formattedCamps);
      } catch (e) {
        console.error("Failed to fetch camps:", e);
        setError("Could not load camps. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getCamps();
  }, []);

  return { camps, loading, error };
}

export default useCamps;
