// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || '' // Will use relative URLs if no backend
  : 'http://localhost:5001';

// Mock mode when no backend is available
export const USE_MOCK_DATA = process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;

export default API_BASE_URL;