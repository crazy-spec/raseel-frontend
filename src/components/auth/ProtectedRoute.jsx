import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute(props) {
  var children = props.children;
  var auth = useAuth();

  // Still checking token on first load
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">{"Loading Raseel..."}</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
