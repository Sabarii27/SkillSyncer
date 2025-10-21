// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.railway.app' // Replace with your backend URL
  : 'http://localhost:5001';

export default API_BASE_URL;