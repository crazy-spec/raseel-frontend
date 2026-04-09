import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, MessageCircle, ArrowRight, User, Phone } from "lucide-react";

const BACKEND = "https://raseel-backend.onrender.com/api";

export default function RegisterPage() {
  var navigate = useNavigate();
  var auth = useAuth();

  var nameState = useState("");
  var fullName = nameState[0];
  var setFullName = nameState[1];

  var emailState = useState("");
  var email = emailState[0];
  var setEmail = emailState[1];

  var phoneState = useState("");
  var phone = phoneState[0];
  var setPhone = phoneState[1];

  var passwordState = useState("");
  var password = passwordState[0];
  var setPassword = passwordState[1];

  var confirmState = useState("");
  var confirmPassword = confirmState[0];
  var setConfirmPassword = confirmState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var showPassState = useState(false);
  var showPass = showPassState[0];
  var setShowPass = showPassState[1];

  var statusState = useState("");
  var statusMsg = statusState[0];
  var setStatusMsg = statusState[1];

  var handleRegister = function(e) {
    e.preventDefault();
    setError("");
    setStatusMsg("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setStatusMsg("Connecting to server...");

    var data = {
      full_name: fullName,
      email: email,
      password: password
    };
    if (phone.trim()) {
      data.phone = phone.trim();
    }

    // Wake up backend first then register
    fetch(BACKEND + "/health")
      .then(function() {
        setStatusMsg("Creating your account...");
        return auth.register(data);
      })
      .then(function() {
        setStatusMsg("");
        navigate("/onboarding");
      })
      .catch(function(err) {
        setError(err.message || "Registration failed. Please try again.");
        setStatusMsg("");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Raseel</h1>
          <p className="text-xl text-indigo-200 mb-4" dir="rtl">{"رسيل — الرسول اللطيف"}</p>
          <p className="text-indigo-200 max-w-sm mx-auto leading-relaxed">
            {"Join hundreds of Saudi businesses automating their WhatsApp customer service with AI."}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">{"6"}</div>
              <div className="text-indigo-300 text-sm">{"Sectors"}</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{"24/7"}</div>
              <div className="text-indigo-300 text-sm">{"AI Support"}</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{"90%"}</div>
              <div className="text-indigo-300 text-sm">{"Cost Saved"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Raseel</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{"Create Account"}</h2>
              <p className="text-gray-500 mt-1">{"Start your free trial today"}</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {statusMsg && (
              <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <p className="text-indigo-700 text-sm">{statusMsg}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{"Full Name"}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={function(e) { setFullName(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white"
                    placeholder="Mohammed Al-Rashid"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{"Email"}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={function(e) { setEmail(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white"
                    placeholder="you@business.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {"Phone "}
                  <span className="text-gray-400 font-normal">{"(optional)"}</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={function(e) { setPhone(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white"
                    placeholder="+966 5XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{"Password"}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={function(e) { setPassword(e.target.value); }}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white"
                    placeholder="Min 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={function() { setShowPass(!showPass); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{"Confirm Password"}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={function(e) { setConfirmPassword(e.target.value); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white"
                    placeholder="Repeat your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {"Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                {"Already have an account? "}
                <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  {"Sign In"}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/landing" className="text-gray-400 text-sm hover:text-gray-600">
              {"View Landing Page"} {" \u2192"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
