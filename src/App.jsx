import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import BusinessesPage from './pages/BusinessesPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import AgentsPage from './pages/AgentsPage';
import LeadFinderPage from './pages/LeadFinderPage';
import ConversationsPage from './pages/ConversationsPage';
import PDPLPage from './pages/PDPLPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ErrorBoundary>
            <Routes>
              <Route path='/landing' element={<LandingPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/privacy' element={<PrivacyPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} />
              <Route path='/reset-password' element={<ResetPasswordPage />} />

              <Route
                path='/onboarding'
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path='/' element={<DashboardPage />} />
                <Route path='/businesses' element={<BusinessesPage />} />
                <Route path='/products' element={<ProductsPage />} />
                <Route path='/orders' element={<OrdersPage />} />
                <Route path='/customers' element={<CustomersPage />} />
                <Route path='/agents' element={<AgentsPage />} />
                <Route path='/leads' element={<LeadFinderPage />} />
                <Route path='/conversations' element={<ConversationsPage />} />
                <Route path='/pdpl' element={<PDPLPage />} />
                <Route path='/analytics' element={<AnalyticsPage />} />
                <Route path='/settings' element={<SettingsPage />} />
              </Route>

              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
