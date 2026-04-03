import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

var AuthContext = createContext(null);

export function AuthProvider(props) {
  var children = props.children;
  var storedToken = localStorage.getItem("raseel_token");

  var tokenState = useState(storedToken || null);
  var token = tokenState[0];
  var setToken = tokenState[1];

  var userState = useState(null);
  var user = userState[0];
  var setUser = userState[1];

  var loadingState = useState(true);
  var isLoading = loadingState[0];
  var setIsLoading = loadingState[1];

  // On mount: validate stored token
  useEffect(function() {
    if (token) {
      authService.getMe(token)
        .then(function(userData) {
          setUser(userData);
          setIsLoading(false);
        })
        .catch(function() {
          // Token invalid or expired
          localStorage.removeItem("raseel_token");
          setToken(null);
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  var login = function(email, password) {
    return authService.login(email, password)
      .then(function(res) {
        localStorage.setItem("raseel_token", res.access_token);
        setToken(res.access_token);
        setUser(res.user);
        return res;
      });
  };

  var register = function(data) {
    return authService.register(data)
      .then(function(res) {
        localStorage.setItem("raseel_token", res.access_token);
        setToken(res.access_token);
        setUser(res.user);
        return res;
      });
  };

  var logout = function() {
    localStorage.removeItem("raseel_token");
    setToken(null);
    setUser(null);
  };

  var value = {
    user: user,
    token: token,
    isLoading: isLoading,
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default AuthContext;
