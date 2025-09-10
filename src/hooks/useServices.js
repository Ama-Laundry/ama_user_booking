// src/hooks/useServices.js

import { useEffect, useState } from 'react';

// The base URL for your WordPress site
const WP_BASE_URL = 'https://amalaundry.com.au';

export default function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesAndImages = async () => {
      setLoading(true);
      try {
        // MODIFIED: Added cache-busting timestamp
        const serviceUrl = new URL(`${WP_BASE_URL}/wp-json/wp/v2/service`);
        serviceUrl.searchParams.append('v', new Date().getTime());

        // 1. Fetch the initial list of services
        const servicesResponse = await fetch(serviceUrl);
        if (!servicesResponse.ok) {
          throw new Error('Network response for services was not ok');
        }
        const servicesData = await servicesResponse.json();

        // 2. Create an array of promises to fetch the media details for each image ID
        const imagePromises = servicesData.map(item => {
          if (item.acf?.image) {
            // MODIFIED: Added cache-busting timestamp to image fetch
            const imageUrl = new URL(`${WP_BASE_URL}/wp-json/wp/v2/media/${item.acf.image}`);
            imageUrl.searchParams.append('v', new Date().getTime());

            return fetch(imageUrl)
              .then(res => {
                if (!res.ok) {
                  console.error(`Failed to fetch image ID: ${item.acf.image}`);
                  return null;
                }
                return res.json();
              })
              .then(mediaData => {
                return mediaData?.source_url || '/images/default-service.png';
              });
          }
          return Promise.resolve('/images/default-service.png');
        });

        // 3. Wait for all the image fetches to complete
        const imageUrls = await Promise.all(imagePromises);

        // 4. Combine the original service data with the new image URLs
        const formattedServices = servicesData.map((item, index) => ({
          id: item.id,
          name: item.title.rendered,
          price: item.acf?.price || 0,
          slug: item.acf?.slug || '',
          image: imageUrls[index],
        }));
        
        setServices(formattedServices);

      } catch (error) {
        console.error('Service or Image fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndImages();
  }, []);

  return { services, loading };
}
