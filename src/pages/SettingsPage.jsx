import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { User, Lock, Building2, Bot, Shield, Globe, Moon, Save, Check, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  var app = useApp();
  var business = app.activeBusiness;
  var auth = useAuth();

  var savedState = useState("");
  var saved = savedState[0];
  var setSaved = savedState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  // Profile fields
  var nameState = useState(auth.user ? auth.user.full_name : "");
  var fullName = nameState[0];
  var setFullName = nameState[1];

  var phoneState = useState(auth.user ? auth.user.phone || "" : "");
  var phone = phoneState[0];
  var setPhone = phoneState[1];

  // Password fields
  var curPassState = useState("");
  var currentPassword = curPassState[0];
  var setCurrentPassword = curPassState[1];

  var newPassState = useState("");
  var newPassword = newPassState[0];
  var setNewPassword = newPassState[1];

  var confirmPassState = useState("");
  var confirmPassword = confirmPassState[0];
  var setConfirmPassword = confirmPassState[1];

  // AI Settings (localStorage)
  var aiState = useState({
    temperature: 70,
    max_tokens: 500,
    no_hallucinate: true,
    auto_greeting: true,
    default_language: "ar",
    prayer_pause: true,
    pause_minutes: 30,
    ramadan_mode: true,
    prayer_city: business ? business.city : "Riyadh"
  });
  var aiSettings = aiState[0];
  var setAiSettings = aiState[1];

  var updateAI = function(key, value) {
    setAiSettings(function(prev) {
      var next = Object.assign({}, prev);
      next[key] = value;
      return next;
    });
  };

  var handleSaveProfile = function() {
    setError("");
    setSaved("");
    authService.updateProfile(auth.token, {
      full_name: fullName,
      phone: phone || null
    }).then(function() {
      setSaved("profile");
      setTimeout(function() { setSaved(""); }, 3000);
    }).catch(function(err) {
      setError(err.message || "Failed to update profile");
    });
  };

  var handleChangePassword = function() {
    setError("");
    setSaved("");
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    authService.changePassword(auth.token, currentPassword, newPassword)
      .then(function() {
        setSaved("password");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(function() { setSaved(""); }, 3000);
      })
      .catch(function(err) {
        setError(err.message || "Password change failed");
      });
  };

  var handleSaveAI = function() {
    localStorage.setItem("raseel_settings", JSON.stringify(aiSettings));
    setSaved("ai");
    setTimeout(function() { setSaved(""); }, 3000);
  };

  var inputClass = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{"Settings"}</h1>
        <p className="text-gray-500">{"Manage your profile, security, and platform settings"}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />{"My Profile"}
            </h2>
            <button onClick={handleSaveProfile}
              className={"px-4 py-2 rounded-lg text-sm font-medium text-white transition " + (saved === "profile" ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700")}>
              {saved === "profile" ? <><Check className="w-4 h-4 inline mr-1" />{"Saved!"}</> : <><Save className="w-4 h-4 inline mr-1" />{"Save"}</>}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Full Name"}</label>
              <input type="text" value={fullName} onChange={function(e) { setFullName(e.target.value); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Email"}</label>
              <input type="email" value={auth.user ? auth.user.email : ""} readOnly className={inputClass + " bg-gray-50 cursor-not-allowed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Phone"}</label>
              <input type="tel" value={phone} onChange={function(e) { setPhone(e.target.value); }} className={inputClass} placeholder="+966 5XX XXX XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Role"}</label>
              <input type="text" value={auth.user ? auth.user.role.replace("_", " ").toUpperCase() : ""} readOnly className={inputClass + " bg-gray-50 cursor-not-allowed capitalize"} />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />{"Change Password"}
            </h2>
            <button onClick={handleChangePassword}
              className={"px-4 py-2 rounded-lg text-sm font-medium text-white transition " + (saved === "password" ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700")}>
              {saved === "password" ? <><Check className="w-4 h-4 inline mr-1" />{"Changed!"}</> : "Update Password"}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Current Password"}</label>
              <input type="password" value={currentPassword} onChange={function(e) { setCurrentPassword(e.target.value); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"New Password"}</label>
              <input type="password" value={newPassword} onChange={function(e) { setNewPassword(e.target.value); }} className={inputClass} placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Confirm New Password"}</label>
              <input type="password" value={confirmPassword} onChange={function(e) { setConfirmPassword(e.target.value); }} className={inputClass} />
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />{"AI Configuration"}
            </h2>
            <button onClick={handleSaveAI}
              className={"px-4 py-2 rounded-lg text-sm font-medium text-white transition " + (saved === "ai" ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700")}>
              {saved === "ai" ? <><Check className="w-4 h-4 inline mr-1" />{"Saved!"}</> : <><Save className="w-4 h-4 inline mr-1" />{"Save"}</>}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {"Temperature: " + (aiSettings.temperature / 100).toFixed(1)}
              </label>
              <input type="range" min="0" max="100" value={aiSettings.temperature}
                onChange={function(e) { updateAI("temperature", parseInt(e.target.value)); }}
                className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{"Precise"}</span><span>{"Creative"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Default Language"}</label>
              <select className={inputClass} value={aiSettings.default_language}
                onChange={function(e) { updateAI("default_language", e.target.value); }}>
                <option value="ar">{"Arabic"}</option>
                <option value="en">{"English"}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={aiSettings.no_hallucinate} id="nohallucinate"
                onChange={function(e) { updateAI("no_hallucinate", e.target.checked); }} className="accent-indigo-600" />
              <label htmlFor="nohallucinate" className="text-sm text-gray-700">{"No-hallucination mode (products only from catalog)"}</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={aiSettings.auto_greeting} id="autogreet"
                onChange={function(e) { updateAI("auto_greeting", e.target.checked); }} className="accent-indigo-600" />
              <label htmlFor="autogreet" className="text-sm text-gray-700">{"Auto-greeting with sector buttons"}</label>
            </div>
          </div>
        </div>

        {/* Cultural Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600" />{"Cultural Settings"}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{"Prayer Time City"}</label>
              <select className={inputClass} value={aiSettings.prayer_city}
                onChange={function(e) { updateAI("prayer_city", e.target.value); }}>
                <option>{"Riyadh"}</option><option>{"Jeddah"}</option><option>{"Dammam"}</option>
                <option>{"Makkah"}</option><option>{"Madinah"}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={aiSettings.prayer_pause} id="autopause"
                onChange={function(e) { updateAI("prayer_pause", e.target.checked); }} className="accent-indigo-600" />
              <label htmlFor="autopause" className="text-sm text-gray-700">{"Auto-pause during prayer times"}</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {"Pause: " + aiSettings.pause_minutes + " minutes"}
              </label>
              <input type="range" min="15" max="60" value={aiSettings.pause_minutes}
                onChange={function(e) { updateAI("pause_minutes", parseInt(e.target.value)); }}
                className="w-full accent-indigo-600" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={aiSettings.ramadan_mode} id="ramadan"
                onChange={function(e) { updateAI("ramadan_mode", e.target.checked); }} className="accent-indigo-600" />
              <label htmlFor="ramadan" className="text-sm text-gray-700">{"Ramadan mode (extended pauses + special greetings)"}</label>
            </div>
          </div>
        </div>

        {/* PDPL Compliance */}
        <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />{"PDPL Compliance"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-2xl mb-1">{"\uD83D\uDD12"}</p>
              <p className="font-semibold text-green-700">{"AES-256 Encryption"}</p>
              <p className="text-xs text-green-600 mt-1">{"Customer PII encrypted at rest"}</p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-2xl mb-1">{"\uD83D\uDCCB"}</p>
              <p className="font-semibold text-green-700">{"Consent Management"}</p>
              <p className="text-xs text-green-600 mt-1">{"Grant/revoke/check per customer"}</p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-2xl mb-1">{"\uD83C\uDDF8\uD83C\uDDE6"}</p>
              <p className="font-semibold text-green-700">{"Saudi Data Residency"}</p>
              <p className="text-xs text-green-600 mt-1">{"All data stored in Saudi Arabia"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
