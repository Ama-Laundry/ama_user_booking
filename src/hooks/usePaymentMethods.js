// src/hooks/usePaymentMethods.js

import { useEffect, useState } from 'react'

export default function usePaymentMethods() {
  const [methods, setMethods] = useState([])

  useEffect(() => {
    // MODIFIED: Added cache-busting timestamp
    const url = new URL('https://amalaundry.com.au/wp-json/wp/v2/payment_method');
    url.searchParams.append('v', new Date().getTime());
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const activeMethods = data
          .filter(item => item.acf?.is_active)
          .map(item => ({
            id: item.id,
            provider: item.acf?.provider_code || 'Unknown',
            icon: item.acf?.icon?.url || '/images/default-icon.png',
          }))
        setMethods(activeMethods)
      })
      .catch(err => console.error('Payment method fetch failed:', err))
  }, [])

  return methods
}
