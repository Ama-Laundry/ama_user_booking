import { useState, useEffect } from 'react';

// For the MVP, we are using hardcoded data.
// To switch to a live endpoint, replace the hardcoded array with a fetch call.
// Example API endpoint: https://amalaundry.com.au/wp-json/wp/v2/camp
const hardcodedCamps = [
  { id: 'camp_bma', name: 'BMA Mining Camp' }
  // Add more camps here in the future
];

export default function useCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call
    setCamps(hardcodedCamps);
    setLoading(false);
  }, []);

  return { camps, loading };
}
