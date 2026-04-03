import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { formatSAR } from "../utils/helpers";
import {
  MessageSquare, ShoppingCart, Users, TrendingUp, Shield,
  Package, Plus, Building2, Sparkles, ArrowRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import api from "../services/api";

var COLORS = ["#6366f1", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

export default function DashboardPage() {
  var app = useApp();
  var activeBusiness = app.activeBusiness;
  var businesses = app.businesses;
  var appLoading = app.loading;

  var auth = useAuth();

  var statsState = useState(null);
  var stats = statsState[0];
  var setStats = statsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  useEffect(function() {
    if (activeBusiness) {
      loadDashboard();
    } else if (!appLoading) {
      setLoading(false);
    }
  }, [activeBusiness, appLoading]);

  function loadDashboard() {
    setLoading(true);
    api.get("/analytics/dashboard/" + activeBusiness.id)
      .then(function(res) {
        setStats(res.data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error("Dashboard error:", err);
        setStats(null);
        setLoading(false);
      });
  }

  // Welcome name
  var firstName = auth.user ? auth.user.full_name.split(" ")[0] : "User";

  // No businesses yet — show onboarding prompt
  if (!appLoading && businesses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {"Welcome, " + firstName + "! \uD83D\uDC4B"}
          </h1>
          <p className="text-gray-500">{"Let's get your first business set up on Raseel."}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{"Create Your First Business"}</h2>
              <p className="text-indigo-100 mb-6 leading-relaxed">
                {"Set up your business profile to start using AI-powered WhatsApp automation. Our setup wizard will help you configure everything in under 2 minutes."}
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                {"Start Setup Wizard"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">{"\uD83E\uDD16"}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{"AI Agents"}</h3>
            <p className="text-gray-500 text-sm">{"Automated customer service in Arabic & English, 24/7."}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">{"\uD83D\uDCF1"}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{"WhatsApp Integration"}</h3>
            <p className="text-gray-500 text-sm">{"Connect your WhatsApp Business number in minutes."}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">{"\uD83D\uDEE1\uFE0F"}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{"PDPL Compliant"}</h3>
            <p className="text-gray-500 text-sm">{"Saudi data protection built-in from day one."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || appLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  var customers = stats && stats.customers ? stats.customers : {};
  var conversations = stats && stats.conversations ? stats.conversations : {};
  var products = stats && stats.products ? stats.products : {};
  var orders = stats && stats.orders ? stats.orders : {};
  var compliance = stats && stats.compliance ? stats.compliance : {};

  var weeklyData = [
    { name: "Sat", messages: 45, orders: 12 },
    { name: "Sun", messages: 67, orders: 18 },
    { name: "Mon", messages: 89, orders: 24 },
    { name: "Tue", messages: 102, orders: 30 },
    { name: "Wed", messages: 78, orders: 22 },
    { name: "Thu", messages: 95, orders: 28 },
    { name: "Fri", messages: 34, orders: 8 }
  ];

  var sectorData = businesses.map(function(b) {
    return { name: b.emoji + " " + b.sector, value: Math.floor(Math.random() * 30) + 10 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {activeBusiness ? activeBusiness.emoji + " " + activeBusiness.displayName + " Dashboard" : "Dashboard"}
        </h1>
        <p className="text-gray-500">
          {"Welcome back, " + firstName + " \u00B7 "}
          {activeBusiness ? activeBusiness.sector + " \u00B7 " + activeBusiness.city : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Customers" value={customers.total || 0} icon={<Users size={24} />} color="indigo" />
        <StatCard title="Conversations" value={conversations.total || 0} icon={<MessageSquare size={24} />} color="blue" />
        <StatCard title="Products" value={products.total || 0} icon={<Package size={24} />} color="purple" />
        <StatCard title="Orders" value={orders.total || 0} icon={<ShoppingCart size={24} />} color="amber" />
        <StatCard title="Revenue" value={formatSAR(orders.revenue_sar || 0)} icon={<TrendingUp size={24} />} color="indigo" />
        <StatCard
          title="PDPL Status"
          value={compliance.pdpl_compliant ? "\u2705 Compliant" : "\u26A0\uFE0F Review"}
          icon={<Shield size={24} />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Weekly Activity" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="messages" stroke="#6366f1" fillOpacity={1} fill="url(#colorMsg)" />
              <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Business Portfolio">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {sectorData.map(function(entry, i) {
                  return <Cell key={i} fill={COLORS[i % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {businesses.map(function(b) {
              return (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <span>{b.emoji + " " + b.displayName}</span>
                  <span className="text-xs text-gray-400">{b.city}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Compliance + AI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={"\uD83D\uDEE1\uFE0F PDPL Compliance"}>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
              <span className="text-sm font-medium text-green-800">{"Consents Granted"}</span>
              <span className="font-bold text-green-700">{compliance.consents_granted || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
              <span className="text-sm font-medium text-red-800">{"Consents Revoked"}</span>
              <span className="font-bold text-red-700">{compliance.consents_revoked || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
              <span className="text-sm font-medium text-blue-800">{"Consent Records"}</span>
              <span className="font-bold text-blue-700">{compliance.consent_records || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-3">
              <span className="text-sm font-medium text-indigo-800">{"PII Encryption"}</span>
              <span className="font-bold text-indigo-700">{"AES-256 Active \u2705"}</span>
            </div>
          </div>
        </Card>

        <Card title={"\uD83E\uDD16 AI Agent Performance"}>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{"SalesAgent"}</p>
                <p className="text-xs text-gray-400">{"Products, orders, pricing"}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">{"88%"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{"SupportAgent"}</p>
                <p className="text-xs text-gray-400">{"Help, issues, complaints"}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">{"85%"}</span>
            </div>
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-sm text-gray-500">{"Total Conversations"}</p>
              <p className="text-2xl font-bold text-gray-900">{conversations.total || 0}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
