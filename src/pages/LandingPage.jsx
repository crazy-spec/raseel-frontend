import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  var showPricingState = useState(false);
  var showPricing = showPricingState[0];
  var setShowPricing = showPricingState[1];
  var langState = useState("en");
  var lang = langState[0];
  var setLang = langState[1];

  var features = [
    { icon: "\uD83E\uDD16", title: "AI-Powered Replies", titleAr: "\u0631\u062F\u0648\u062F \u0630\u0643\u064A\u0629", desc: "Smart AI understands Arabic and English, replies instantly 24/7", descAr: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A \u064A\u0641\u0647\u0645 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u064A\u0631\u062F \u0641\u0648\u0631\u0627\u064B \u0662\u0664/\u0667" },
    { icon: "\uD83D\uDCF1", title: "WhatsApp Native", titleAr: "\u0648\u0627\u062A\u0633\u0627\u0628 \u0645\u0628\u0627\u0634\u0631", desc: "Works directly on WhatsApp. No app downloads needed", descAr: "\u064A\u0639\u0645\u0644 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628 \u0628\u062F\u0648\u0646 \u062A\u062D\u0645\u064A\u0644" },
    { icon: "\uD83D\uDCE6", title: "Auto Orders", titleAr: "\u0637\u0644\u0628\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0629", desc: "Customers browse menu, order, and confirm — all automated", descAr: "\u0627\u0644\u0639\u0645\u064A\u0644 \u064A\u062A\u0635\u0641\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0648\u064A\u0637\u0644\u0628 \u0648\u064A\u0624\u0643\u062F \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B" },
    { icon: "\uD83D\uDCC5", title: "Smart Bookings", titleAr: "\u062D\u062C\u0648\u0632\u0627\u062A \u0630\u0643\u064A\u0629", desc: "Appointment booking for clinics, salons, hotels — automatic", descAr: "\u062D\u062C\u0632 \u0645\u0648\u0627\u0639\u064A\u062F \u0644\u0644\u0639\u064A\u0627\u062F\u0627\u062A \u0648\u0627\u0644\u0635\u0627\u0644\u0648\u0646\u0627\u062A \u0648\u0627\u0644\u0641\u0646\u0627\u062F\u0642" },
    { icon: "\uD83D\uDEE1\uFE0F", title: "PDPL Compliant", titleAr: "\u0645\u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u0627\u0644\u0646\u0638\u0627\u0645", desc: "Full Saudi PDPL data protection compliance built-in", descAr: "\u0645\u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u0646\u0638\u0627\u0645 \u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629" },
    { icon: "\uD83C\uDDF8\uD83C\uDDE6", title: "Built for Saudi", titleAr: "\u0635\u0646\u0639 \u0644\u0644\u0633\u0639\u0648\u062F\u064A\u0629", desc: "Arabic first, prayer times aware, Saudi cultural values", descAr: "\u0639\u0631\u0628\u064A \u0623\u0648\u0644\u0627\u064B\u060C \u0645\u0631\u0627\u0639\u064A \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u0648\u0627\u0644\u062B\u0642\u0627\u0641\u0629" },
  ];

  var plans = [
    { name: "Starter", nameAr: "\u0623\u0633\u0627\u0633\u064A", price: "500", features: ["1 WhatsApp number", "500 conversations/month", "Product catalog", "Order management", "Arabic + English"], featuresAr: ["\u0631\u0642\u0645 \u0648\u0627\u062A\u0633\u0627\u0628 \u0648\u0627\u062D\u062F", "\u0665\u0660\u0660 \u0645\u062D\u0627\u062F\u062B\u0629/\u0634\u0647\u0631", "\u0643\u062A\u0627\u0644\u0648\u062C \u0645\u0646\u062A\u062C\u0627\u062A", "\u0625\u062F\u0627\u0631\u0629 \u0637\u0644\u0628\u0627\u062A", "\u0639\u0631\u0628\u064A + \u0625\u0646\u062C\u0644\u064A\u0632\u064A"] },
    { name: "Professional", nameAr: "\u0627\u062D\u062A\u0631\u0627\u0641\u064A", price: "1,500", popular: true, features: ["Everything in Starter", "Unlimited conversations", "Appointment booking", "Analytics dashboard", "Priority support"], featuresAr: ["\u0643\u0644 \u0645\u0632\u0627\u064A\u0627 \u0627\u0644\u0623\u0633\u0627\u0633\u064A", "\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u062F\u0648\u062F\u0629", "\u062D\u062C\u0632 \u0645\u0648\u0627\u0639\u064A\u062F", "\u0644\u0648\u062D\u0629 \u062A\u062D\u0644\u064A\u0644\u0627\u062A", "\u062F\u0639\u0645 \u0623\u0648\u0644\u0648\u064A\u0629"] },
    { name: "Enterprise", nameAr: "\u0645\u0624\u0633\u0633\u0627\u062A", price: "3,000+", features: ["Everything in Pro", "Multiple branches", "Custom AI training", "API integration", "Dedicated manager"], featuresAr: ["\u0643\u0644 \u0645\u0632\u0627\u064A\u0627 \u0627\u0644\u0627\u062D\u062A\u0631\u0627\u0641\u064A", "\u0641\u0631\u0648\u0639 \u0645\u062A\u0639\u062F\u062F\u0629", "\u062A\u062F\u0631\u064A\u0628 \u0630\u0643\u0627\u0621 \u0645\u062E\u0635\u0635", "\u0631\u0628\u0637 API", "\u0645\u062F\u064A\u0631 \u062D\u0633\u0627\u0628 \u0645\u062E\u0635\u0635"] },
  ];

  var sectors = [
    { icon: "\uD83C\uDF57", name: "Restaurants", nameAr: "\u0645\u0637\u0627\u0639\u0645" },
    { icon: "\uD83C\uDFE5", name: "Medical", nameAr: "\u0639\u064A\u0627\u062F\u0627\u062A" },
    { icon: "\uD83D\uDC87", name: "Salons", nameAr: "\u0635\u0627\u0644\u0648\u0646\u0627\u062A" },
    { icon: "\uD83C\uDFE8", name: "Hotels", nameAr: "\u0641\u0646\u0627\u062F\u0642" },
    { icon: "\uD83D\uDECD\uFE0F", name: "Retail", nameAr: "\u062A\u062C\u0632\u0626\u0629" },
    { icon: "\uD83C\uDF93", name: "Education", nameAr: "\u062A\u0639\u0644\u064A\u0645" },
    { icon: "\uD83D\uDE97", name: "Auto", nameAr: "\u0633\u064A\u0627\u0631\u0627\u062A" },
    { icon: "\uD83C\uDFE0", name: "Real Estate", nameAr: "\u0639\u0642\u0627\u0631\u0627\u062A" },
  ];

  var isAr = lang === "ar";

  return (
    <div className={"min-h-screen bg-white " + (isAr ? "rtl" : "")}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white">R</div>
          <span className="text-2xl font-bold text-gray-900">Raseel</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={function() { setLang(lang === "en" ? "ar" : "en"); }}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-50">
            {isAr ? "English" : "\u0639\u0631\u0628\u064A"}
          </button>
          <Link to="/" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
            {isAr ? "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645" : "Dashboard"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
          {isAr ? "\uD83C\uDDF8\uD83C\uDDE6 \u0635\u0646\u0639 \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629" : "\uD83C\uDDF8\uD83C\uDDE6 Built in Saudi Arabia"}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          {isAr ? (
            <span>{"\u062D\u0648\u0651\u0644 \u0648\u0627\u062A\u0633\u0627\u0628\u0643 \u0625\u0644\u0649"}<br /><span className="text-emerald-600">{"\u0645\u0648\u0638\u0641 \u0630\u0643\u064A"}</span>{" \u064A\u0639\u0645\u0644 \u0662\u0664/\u0667"}</span>
          ) : (
            <span>{"Turn Your WhatsApp Into"}<br /><span className="text-emerald-600">{"A Smart Employee"}</span>{" That Works 24/7"}</span>
          )}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          {isAr
            ? "\u0631\u0633\u064A\u0644 \u064A\u0631\u062F \u0639\u0644\u0649 \u0639\u0645\u0644\u0627\u0626\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629\u060C \u064A\u0623\u062E\u0630 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\u060C \u064A\u062D\u062C\u0632 \u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F\u060C \u0648\u064A\u0631\u0633\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u2014 \u0628\u062F\u0648\u0646 \u062A\u062F\u062E\u0644 \u0645\u0646\u0643"
            : "Raseel auto-replies to your customers in Arabic and English, takes orders, books appointments, and sends prices \u2014 without any work from you"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/966553431867?text=I%20want%20to%20know%20more%20about%20Raseel"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30">
            {isAr ? "\uD83D\uDCAC \u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628" : "\uD83D\uDCAC WhatsApp Us Now"}
          </a>
          <Link to="/agents"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition">
            {isAr ? "\uD83C\uDFAF \u062C\u0631\u0628 \u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A" : "\uD83C\uDFAF Try Live Demo"}
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          {isAr ? "\u0628\u062F\u0648\u0646 \u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646 \u00B7 \u0639\u0631\u0636 \u0645\u062C\u0627\u0646\u064A \u00B7 \u062A\u0641\u0639\u064A\u0644 \u0641\u0648\u0631\u064A" : "No credit card needed \u00B7 Free demo \u00B7 Setup in 24 hours"}
        </p>
      </section>

      {/* Problem / Solution */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-red-100">
            <h3 className="text-xl font-bold text-red-700 mb-4">{isAr ? "\u274C \u0628\u062F\u0648\u0646 \u0631\u0633\u064A\u0644" : "\u274C Without Raseel"}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>{isAr ? "\uD83D\uDE24 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u064A\u0646\u062A\u0638\u0631\u0648\u0646 \u0633\u0627\u0639\u0627\u062A \u0644\u0644\u0631\u062F" : "\uD83D\uDE24 Customers wait hours for a reply"}</li>
              <li>{isAr ? "\uD83D\uDCB8 \u062A\u062E\u0633\u0631 \u0637\u0644\u0628\u0627\u062A \u0628\u0627\u0644\u0644\u064A\u0644" : "\uD83D\uDCB8 You lose orders at night"}</li>
              <li>{isAr ? "\uD83D\uDE29 \u0645\u0648\u0638\u0641 \u064A\u0631\u062F \u0628\u0628\u0637\u0621 \u0623\u0648 \u064A\u0646\u0633\u0649" : "\uD83D\uDE29 Staff reply slow or forget"}</li>
              <li>{isAr ? "\uD83D\uDCB0 \u062A\u062F\u0641\u0639 \u0663\u0660\u0660\u0660+ \u0631\u064A\u0627\u0644 \u0631\u0627\u062A\u0628 \u0645\u0648\u0638\u0641" : "\uD83D\uDCB0 Pay 3,000+ SAR employee salary"}</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 border-2 border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">{isAr ? "\u2705 \u0645\u0639 \u0631\u0633\u064A\u0644" : "\u2705 With Raseel"}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>{isAr ? "\u26A1 \u0631\u062F \u0641\u0648\u0631\u064A \u062E\u0644\u0627\u0644 \u062B\u0648\u0627\u0646\u064A" : "\u26A1 Instant reply in seconds"}</li>
              <li>{isAr ? "\uD83C\uDF19 \u064A\u0639\u0645\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629 \u062D\u062A\u0649 \u0628\u0627\u0644\u0644\u064A\u0644" : "\uD83C\uDF19 Works 24 hours even at midnight"}</li>
              <li>{isAr ? "\uD83D\uDCE6 \u064A\u0623\u062E\u0630 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B" : "\uD83D\uDCE6 Takes orders automatically"}</li>
              <li>{isAr ? "\uD83D\uDCB5 \u064A\u0648\u0641\u0631 \u0631\u0627\u062A\u0628 \u0645\u0648\u0638\u0641 \u0643\u0627\u0645\u0644" : "\uD83D\uDCB5 Saves a full employee salary"}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {isAr ? "\u064A\u0639\u0645\u0644 \u0645\u0639 \u062C\u0645\u064A\u0639 \u0627\u0644\u0642\u0637\u0627\u0639\u0627\u062A" : "Works With Every Sector"}
        </h2>
        <p className="text-gray-500 mb-10">{isAr ? "\u062D\u0644\u0648\u0644 \u0645\u062E\u0635\u0635\u0629 \u0644\u0643\u0644 \u0646\u0648\u0639 \u0645\u0646 \u0627\u0644\u0623\u0639\u0645\u0627\u0644" : "Custom solutions for every type of business"}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sectors.map(function(s) {
            return (
              <div key={s.name} className="bg-gray-50 rounded-xl p-6 hover:bg-emerald-50 hover:border-emerald-200 border-2 border-transparent transition cursor-pointer">
                <span className="text-4xl">{s.icon}</span>
                <p className="font-semibold text-gray-900 mt-3">{isAr ? s.nameAr : s.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {isAr ? "\u0644\u0645\u0627\u0630\u0627 \u0631\u0633\u064A\u0644\u061F" : "Why Raseel?"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(function(f) {
              return (
                <div key={f.title} className="bg-white rounded-xl p-6 border hover:shadow-md transition">
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3">{isAr ? f.titleAr : f.title}</h3>
                  <p className="text-gray-500 mt-2 text-sm">{isAr ? f.descAr : f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {isAr ? "\u0627\u0644\u0623\u0633\u0639\u0627\u0631" : "Simple Pricing"}
        </h2>
        <p className="text-gray-500 mb-10">{isAr ? "\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0639\u0645\u0644\u0643" : "Choose the plan that fits your business"}</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map(function(plan) {
            return (
              <div key={plan.name} className={"bg-white rounded-2xl p-8 border-2 text-left " + (plan.popular ? "border-emerald-500 shadow-xl relative" : "border-gray-200")}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {isAr ? "\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B" : "MOST POPULAR"}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{isAr ? plan.nameAr : plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{isAr ? " \u0631\u064A\u0627\u0644/\u0634\u0647\u0631" : " SAR/mo"}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {(isAr ? plan.featuresAr : plan.features).map(function(f) {
                    return (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500">{"\u2713"}</span> {f}
                      </li>
                    );
                  })}
                </ul>
                <a href="https://wa.me/966553431867?text=I%20want%20the%20Raseel%20plan"
                  className={"w-full block text-center py-3 rounded-xl font-medium transition " + (plan.popular ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {isAr ? "\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646" : "Get Started"}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-emerald-600 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {isAr ? "\u062C\u0627\u0647\u0632 \u062A\u0628\u062F\u0623\u061F" : "Ready to Start?"}
        </h2>
        <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
          {isAr ? "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0627\u0644\u062D\u064A\u0646 \u0648\u0641\u0639\u0651\u0644 \u0646\u0638\u0627\u0645\u0643 \u062E\u0644\u0627\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629" : "Contact us now and get your system live within 24 hours"}
        </p>
        <a href="https://wa.me/966553431867?text=I%20want%20to%20try%20Raseel"
          className="inline-flex items-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-50 transition shadow-xl">
          {"\uD83D\uDCAC"} {isAr ? "\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628" : "WhatsApp: +966 55 343 1867"}
        </a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">R</div>
            <span className="font-bold text-gray-900">Raseel</span>
          </div>
          <p className="text-sm text-gray-400">
            {"\u00A9 2026 Raseel. "}{isAr ? "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629" : "All rights reserved."}{" \uD83C\uDDF8\uD83C\uDDE6 Saudi Arabia"}
          </p>
          <p className="text-sm text-gray-400">
            {isAr ? "\u0645\u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u0646\u0638\u0627\u0645 \u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A (PDPL)" : "PDPL Compliant"}{" | "}<Link to="/privacy" className="text-gray-400 hover:text-emerald-400">{isAr ? "\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629" : "Privacy"}</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

