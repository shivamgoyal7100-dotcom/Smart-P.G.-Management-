/**
 * Resolves room or gallery image URLs.
 * If the image path is a local uploads folder, prepends the backend server address.
 * Otherwise, returns the URL as is (Cloudinary, Unsplash, etc.)
 */
export const getImageUrl = (image) => {
  if (!image) {
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  }
  
  const url = typeof image === 'string' ? image : image.url;
  
  if (url.startsWith('/uploads/')) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    // Ensure we don't double slash
    const cleanedServerUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
    return `${cleanedServerUrl}${url}`;
  }
  
  return url;
};

/**
 * Formats a number to Indian Rupee (INR) currency format
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
