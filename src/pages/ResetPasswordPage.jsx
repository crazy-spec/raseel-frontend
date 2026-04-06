import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MessageCircle, Lock, CheckCircle, AlertCircle } from "lucide-react";

const BACKEND = "https://raseel-backend.onrender.com/api";

export default function ResetPasswordPage() {
  var navigate = useNavigate();
  var searchParamsResult = useSearchParams();
  var searchParams = searchParamsResult[0];

  var token = searchParams.get("token") || "";

  var passwordState = useState("");
  var password = passwordState[0];
  var setPassword = passwordState[1];

  var confirmState = useState("");
  var confirm = confirmState[0];
  var setConfirm = confirmState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var successState = useState(false);
  var success = successState[0];
  var setSuccess = successState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  useEffect(function() {
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
    }
  }, [token]);

  var handleSubmit = function(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    fetch(BACKEND + "/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, new_password: password })
    })
    .then(function(res) {
      if (!res.ok) {
        return res.json().then(function(err) {
          throw new Error(err.detail || "Reset failed");
        });
      }
      return res.json();
    })
    .then(function() {
      setLoading(false);
      setSuccess(true);
      setTimeout(function() {
        navigate("/login");
      }, 3000);
    })
    .catch(function(err) {
      setLoading(false);
      setError(err.message || "Something went wrong.");
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Reset!</h2>
          <p className="text-gray-500 mb-6">
            Your password has been reset successfully.
          </p>
          <p className="text-gray-400 text-sm">Redirecting to login...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={function(e) { setConfirm(e.target.value); }}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
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
