import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Bell, Search, ChevronDown, Menu, User, Shield, Building2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  var app = useApp();
  var activeBusiness = app.activeBusiness;
  var businesses = app.businesses;
  var dispatch = app.dispatch;

  var auth = useAuth();

  var dropdownState = useState(false);
  var showDropdown = dropdownState[0];
  var setShowDropdown = dropdownState[1];

  var userMenuState = useState(false);
  var showUserMenu = userMenuState[0];
  var setShowUserMenu = userMenuState[1];

  var dropdownRef = useRef(null);
  var userMenuRef = useRef(null);

  useEffect(function() {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, []);

  var getRoleBadge = function() {
    if (!auth.user) return null;
    var role = auth.user.role;
    if (role === "super_admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <Shield className="w-3 h-3" />
          {"Admin"}
        </span>
      );
    }
    if (role === "business_owner") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          <Building2 className="w-3 h-3" />
          {"Owner"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
        <User className="w-3 h-3" />
        {"Staff"}
      </span>
    );
  };

  var getInitials = function() {
    if (!auth.user || !auth.user.full_name) return "R";
    var parts = auth.user.full_name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={function() { dispatch({ type: "OPEN_MOBILE_SIDEBAR" }); }}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-80 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Business Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={function() { setShowDropdown(!showDropdown); }}
            className="flex items-center gap-1 md:gap-2 rounded-lg border border-gray-200 px-2 md:px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">{activeBusiness && activeBusiness.emoji ? activeBusiness.emoji : "\uD83C\uDFE2"}</span>
            <span className="font-medium hidden sm:inline max-w-[120px] md:max-w-none truncate">
              {activeBusiness && activeBusiness.displayName ? activeBusiness.displayName : "Select Business"}
            </span>
            <ChevronDown size={16} className={"transition-transform " + (showDropdown ? "rotate-180" : "")} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-72 md:w-80 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
              <div className="px-3 pb-2 pt-1">
                <p className="text-xs font-semibold uppercase text-gray-400">{"Switch Business"}</p>
              </div>
              {businesses.map(function(biz) {
                var isActive = activeBusiness && activeBusiness.id === biz.id;
                return (
                  <button
                    key={biz.id}
                    onClick={function() {
                      dispatch({ type: "SET_ACTIVE_BUSINESS", payload: biz });
                      setShowDropdown(false);
                    }}
                    className={"flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors " + (isActive ? "bg-indigo-50" : "hover:bg-gray-50")}
                  >
                    <span className="text-xl">{biz.emoji}</span>
                    <div className="text-left flex-1">
                      <p className={"font-medium " + (isActive ? "text-indigo-700" : "text-gray-900")}>{biz.displayName}</p>
                      <p className="text-xs text-gray-400">{biz.sector + " \u00B7 " + biz.city}</p>
                    </div>
                    {isActive && <span className="text-indigo-600 font-bold">{"\u2713"}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={function() { setShowUserMenu(!showUserMenu); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {getInitials()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {auth.user ? auth.user.full_name : "User"}
              </p>
              <div className="flex items-center gap-1.5">
                {getRoleBadge()}
              </div>
            </div>
            <ChevronDown size={14} className={"hidden md:block text-gray-400 transition-transform " + (showUserMenu ? "rotate-180" : "")} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-14 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
              {/* User info (shown on mobile since it's hidden in button) */}
              <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                <p className="text-sm font-semibold text-gray-900">
                  {auth.user ? auth.user.full_name : "User"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {auth.user ? auth.user.email : ""}
                </p>
                <div className="mt-1.5">{getRoleBadge()}</div>
              </div>

              {/* Desktop email */}
              <div className="px-4 py-2 border-b border-gray-100 hidden md:block">
                <p className="text-xs text-gray-500">
                  {auth.user ? auth.user.email : ""}
                </p>
              </div>

              <button
                onClick={function() {
                  setShowUserMenu(false);
                  window.location.href = "/settings";
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} />
                {"My Profile & Settings"}
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={function() {
                    setShowUserMenu(false);
                    auth.logout();
                    window.location.href = "/login";
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {"Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
