import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MessageCircle, Building2, MapPin, ArrowRight, ArrowLeft,
  Check, Utensils, Stethoscope, Hotel, ShoppingBag, Scissors, GraduationCap,
  Sparkles, Loader2
} from "lucide-react";

var BACKEND = "https://raseel-backend.onrender.com/api";

var SECTORS = [
  { id: "restaurant", label: "Restaurant", labelAr: "\u0645\u0637\u0639\u0645", icon: Utensils, color: "bg-orange-100 text-orange-700 border-orange-300", activeColor: "bg-orange-500 text-white border-orange-500" },
  { id: "medical", label: "Medical Center", labelAr: "\u0645\u0631\u0643\u0632 \u0637\u0628\u064A", icon: Stethoscope, color: "bg-blue-100 text-blue-700 border-blue-300", activeColor: "bg-blue-500 text-white border-blue-500" },
  { id: "hotel", label: "Hotel", labelAr: "\u0641\u0646\u062F\u0642", icon: Hotel, color: "bg-purple-100 text-purple-700 border-purple-300", activeColor: "bg-purple-500 text-white border-purple-500" },
  { id: "retail", label: "Retail Store", labelAr: "\u0645\u062A\u062C\u0631", icon: ShoppingBag, color: "bg-green-100 text-green-700 border-green-300", activeColor: "bg-green-500 text-white border-green-500" },
  { id: "salon", label: "Beauty Salon", labelAr: "\u0635\u0627\u0644\u0648\u0646 \u062A\u062C\u0645\u064A\u0644", icon: Scissors, color: "bg-pink-100 text-pink-700 border-pink-300", activeColor: "bg-pink-500 text-white border-pink-500" },
  { id: "education", label: "Education", labelAr: "\u062A\u0639\u0644\u064A\u0645", icon: GraduationCap, color: "bg-indigo-100 text-indigo-700 border-indigo-300", activeColor: "bg-indigo-500 text-white border-indigo-500" }
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

  var sectorState = useState("");
  var sector = sectorState[0];
  var setSector = sectorState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var doneState = useState(false);
  var done = doneState[0];
  var setDone = doneState[1];

  var handleNext = function() {
    setError("");
    if (step === 1) {
      if (!businessName.trim()) {
        setError("Please enter your business name.");
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
      handleCreateBusiness();
    }
  };

  var handleBack = function() {
    setError("");
    if (step === 2) setStep(1);
  };

  var handleCreateBusiness = function() {
    setLoading(true);
    setError("");
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
        sector: sector
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
      return fetch(BACKEND + "/products/seed/" + business.id, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
      })
      .then(function(seedRes) {
        return seedRes.json().catch(function() { return {}; });
      })
      .then(function() {
        setLoading(false);
        setDone(true);
        setTimeout(function() { window.location.href = "/"; }, 2000);
      });
    })
    .catch(function(err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{"You're All Set!"}</h2>
          <p className="text-gray-500 mb-2">{businessName + " has been created with sample products."}</p>
          <p className="text-gray-400 text-sm mb-6">{"Redirecting to your dashboard..."}</p>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{"Loading dashboard..."}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="bg-gray-50 border-b px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{"Setup Your Business"}</h1>
              <p className="text-gray-500 text-sm">{"Step " + step + " of 2"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className={"h-2 rounded-full flex-1 " + (step >= 1 ? "bg-indigo-600" : "bg-gray-200")}></div>
            <div className={"h-2 rounded-full flex-1 " + (step >= 2 ? "bg-indigo-600" : "bg-gray-200")}></div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{"Business Name (English)"}</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={businessName}
                    onChange={function(e) { setBusinessName(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    placeholder="e.g. Al-Baik Restaurant" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Business Name (Arabic) "}<span className="text-gray-400 font-normal">{"— optional"}</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={businessNameAr}
                    onChange={function(e) { setBusinessNameAr(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    placeholder="مثال: مطعم البيك" dir="rtl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />{"City"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CITIES.map(function(c) {
                    return (
                      <button key={c} onClick={function() { setCity(c); }}
                        className={"px-3 py-2 rounded-lg text-sm font-medium border transition-all " + (city === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300")}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-6">{"What type of business do you run?"}</p>
              <div className="grid grid-cols-2 gap-4">
                {SECTORS.map(function(s) {
                  var isActive = sector === s.id;
                  var IconComp = s.icon;
                  return (
                    <button key={s.id} onClick={function() { setSector(s.id); }}
                      className={"relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all " + (isActive ? s.activeColor : s.color + " hover:shadow-md")}>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      <IconComp className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-semibold">{s.label}</div>
                        <div className={"text-sm " + (isActive ? "text-white/80" : "text-gray-500")} dir="rtl">{s.labelAr}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 px-8 py-5 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 font-medium transition-all">
              <ArrowLeft className="w-4 h-4" />{"Back"}
            </button>
          ) : (<div></div>)}
          <button onClick={handleNext} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />{"Creating..."}</>
            ) : step === 2 ? (
              <><Sparkles className="w-5 h-5" />{"Create & Setup"}</>
            ) : (
              <>{"Next"}<ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
