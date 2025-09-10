// utils/filterBySlug.js
export const filterBySlug = (services, keyword) =>
  services.filter((item) =>
    item.slug?.toLowerCase().includes(keyword.toLowerCase())
  );
