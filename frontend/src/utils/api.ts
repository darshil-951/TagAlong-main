/**
 * API Configuration Utility
 * Centralizes API URL configuration for production and development
 */

// Get API URL from environment variable or use default
const getApiUrl = (): string => {
  // In production, use environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use proxy (Vite handles this)
  return '';
};

// Get Socket.IO URL from environment variable or use default
export const getSocketUrl = (): string => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  // Fallback to API URL or localhost for development
  return getApiUrl() || 'http://localhost:5000';
};

// Get full API endpoint URL
export const getApiEndpoint = (endpoint: string): string => {
  const apiUrl = getApiUrl();
  
  // If API URL is set, use it; otherwise use relative path (for Vite proxy in dev)
  if (apiUrl) {
    // Remove trailing slash from API URL and leading slash from endpoint
    const cleanApiUrl = apiUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanApiUrl}${cleanEndpoint}`;
  }
  
  // Return relative path for Vite proxy in development
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

// Get upload URL for avatars and files
export const getUploadUrl = (path: string): string => {
  const apiUrl = getApiUrl();
  
  if (apiUrl) {
    const cleanApiUrl = apiUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanApiUrl}${cleanPath}`;
  }
  
  // Fallback for development
  return `http://localhost:5000${path.startsWith('/') ? path : `/${path}`}`;
};

export default {
  getApiEndpoint,
  getSocketUrl,
  getUploadUrl,
};

