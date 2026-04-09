import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MessageCircle, Building2, MapPin, ArrowRight, ArrowLeft,
  Check, Utensils, Stethoscope, Hotel, ShoppingBag, Scissors,
  GraduationCap, Sparkles, Loader2, Phone, Bot, Star
} from "lucide-react";

var BACKEND = "https://raseel-backend.onrender.com/api";

var SECTORS = [
  {
    id: "restaurant",
    label: "Restaurant",
    labelAr: "مطعم",
    icon: Utensils,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    activeColor: "bg-orange-500 text-white border-orange-500",
    aiFeatures: [
      "Auto-reply to menu inquiries",
      "Take orders via WhatsApp",
      "Send daily specials automatically",
      "Handle reservations and bookings"
    ],
    aiPersonality: "Friendly food expert who knows your full menu and handles orders smoothly in Arabic and English."
  },
  {
    id: "medical",
    label: "Medical Center",
    labelAr: "مركز طبي",
    icon: Stethoscope,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    activeColor: "bg-blue-500 text-white border-blue-500",
    aiFeatures: [
      "Book appointments automatically",
      "Send appointment reminders",
      "Answer service and pricing questions",
      "PDPL-compliant patient handling"
    ],
    aiPersonality: "Professional medical assistant that books appointments, answers queries, and handles patients with care."
  },
  {
    id: "hotel",
    label: "Hotel",
    labelAr: "فندق",
    icon: Hotel,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    activeColor: "bg-purple-500 text-white border-purple-500",
    aiFeatures: [
      "Handle room booking inquiries",
      "Share room types and pricing",
      "Manage check-in questions",
      "Upsell hotel services automatically"
    ],
    aiPersonality: "Warm hospitality concierge who handles bookings, answers guest questions, and promotes hotel services."
  },
  {
    id: "retail",
    label: "Retail Store",
    labelAr: "متجر",
    icon: ShoppingBag,
    color: "bg-green-50 text-green-700 border-green-200",
    activeColor: "bg-green-500 text-white border-green-500",
    aiFeatures: [
      "Answer product availability questions",
      "Share prices and offers instantly",
      "Help customers find products",
      "Handle order status inquiries"
    ],
    aiPersonality: "Knowledgeable shop assistant who helps customers find products, checks stock, and shares latest offers."
  },
  {
    id: "salon",
    label: "Beauty Salon",
    labelAr: "صالون تجميل",
    icon: Scissors,
    color: "bg-pink-50 text-pink-700 border-pink-200",
    activeColor: "bg-pink-500 text-white border-pink-500",
    aiFeatures: [
      "Book beauty appointments automatically",
      "Share service menu and pricing",
      "Send appointment confirmations",
      "Handle rescheduling requests"
    ],
    aiPersonality: "Friendly beauty advisor who books appointments, shares services, and makes clients feel welcome."
  },
  {
    id: "education",
    label: "Education Center",
    labelAr: "مركز تعليمي",
    icon: GraduationCap,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    activeColor: "bg-indigo-500 text-white border-indigo-500",
    aiFeatures: [
      "Answer course and pricing inquiries",
      "Help students enroll via WhatsApp",
      "Share schedules and timings",
      "Send reminders for classes"
    ],
    aiPersonality: "Supportive education advisor who helps students find the right course and guides them through enrollment."
  }
];

var CITIES = [
  "Riyadh", "Jeddah", "Dammam", "Mecca", "Medina", "Khobar",
  "Dhahran", "Tabuk", "Abha", "Taif", "Buraidah", "Khamis Mushait",
  "Najran", "Yanbu", "Al Jubail", "Hail"
];

