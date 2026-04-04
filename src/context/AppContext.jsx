import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

var AppContext = createContext(null);

var SECTOR_EMOJI = {
  restaurant: "\uD83C\uDF54",
  medical: "\uD83C\uDFE5",
  hotel: "\uD83C\uDFE8",
  retail: "\uD83D\uDECD\uFE0F",
  salon: "\uD83D\uDC87",
  education: "\uD83C\uDF93"
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_BUSINESSES":
      return Object.assign({}, state, {
        businesses: action.payload,
        activeBusiness: action.payload.length > 0 ? action.payload[0] : null,
        loading: false
      });
    case "SET_ACTIVE_BUSINESS":
      return Object.assign({}, state, { activeBusiness: action.payload });
    case "TOGGLE_SIDEBAR":
      return Object.assign({}, state, { sidebarOpen: !state.sidebarOpen });
    case "OPEN_MOBILE_SIDEBAR":
      return Object.assign({}, state, { mobileSidebarOpen: true });
    case "CLOSE_MOBILE_SIDEBAR":
      return Object.assign({}, state, { mobileSidebarOpen: false });
    case "SET_LOADING":
      return Object.assign({}, state, { loading: action.payload });
    default:
      return state;
  }
}

var initialState = {
  businesses: [],
  activeBusiness: null,
  sidebarOpen: true,
  mobileSidebarOpen: false,
  loading: true
};

export function AppProvider(props) {
  var children = props.children;
  var auth = useAuth();
  var result = useReducer(reducer, initialState);
  var state = result[0];
  var dispatch = result[1];

  useEffect(function() {
    if (auth.isAuthenticated && auth.token) {
      dispatch({ type: "SET_LOADING", payload: true });

      fetch("https://raseel-backend.onrender.com/api/businesses/", {
        headers: { "Authorization": "Bearer " + auth.token }
      })
      .then(function(res) {
        if (!res.ok) throw new Error("Failed to fetch businesses");
        return res.json();
      })
      .then(function(data) {
        var businesses = data.map(function(b) {
          return {
            id: b.id,
            displayName: b.name_en || b.name || "Unnamed",
            name_en: b.name_en || b.name || "",
            name_ar: b.name_ar || b.name_en || "",
            sector: b.sector || "general",
            city: b.city || "Riyadh",
            emoji: SECTOR_EMOJI[b.sector] || "\uD83C\uDFE2",
            access_code: b.access_code || "",
            whatsapp_phone: b.whatsapp_phone || "",
            is_active: b.is_active !== false,
            tier: b.tier || "starter",
            created_at: b.created_at || null
          };
        });
        dispatch({ type: "SET_BUSINESSES", payload: businesses });
      })
      .catch(function(err) {
        console.error("Error loading businesses:", err);
        dispatch({ type: "SET_BUSINESSES", payload: [] });
      });
    } else if (!auth.isLoading) {
      dispatch({ type: "SET_BUSINESSES", payload: [] });
    }
  }, [auth.isAuthenticated, auth.token, auth.isLoading]);

  var value = {
    businesses: state.businesses,
    activeBusiness: state.activeBusiness,
    sidebarOpen: state.sidebarOpen,
    mobileSidebarOpen: state.mobileSidebarOpen,
    loading: state.loading,
    dispatch: dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  var context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export default AppContext;
