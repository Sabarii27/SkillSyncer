// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || '' // Will use Railway backend URL
  : 'http://localhost:5001';

// Mock mode when no backend is available
export const USE_MOCK_DATA = process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;

// Configure axios defaults
import axios from 'axios';

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

export default API_BASE_URL;