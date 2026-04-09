import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  Megaphone, Plus, Send, Clock, Users, Star,
  MessageSquare, Zap, Target, CheckCircle,
  AlertCircle, Edit3, Trash2, Eye, X,
  Utensils, Stethoscope, Hotel, ShoppingBag,
  Scissors, GraduationCap, Gift, Bell
} from "lucide-react";

var SECTOR_TEMPLATES = {
  restaurant: [
    {
      id: "r1",
      name: "Daily Special",
      nameAr: "عرض اليوم",
      message: "🍽️ Today's Special at {business_name}!\n\n{special_item} — only {price} SAR\n\nOrder now via WhatsApp or visit us in {city}.\n\nValid today only! ⏰",
      type: "promotion",
      estimatedReach: "All Customers"
    },
    {
      id: "r2",
      name: "Eid Offer",
      nameAr: "عرض العيد",
      message: "🌙 Eid Mubarak from {business_name}!\n\nCelebrate Eid with our special family feast.\nBook your table now and get 15% off!\n\nReply YES to reserve your spot. 🎉",
      type: "seasonal",
      estimatedReach: "All Customers"
    },
    {
      id: "r3",
      name: "Loyalty Reward",
      nameAr: "مكافأة الولاء",
      message: "⭐ Thank you for being a loyal customer!\n\nAs a valued guest of {business_name}, enjoy a FREE dessert on your next visit.\n\nShow this message to redeem. Valid this week only! 🎁",
      type: "loyalty",
      estimatedReach: "Repeat Customers"
    }
  ],
  medical: [
    {
      id: "m1",
      name: "Appointment Reminder",
      nameAr: "تذكير موعد",
      message: "📅 Appointment Reminder\n\nDear patient, your appointment at {business_name} is tomorrow.\n\nPlease arrive 10 minutes early.\nQuestions? Reply to this message.",
      type: "reminder",
      estimatedReach: "Booked Patients"
    },
    {
      id: "m2",
      name: "Health Check Offer",
      nameAr: "عرض فحص صحي",
      message: "🏥 Free Health Screening at {business_name}!\n\nThis month only: Free blood pressure + sugar check.\n\nBook your free slot now — reply BOOK.\n📍 {city}",
      type: "promotion",
      estimatedReach: "All Customers"
    },
    {
      id: "m3",
      name: "Follow-up Care",
      nameAr: "متابعة العلاج",
      message: "💊 How are you feeling?\n\n{business_name} is checking in after your recent visit.\n\nIf you have any concerns or need to reschedule, reply anytime. We are here for you. 🌿",
      type: "followup",
      estimatedReach: "Recent Patients"
    }
  ],
  hotel: [
    {
      id: "h1",
      name: "Weekend Deal",
      nameAr: "عرض نهاية الأسبوع",
      message: "🌴 Weekend Getaway at {business_name}!\n\nBook Thursday-Saturday and save 20% on all rooms.\n\nIncludes breakfast buffet + pool access.\n\nReply BOOK to check availability. 🏊",
      type: "promotion",
      estimatedReach: "All Customers"
    },
    {
      id: "h2",
      name: "Loyalty Guest",
      nameAr: "ضيف مميز",
      message: "👑 Welcome back to {business_name}!\n\nAs a valued returning guest, your room has been upgraded complimentary.\n\nWe look forward to hosting you again in {city}. ✨",
      type: "loyalty",
      estimatedReach: "Repeat Guests"
    },
    {
      id: "h3",
      name: "Ramadan Package",
      nameAr: "باقة رمضان",
      message: "🌙 Ramadan Kareem from {business_name}!\n\nSpecial Ramadan package available:\n• Iftar buffet\n• Suhoor lounge\n• Family rooms at special rates\n\nReply for details. رمضان مبارك 🌙",
      type: "seasonal",
      estimatedReach: "All Customers"
    }
  ],
  retail: [
    {
      id: "rt1",
      name: "Flash Sale",
      nameAr: "تخفيضات سريعة",
      message: "⚡ FLASH SALE at {business_name}!\n\nToday only — 30% off selected items.\n\n🛍️ Visit us in {city} or reply to order.\nOffer ends at midnight! ⏰",
      type: "promotion",
      estimatedReach: "All Customers"
    },
    {
      id: "rt2",
      name: "New Arrivals",
      nameAr: "وصول جديد",
      message: "✨ New Collection Arrived at {business_name}!\n\nFresh products just in — be the first to shop.\n\nReply CATALOG to see the new items. 📦",
      type: "announcement",
      estimatedReach: "All Customers"
    },
    {
      id: "rt3",
      name: "VIP Customer Offer",
      nameAr: "عرض عميل مميز",
      message: "🌟 Exclusive VIP Offer!\n\nDear valued customer, as one of our top shoppers at {business_name}, enjoy early access to our sale.\n\nShop before everyone else — reply VIP to unlock. 🔓",
      type: "loyalty",
      estimatedReach: "Top Customers"
    }
  ],
  salon: [
    {
      id: "s1",
      name: "Booking Reminder",
      nameAr: "تذكير حجز",
      message: "💅 Your appointment is tomorrow!\n\n{business_name} is looking forward to seeing you.\n\nNeed to reschedule? Reply anytime.\nSee you soon! ✨",
      type: "reminder",
      estimatedReach: "Booked Clients"
    },
    {
      id: "s2",
      name: "Monthly Offer",
      nameAr: "عرض الشهر",
      message: "💇 This Month at {business_name}!\n\nBook any hair service and get free eyebrow threading.\n\nLimited slots available — reply BOOK now! 📅",
      type: "promotion",
      estimatedReach: "All Customers"
    },
    {
      id: "s3",
      name: "Bride Package",
      nameAr: "باقة العروس",
      message: "👰 Planning your big day?\n\n{business_name} offers complete bridal packages:\n• Hair + Makeup + Henna\n• Special bridal pricing\n• Priority booking\n\nReply BRIDE for details. 💍",
      type: "seasonal",
      estimatedReach: "All Customers"
    }
  ],
  education: [
    {
      id: "e1",
      name: "Course Enrollment",
      nameAr: "تسجيل الدورة",
      message: "📚 New Course Starting at {business_name}!\n\nEnrollment is now open.\n\nEarly bird discount: 20% off if you register this week.\n\nReply ENROLL to secure your spot! 🎓",
      type: "announcement",
      estimatedReach: "All Students"
    },
    {
      id: "e2",
      name: "Class Reminder",
      nameAr: "تذكير الحصة",
      message: "⏰ Class Reminder!\n\nYour class at {business_name} starts tomorrow at the scheduled time.\n\nPlease prepare your materials.\n\nQuestions? Reply anytime. 📝",
      type: "reminder",
      estimatedReach: "Enrolled Students"
    },
    {
      id: "e3",
      name: "Summer Program",
      nameAr: "برنامج صيفي",
      message: "☀️ Summer Program at {business_name}!\n\nKeep learning this summer with our intensive programs.\n\nAges 8-18 — Arabic, English, Math, Coding.\n\nReply SUMMER for the schedule. 📅",
      type: "seasonal",
      estimatedReach: "All Customers"
    }
  ]
};

