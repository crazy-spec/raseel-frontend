import axios from 'axios';

const BACKEND = 'https://raseel-backend.onrender.com/api';

var api = axios.create({
  baseURL: BACKEND,
  headers: { 
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

api.interceptors.request.use(function (config) {
  var token = localStorage.getItem('raseel_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  config.params = config.params || {};
  config.params['_t'] = Date.now();
  return config;
});

api.interceptors.response.use(
  function (response) { return response; },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('raseel_token');
      localStorage.removeItem('raseel_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
