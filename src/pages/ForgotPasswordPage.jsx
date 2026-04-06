import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, ArrowLeft, CheckCircle } from "lucide-react";

const BACKEND = "https://raseel-backend.onrender.com/api";

export default function ForgotPasswordPage() {
  var emailState = useState("");
  var email = emailState[0];
  var setEmail = emailState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var sentState = useState(false);
  var sent = sentState[0];
  var setSent = sentState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  var handleSubmit = function(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch(BACKEND + "/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    })
    .then(function(res) { return res.json(); })
    .then(function() {
      setLoading(false);
      setSent(true);
    })
    .catch(function() {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    });
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
          <p className="text-gray-500 mb-2">
            If <strong>{email}</strong> is registered, you will receive a reset link shortly.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Check your spam folder if you do not see it.
          </p>
          <Link to="/login"
            className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 mt-2">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login"
            className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-400">
            Powered by Raseel رسيل 🤖 | 🇸🇦
          </p>
        </div>
      </div>
    </div>
  );
}
