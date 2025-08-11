// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://todo-list-website-usng.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;
