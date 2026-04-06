var API_BASE = 'https://raseel-backend.onrender.com/api';

var authService = {
  login: function(email, password) {
    return fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || 'Login failed');
        });
      }
      return res.json();
    });
  },

  getMe: function(token) {
    return fetch(API_BASE + '/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      if (!res.ok) {
        throw new Error('Token invalid');
      }
      return res.json();
    });
  },

  logout: function() {
    localStorage.removeItem('raseel_token');
    localStorage.removeItem('raseel_user');
  }
};

export default authService;