export default function OnboardingPage() {
  var navigate = useNavigate();
  var auth = useAuth();

  var stepState = useState(1);
  var step = stepState[0];
  var setStep = stepState[1];

  var nameState = useState("");
  var businessName = nameState[0];
  var setBusinessName = nameState[1];

  var nameArState = useState("");
  var businessNameAr = nameArState[0];
  var setBusinessNameAr = nameArState[1];

  var cityState = useState("");
  var city = cityState[0];
  var setCity = cityState[1];

  var phoneState = useState("");
  var whatsappPhone = phoneState[0];
  var setWhatsappPhone = phoneState[1];

  var sectorState = useState("");
  var sector = sectorState[0];
  var setSector = sectorState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var statusState = useState("");
  var statusMsg = statusState[0];
  var setStatusMsg = statusState[1];

  var doneState = useState(false);
  var done = doneState[0];
  var setDone = doneState[1];

  var selectedSector = SECTORS.find(function(s) { return s.id === sector; });

  var handleNext = function() {
    setError("");
    if (step === 1) {
      if (!businessName.trim()) {
        setError("Please enter your business name in English.");
        return;
      }
      if (!city) {
        setError("Please select your city.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!sector) {
        setError("Please select your business sector.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleCreateBusiness();
    }
  };

  var handleBack = function() {
    setError("");
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  var handleCreateBusiness = function() {
    setLoading(true);
    setError("");
    setStatusMsg("Setting up your business...");
    var token = auth.token;

    fetch(BACKEND + "/businesses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        name_en: businessName.trim(),
        name_ar: businessNameAr.trim() || businessName.trim(),
        city: city,
        sector: sector,
        whatsapp_phone: whatsappPhone.trim() || null
      })
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Failed to create business");
        });
      }
      return res.json();
    })
    .then(function(business) {
      setStatusMsg("Adding sample products for your sector...");
      return fetch(BACKEND + "/products/seed/" + business.id, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
      })
      .then(function(seedRes) {
        return seedRes.json().catch(function() { return {}; });
      })
      .then(function() {
        setStatusMsg("Configuring your AI agent...");
        return new Promise(function(resolve) { setTimeout(resolve, 1000); });
      })
      .then(function() {
        setLoading(false);
        setStatusMsg("");
        setDone(true);
        setTimeout(function() { window.location.href = "/"; }, 2500);
      });
    })
    .catch(function(err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatusMsg("");
      setLoading(false);
    });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {"You're All Set! 🎉"}
          </h2>
          <p className="text-gray-600 mb-1">
            <strong>{businessName}</strong> {" is live with your AI agent."}
          </p>
          <p className="text-gray-400 text-sm mb-8">
            {"Your AI is ready to handle WhatsApp messages 24/7."}
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{"Taking you to your dashboard..."}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gray-50 border-b px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{"Setup Your AI Business"}</h1>
              <p className="text-gray-500 text-sm">{"Step " + step + " of 3"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className={"h-2 rounded-full flex-1 transition-all " + (step >= 1 ? "bg-indigo-600" : "bg-gray-200")}></div>
            <div className={"h-2 rounded-full flex-1 transition-all " + (step >= 2 ? "bg-indigo-600" : "bg-gray-200")}></div>
            <div className={"h-2 rounded-full flex-1 transition-all " + (step >= 3 ? "bg-indigo-600" : "bg-gray-200")}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>Business Info</span>
            <span>Select Sector</span>
            <span>Review & Launch</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {statusMsg && (
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin flex-shrink-0" />
              <p className="text-indigo-700 text-sm font-medium">{statusMsg}</p>
            </div>
          )}

          {/* Step 1 — Business Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{"Tell us about your business"}</h2>
                <p className="text-gray-500 text-sm mt-1">{"This information will be shown to your customers"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Business Name (English)"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={function(e) { setBusinessName(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    placeholder="e.g. Al-Baik Restaurant"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Business Name (Arabic)"}
                  <span className="text-gray-400 font-normal ml-1">{"— recommended for Saudi customers"}</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={businessNameAr}
                    onChange={function(e) { setBusinessNameAr(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    placeholder="مثال: مطعم البيك"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  {"WhatsApp Phone Number"}
                  <span className="text-gray-400 font-normal ml-1">{"— optional, add later"}</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={function(e) { setWhatsappPhone(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    placeholder="+966 5XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline w-4 h-4 mr-1" />{"City"} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CITIES.map(function(c) {
                    return (
                      <button
                        key={c}
                        onClick={function() { setCity(c); }}
                        className={"px-3 py-2 rounded-lg text-sm font-medium border transition-all " +
                          (city === c
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50")
                        }
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Sector Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{"What type of business do you run?"}</h2>
                <p className="text-gray-500 text-sm mt-1">{"Your AI agent will be configured specifically for your sector"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SECTORS.map(function(s) {
                  var isActive = sector === s.id;
                  var IconComp = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={function() { setSector(s.id); }}
                      className={"relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all " +
                        (isActive ? s.activeColor + " shadow-lg scale-[1.02]" : s.color + " hover:shadow-md hover:scale-[1.01]")
                      }
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      <IconComp className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-semibold text-sm">{s.label}</div>
                        <div className={"text-xs mt-0.5 " + (isActive ? "text-white/80" : "text-gray-500")} dir="rtl">
                          {s.labelAr}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* AI Preview after selection */}
              {selectedSector && (
                <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-900 text-sm">
                      {"Your AI Agent for " + selectedSector.label}
                    </span>
                  </div>
                  <p className="text-indigo-700 text-sm mb-4 italic">
                    {'"' + selectedSector.aiPersonality + '"'}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedSector.aiFeatures.map(function(feature, idx) {
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span className="text-indigo-800 text-sm">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Review and Launch */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{"Review & Launch 🚀"}</h2>
                <p className="text-gray-500 text-sm mt-1">{"Confirm your setup before we create your AI agent"}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Business Name</span>
                  <span className="font-semibold text-gray-900">{businessName}</span>
                </div>
                {businessNameAr && (
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Arabic Name</span>
                    <span className="font-semibold text-gray-900" dir="rtl">{businessNameAr}</span>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">City</span>
                  <span className="font-semibold text-gray-900">{city}</span>
                </div>
                {whatsappPhone && (
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">WhatsApp</span>
                    <span className="font-semibold text-gray-900">{whatsappPhone}</span>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Sector</span>
                  <span className="font-semibold text-gray-900">
                    {selectedSector ? selectedSector.label : sector}
                  </span>
                </div>
              </div>

              {selectedSector && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-900 text-sm">{"AI Agent Ready"}</span>
                    <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Configured
                    </span>
                  </div>
                  <p className="text-indigo-700 text-sm">
                    {"Your AI agent is configured for " + selectedSector.label + " and will handle customer messages 24/7 in Arabic and English."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-8 py-5 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 font-medium transition-all disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />{"Back"}
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />{"Setting up..."}</>
            ) : step === 3 ? (
              <><Sparkles className="w-5 h-5" />{"Launch My AI Agent"}</>
            ) : (
              <>{"Next"}<ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
