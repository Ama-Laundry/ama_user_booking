import { useState, useEffect } from "react";

// The API endpoint for the 'camp' Custom Post Type
const CAMPS_API_URL =
  "https://amalaundry.com.au/wp-json/wp/v2/camp?per_page=100";

/**
 * A custom hook to fetch the list of camps from the WordPress REST API.
 * @returns {{camps: Array<{id: number, name: string}>, loading: boolean, error: string|null}}
 */
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

        // Transform the data from the WordPress API into a simpler format {id, name}
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
  }, []); // The empty array ensures this effect runs only once when the component mounts

  return { camps, loading, error };
}

export default useCamps;
