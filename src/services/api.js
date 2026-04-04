import axios from 'axios';

var api = axios.create({
  baseURL: 'https://raseel-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to every request
api.interceptors.request.use(function (config) {
  var token = localStorage.getItem('raseel_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Handle expired tokens
api.interceptors.response.use(
  function (response) { return response; },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('raseel_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
