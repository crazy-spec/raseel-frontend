var API_BASE = https://raseel-backend.onrender.com/api

var authService = {
  login: function(email, password) {
    return fetch(API_BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Login failed");
        });
      }
      return res.json();
    });
  },

  register: function(data) {
    return fetch(API_BASE + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Registration failed");
        });
      }
      return res.json();
    });
  },

  getMe: function(token) {
    return fetch(API_BASE + "/me", {
      headers: { "Authorization": "Bearer " + token }
    }).then(function(res) {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    });
  },

  updateProfile: function(token, data) {
    return fetch(API_BASE + "/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    }).then(function(res) {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    });
  },

  changePassword: function(token, currentPassword, newPassword) {
    return fetch(API_BASE + "/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    }).then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Password change failed");
        });
      }
      return res.json();
    });
  }
};

export default authService;