var DEFAULT_TEMPLATES = SECTOR_TEMPLATES.restaurant;

var TYPE_COLORS = {
  promotion: "bg-orange-100 text-orange-700",
  reminder: "bg-blue-100 text-blue-700",
  loyalty: "bg-purple-100 text-purple-700",
  seasonal: "bg-green-100 text-green-700",
  announcement: "bg-indigo-100 text-indigo-700",
  followup: "bg-pink-100 text-pink-700"
};

var MOCK_CAMPAIGNS = [
  {
    id: "c1",
    name: "Eid Special Offer",
    status: "sent",
    type: "seasonal",
    sent: 30,
    delivered: 28,
    replied: 12,
    createdAt: "2026-04-05",
    scheduledAt: null
  },
  {
    id: "c2",
    name: "Monthly Newsletter",
    status: "scheduled",
    type: "announcement",
    sent: 0,
    delivered: 0,
    replied: 0,
    createdAt: "2026-04-08",
    scheduledAt: "2026-04-15"
  },
  {
    id: "c3",
    name: "Loyalty Reward",
    status: "draft",
    type: "loyalty",
    sent: 0,
    delivered: 0,
    replied: 0,
    createdAt: "2026-04-09",
    scheduledAt: null
  }
];

export default function CampaignsPage() {
  var appCtx = useApp();
  var authCtx = useAuth();
  var activeBusiness = appCtx.activeBusiness;

  var tabState = useState("campaigns");
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  var showNewState = useState(false);
  var showNew = showNewState[0];
  var setShowNew = showNewState[1];

  var selectedTemplateState = useState(null);
  var selectedTemplate = selectedTemplateState[0];
  var setSelectedTemplate = selectedTemplateState[1];

  var previewState = useState(null);
  var preview = previewState[0];
  var setPreview = previewState[1];

  var campaignNameState = useState("");
  var campaignName = campaignNameState[0];
  var setCampaignName = campaignNameState[1];

  var messageState = useState("");
  var message = messageState[0];
  var setMessage = messageState[1];

  var scheduleState = useState("");
  var scheduleDate = scheduleState[0];
  var setScheduleDate = scheduleState[1];

  var savedState = useState(false);
  var saved = savedState[0];
  var setSaved = savedState[1];

  var sector = activeBusiness ? activeBusiness.sector : "restaurant";
  var templates = SECTOR_TEMPLATES[sector] || DEFAULT_TEMPLATES;
  var businessName = activeBusiness ? activeBusiness.name_en : "Your Business";
  var city = activeBusiness ? activeBusiness.city : "Riyadh";

  var fillTemplate = function(tmpl) {
    return tmpl.message
      .replace(/{business_name}/g, businessName)
      .replace(/{city}/g, city)
      .replace(/{price}/g, "45")
      .replace(/{special_item}/g, "Today's Special");
  };

  var handleSelectTemplate = function(tmpl) {
    setSelectedTemplate(tmpl);
    setCampaignName(tmpl.name);
    setMessage(fillTemplate(tmpl));
    setShowNew(true);
  };

  var handleSaveDraft = function() {
    if (!campaignName.trim() || !message.trim()) return;
    setSaved(true);
    setTimeout(function() { setSaved(false); }, 3000);
  };

  var STATUS_STYLES = {
    sent: "bg-green-100 text-green-700",
    scheduled: "bg-blue-100 text-blue-700",
    draft: "bg-gray-100 text-gray-600"
  };

  var STATUS_ICONS = {
    sent: CheckCircle,
    scheduled: Clock,
    draft: Edit3
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-indigo-600" />
            {"Campaigns"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {"Create and manage marketing campaigns for your customers"}
          </p>
        </div>
        <button
          onClick={function() {
            setShowNew(true);
            setSelectedTemplate(null);
            setCampaignName("");
            setMessage("");
            setScheduleDate("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {"New Campaign"}
        </button>
      </div>

      {/* Meta API Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 font-medium text-sm">
            {"WhatsApp sending is pending Meta API approval"}
          </p>
          <p className="text-amber-700 text-sm mt-0.5">
            {"You can create and save campaign drafts now. Once Meta WhatsApp API is connected, all campaigns will send automatically."}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-gray-500 text-sm">Total Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{"3"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-500 text-sm">Sent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{"28"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-500 text-sm">Replies</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{"12"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-500 text-sm">Reply Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{"43%"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "campaigns", label: "My Campaigns", icon: Megaphone },
          { id: "templates", label: "Templates", icon: Star },
          { id: "segments", label: "Audience", icon: Users }
        ].map(function(tab) {
          var IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={function() { setActiveTab(tab.id); }}
              className={"flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all " +
                (activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700")
              }
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: My Campaigns */}
      {activeTab === "campaigns" && (
        <div className="space-y-3">
          {MOCK_CAMPAIGNS.map(function(camp) {
            var StatusIcon = STATUS_ICONS[camp.status];
            return (
              <div key={camp.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{camp.name}</h3>
                        <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + STATUS_STYLES[camp.status]}>
                          {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                        </span>
                        <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (TYPE_COLORS[camp.type] || "bg-gray-100 text-gray-600")}>
                          {camp.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {"Created: " + camp.createdAt}
                        {camp.scheduledAt ? " • Scheduled: " + camp.scheduledAt : ""}
                      </p>
                      {camp.status === "sent" && (
                        <div className="flex gap-4 mt-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{camp.sent}</p>
                            <p className="text-xs text-gray-500">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{camp.delivered}</p>
                            <p className="text-xs text-gray-500">Delivered</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-indigo-600">{camp.replied}</p>
                            <p className="text-xs text-gray-500">Replied</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">
                              {Math.round((camp.replied / camp.delivered) * 100) + "%"}
                            </p>
                            <p className="text-xs text-gray-500">Rate</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Templates */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>
              {"Showing templates for "}
              <strong>{sector.charAt(0).toUpperCase() + sector.slice(1)}</strong>
              {" — auto-configured for your business"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {templates.map(function(tmpl) {
              return (
                <div key={tmpl.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{tmpl.name}</h3>
                        <span dir="rtl" className="text-gray-500 text-sm">{tmpl.nameAr}</span>
                        <span className={"text-xs px-2 py-0.5 rounded-full font-medium ml-auto " + (TYPE_COLORS[tmpl.type] || "bg-gray-100 text-gray-600")}>
                          {tmpl.type}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{fillTemplate(tmpl)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3.5 h-3.5" />
                          {tmpl.estimatedReach}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={function() { setPreview(tmpl); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      {"Preview"}
                    </button>
                    <button
                      onClick={function() { handleSelectTemplate(tmpl); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      {"Use Template"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Audience Segments */}
      {activeTab === "segments" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{"Audience segments help you send the right message to the right customers"}</span>
          </div>

          {[
            {
              name: "All Customers",
              nameAr: "جميع العملاء",
              count: 30,
              description: "Every customer in your database",
              color: "bg-indigo-100 text-indigo-700",
              icon: Users
            },
            {
              name: "Active This Week",
              nameAr: "نشطون هذا الأسبوع",
              count: 18,
              description: "Customers who messaged in the last 7 days",
              color: "bg-green-100 text-green-700",
              icon: Zap
            },
            {
              name: "Repeat Customers",
              nameAr: "عملاء متكررون",
              count: 12,
              description: "Customers with more than one conversation",
              color: "bg-purple-100 text-purple-700",
              icon: Star
            },
            {
              name: "New This Month",
              nameAr: "جدد هذا الشهر",
              count: 8,
              description: "Customers who joined in the last 30 days",
              color: "bg-orange-100 text-orange-700",
              icon: Gift
            },
            {
              name: "Needs Follow-up",
              nameAr: "يحتاج متابعة",
              count: 5,
              description: "Customers who did not reply in 3+ days",
              color: "bg-red-100 text-red-700",
              icon: Bell
            }
          ].map(function(seg) {
            var IconComp = seg.icon;
            return (
              <div key={seg.name} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + seg.color}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{seg.name}</h3>
                      <span className="text-gray-400 text-sm" dir="rtl">{seg.nameAr}</span>
                    </div>
                    <p className="text-gray-500 text-sm">{seg.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-gray-900">{seg.count}</p>
                  <p className="text-xs text-gray-500">customers</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Campaign Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTemplate ? "Edit Campaign" : "New Campaign"}
              </h2>
              <button
                onClick={function() { setShowNew(false); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Campaign Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={function(e) { setCampaignName(e.target.value); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="e.g. Eid Special Offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Message"} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={function(e) { setMessage(e.target.value); }}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white resize-none"
                  placeholder="Write your WhatsApp message here..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  {message.length + " characters"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {"Schedule (optional)"}
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={function(e) { setScheduleDate(e.target.value); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-sm text-indigo-800 font-medium mb-1">
                  {"📤 Sending to: All Customers (" + (activeBusiness ? "30" : "0") + " contacts)"}
                </p>
                <p className="text-xs text-indigo-600">
                  {"Actual sending will be enabled after Meta WhatsApp API is connected"}
                </p>
              </div>

              {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 text-sm font-medium">{"Draft saved successfully!"}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleSaveDraft}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                {"Save Draft"}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                disabled
                title="Requires Meta WhatsApp API"
              >
                <Send className="w-4 h-4" />
                {"Send Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{"WhatsApp Preview"}</h3>
              <button
                onClick={function() { setPreview(null); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{businessName}</p>
                    <p className="text-xs text-gray-500">{"via WhatsApp"}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-sm text-gray-800 whitespace-pre-line">{fillTemplate(preview)}</p>
                  <p className="text-xs text-gray-400 mt-2 text-right">{"Just now ✓✓"}</p>
                </div>
              </div>
              <button
                onClick={function() { handleSelectTemplate(preview); setPreview(null); }}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                {"Use This Template"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
