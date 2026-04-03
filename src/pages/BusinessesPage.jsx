import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Building2, MapPin, Plus, Shield, Phone } from "lucide-react";

export default function BusinessesPage() {
  var app = useApp();
  var businesses = app.businesses;
  var activeBusiness = app.activeBusiness;
  var dispatch = app.dispatch;
  var auth = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{"Businesses"}</h1>
          <p className="text-gray-500">{businesses.length + " businesses across Saudi Arabia"}</p>
        </div>
        <Link to="/onboarding"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          {"Add Business"}
        </Link>
      </div>

      {businesses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{"No Businesses Yet"}</h3>
          <p className="text-gray-500 mb-6">{"Create your first business to get started with Raseel."}</p>
          <Link to="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">
            <Plus className="w-5 h-5" />{"Create Business"}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map(function(biz) {
          var isActive = activeBusiness && activeBusiness.id === biz.id;
          return (
            <div key={biz.id}
              onClick={function() { dispatch({ type: "SET_ACTIVE_BUSINESS", payload: biz }); }}
              className={"rounded-xl border-2 bg-white p-6 shadow-sm cursor-pointer transition-all hover:shadow-md " + (isActive ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-gray-200")}>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{biz.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{biz.displayName}</h3>
                  <p className="text-sm text-gray-400 truncate" dir="rtl">{biz.name_ar}</p>
                </div>
                {isActive && (
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{"Active"}</span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-gray-400" />{"Sector"}</span>
                  <span className="font-medium capitalize">{biz.sector}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{"City"}</span>
                  <span className="font-medium">{biz.city}</span>
                </div>
                {biz.access_code && (
                  <div className="flex items-center justify-between">
                    <span>{"Access Code"}</span>
                    <span className="font-mono text-xs font-bold text-indigo-600">{biz.access_code}</span>
                  </div>
                )}
                {biz.whatsapp_phone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" />{"WhatsApp"}</span>
                    <span className="font-medium">{biz.whatsapp_phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>{"Plan"}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">{biz.tier || "starter"}</span>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 rounded-lg bg-indigo-50 p-2 text-center text-xs font-semibold text-indigo-700">
                  {"Currently Active \u2713"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
