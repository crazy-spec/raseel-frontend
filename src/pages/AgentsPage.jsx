import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Bot, Send, RotateCcw, User, Sparkles } from 'lucide-react';

var SECTOR_GREETINGS = {
  restaurant: {
    ar: 'أهلاً وسهلاً بك في {name}! 🌟\nنتشرف بخدمتك. كيف نقدر نساعدك اليوم؟',
    en: 'Welcome to {name}! 🌟\nWe are delighted to serve you. How can we help?',
  },
  medical: {
    ar: 'أهلاً بك في {name}! 🏥\nصحتك تهمنا. كيف نقدر نساعدك؟',
    en: 'Welcome to {name}! 🏥\nYour health matters to us. How can we help?',
  },
  hotel: {
    ar: 'أهلاً وسهلاً في {name}! 🏨\nنتشرف باستضافتك. كيف نخدمك؟',
    en: 'Welcome to {name}! 🏨\nWe are honored to host you. How may we serve you?',
  },
  retail: {
    ar: 'أهلاً بك في {name}! 🛍️\nكيف نقدر نساعدك اليوم؟',
    en: 'Welcome to {name}! 🛍️\nWhat are you looking for today?',
  },
  salon: {
    ar: 'أهلاً وسهلاً في {name}! 💇\nجمالك يهمنا. كيف نقدر نخدمك؟',
    en: 'Welcome to {name}! 💇\nYour beauty matters. How can we pamper you?',
  },
  education: {
    ar: 'أهلاً بك في {name}! 🎓\nمستقبلك يبدأ هنا. كيف نقدر نساعدك؟',
    en: 'Welcome to {name}! 🎓\nYour future starts here. How can we help?',
  },
};

var SECTOR_PRESETS = {
  restaurant: {
    ar: [
      { label: '🍽️ عرض القائمة', action: 'show_categories' },
      { label: '⭐ الأطباق المميزة', action: 'show_popular' },
      { label: '🛵 طلب توصيل', action: 'ai', message: 'أبي أطلب توصيل' },
      { label: '💰 الأسعار', action: 'show_all_prices' },
    ],
    en: [
      { label: '🍽️ View Menu', action: 'show_categories' },
      { label: '⭐ Popular Items', action: 'show_popular' },
      { label: '🛵 Delivery Order', action: 'ai', message: 'I want to place a delivery order' },
      { label: '💰 Prices', action: 'show_all_prices' },
    ],
  },
  medical: {
    ar: [
      { label: '📅 حجز موعد', action: 'ai', message: 'أبي أحجز موعد' },
      { label: '🏥 خدماتنا', action: 'show_categories' },
      { label: '💰 أسعار الخدمات', action: 'show_all_prices' },
      { label: '⏰ أوقات العمل', action: 'ai', message: 'ما هي أوقات العمل؟' },
    ],
    en: [
      { label: '📅 Book Appointment', action: 'ai', message: 'I want to book an appointment' },
      { label: '🏥 Our Services', action: 'show_categories' },
      { label: '💰 Service Prices', action: 'show_all_prices' },
      { label: '⏰ Working Hours', action: 'ai', message: 'What are your working hours?' },
    ],
  },
  hotel: {
    ar: [
      { label: '🛏️ حجز غرفة', action: 'show_category', category: 'rooms' },
      { label: '💆 السبا', action: 'show_category', category: 'spa' },
      { label: '🍽️ المطعم', action: 'show_category', category: 'dining' },
      { label: '💰 الأسعار', action: 'show_all_prices' },
    ],
    en: [
      { label: '🛏️ Book Room', action: 'show_category', category: 'rooms' },
      { label: '💆 Spa & Wellness', action: 'show_category', category: 'spa' },
      { label: '🍽️ Restaurant', action: 'show_category', category: 'dining' },
      { label: '💰 All Rates', action: 'show_all_prices' },
    ],
  },
  retail: {
    ar: [
      { label: '📱 إلكترونيات', action: 'show_category', category: 'electronics' },
      { label: '🎮 ألعاب', action: 'show_category', category: 'gaming' },
      { label: '📚 كتب', action: 'show_category', category: 'books' },
      { label: '💰 العروض', action: 'show_all_prices' },
    ],
    en: [
      { label: '📱 Electronics', action: 'show_category', category: 'electronics' },
      { label: '🎮 Gaming', action: 'show_category', category: 'gaming' },
      { label: '📚 Books & Office', action: 'show_category', category: 'books' },
      { label: '💰 Deals', action: 'show_all_prices' },
    ],
  },
  salon: {
    ar: [
      { label: '💇‍♀️ الشعر', action: 'show_category', category: 'hair' },
      { label: '💆‍♀️ البشرة', action: 'show_category', category: 'skin' },
      { label: '💅 الأظافر', action: 'show_category', category: 'nails' },
      { label: '💰 الأسعار', action: 'show_all_prices' },
    ],
    en: [
      { label: '💇‍♀️ Hair Services', action: 'show_category', category: 'hair' },
      { label: '💆‍♀️ Skincare', action: 'show_category', category: 'skin' },
      { label: '💅 Nails', action: 'show_category', category: 'nails' },
      { label: '💰 All Prices', action: 'show_all_prices' },
    ],
  },
  education: {
    ar: [
      { label: '🗣️ دورات لغات', action: 'show_category', category: 'languages' },
      { label: '💻 برامج تقنية', action: 'show_category', category: 'technology' },
      { label: '👶 برامج أطفال', action: 'show_category', category: 'kids' },
      { label: '💰 الرسوم', action: 'show_all_prices' },
    ],
    en: [
      { label: '🗣️ Language Courses', action: 'show_category', category: 'languages' },
      { label: '💻 Tech Programs', action: 'show_category', category: 'technology' },
      { label: '👶 Kids Programs', action: 'show_category', category: 'kids' },
      { label: '💰 Fees', action: 'show_all_prices' },
    ],
  },
};

var CAT_ICONS = {
  chicken: '🍗', seafood: '🦐', sides: '🍟', drinks: '🥤', family: '👨‍👩‍👧‍👦',
  meals: '🍽️', desserts: '🍰', rooms: '🛏️', spa: '💆', dining: '🍽️',
  services: '🏥', hair: '💇', skin: '💆‍♀️', nails: '💅', makeup: '💄',
  electronics: '📱', gaming: '🎮', books: '📚', office: '✏️',
  languages: '🗣️', technology: '💻', kids: '👶', professional: '👔',
  consultations: '👨‍⚕️', dental: '🦷', lab: '🔬', imaging: '📷',
  wellness: '🧘', suite: '🏨', deluxe: '✨', standard: '🛏️',
};

function getCatIcon(cat) {
  var lower = (cat || '').toLowerCase();
  var icon = '📂';
  Object.keys(CAT_ICONS).forEach(function(k) {
    if (lower.indexOf(k) >= 0) icon = CAT_ICONS[k];
  });
  return icon;
}

export default function AgentsPage() {
  var appContext = useApp();
  var business = appContext.activeBusiness;
  var stateMessages = useState([]);
  var messages = stateMessages[0];
  var setMessages = stateMessages[1];
  var stateInput = useState('');
  var input = stateInput[0];
  var setInput = stateInput[1];
  var stateLoading = useState(false);
  var loading = stateLoading[0];
  var setLoading = stateLoading[1];
  var stateButtons = useState([]);
  var buttons = stateButtons[0];
  var setButtons = stateButtons[1];
  var stateProducts = useState([]);
  var products = stateProducts[0];
  var setProducts = stateProducts[1];
  var stateLang = useState(null);
  var lang = stateLang[0];
  var setLang = stateLang[1];
  var stateName = useState(null);
  var customerName = stateName[0];
  var setCustomerName = stateName[1];
  var chatEndRef = useRef(null);
  var inputRef = useRef(null);

  // Reset on business change
  useEffect(function() {
    setMessages([]);
    setButtons([]);
    setInput('');
    setProducts([]);
    setLang(null);
    setCustomerName(null);

    if (business && business.id) {
      // Load products for THIS business
      api.get('/products/available?business_id=' + business.id).then(function(res) {
        if (res.data) {
          setProducts(res.data);
        }
      }).catch(function() {});

      // Step 1: Language selection
      showLanguageChoice();
    }
  }, [business ? business.id : null]);

  useEffect(function() {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  var addBot = function(text, agent, intent) {
    setMessages(function(prev) {
      return prev.concat([{ role: 'assistant', content: text, timestamp: new Date().toISOString(), agent: agent || 'RaseelAI', intent: intent }]);
    });
  };

  var addUser = function(text) {
    setMessages(function(prev) {
      return prev.concat([{ role: 'user', content: text, timestamp: new Date().toISOString() }]);
    });
  };

  // STEP 1: Language selection
  var showLanguageChoice = function() {
    var name = (business && business.displayName) || 'Business';
    addBot('Welcome to ' + name + '!\nمرحباً بك في ' + name + '!\n\nPlease choose your language / اختر لغتك:');
    setButtons([
      { label: '🇸🇦 العربية', action: 'set_language', value: 'ar' },
      { label: '🇬🇧 English', action: 'set_language', value: 'en' },
    ]);
  };

  // STEP 2: Ask for name
  var showNameRequest = function(selectedLang) {
    if (selectedLang === 'ar') {
      addBot('تشرفنا! ممكن نعرف اسمك الكريم؟ 😊');
    } else {
      addBot('Great! May I have your name please? 😊');
    }
    setButtons([
      { label: 'Skip / تخطي', action: 'skip_name' },
    ]);
  };

  // STEP 3: Show main menu
  var showMainMenu = function(currentLang) {
    var useLang = currentLang || lang || 'en';
    var sector = (business && business.sector) || 'restaurant';
    var name = (business && business.displayName) || 'Business';
    var greetings = SECTOR_GREETINGS[sector] || SECTOR_GREETINGS.restaurant;
    var greeting = (useLang === 'ar' ? greetings.ar : greetings.en).replace('{name}', name);

    if (customerName) {
      if (useLang === 'ar') {
        greeting = 'أهلاً ' + customerName + '! 😊\n' + greeting;
      } else {
        greeting = 'Hi ' + customerName + '! 😊\n' + greeting;
      }
    }

    addBot(greeting);

    var presets = SECTOR_PRESETS[sector] || SECTOR_PRESETS.restaurant;
    var langPresets = useLang === 'ar' ? presets.ar : presets.en;
    setButtons(langPresets.concat([
      { label: useLang === 'ar' ? '👨‍💼 تكلم مع موظف' : '👨‍💼 Talk to Human', action: 'ai', message: useLang === 'ar' ? 'أبي أكلم شخص' : 'I want to talk to a real person' },
    ]));
  };

  // Get categories from loaded products
  var getCategories = function() {
    var cats = {};
    products.forEach(function(p) {
      var cat = p.category || 'general';
      if (!cats[cat]) cats[cat] = 0;
      cats[cat] = cats[cat] + 1;
    });
    return Object.keys(cats);
  };

  var getProductsByCategory = function(category) {
    var catLower = category.toLowerCase();
    return products.filter(function(p) {
      var pCat = (p.category || '').toLowerCase();
      return pCat.indexOf(catLower) >= 0 || catLower.indexOf(pCat) >= 0;
    });
  };

  var formatPrice = function(price) {
    return (Math.round(price * 1.15 * 100) / 100).toFixed(2) + ' SAR';
  };

  // Handle button clicks
  var handleButton = function(btn) {
    addUser(btn.label);
    setButtons([]);

    // Language selection
    if (btn.action === 'set_language') {
      setLang(btn.value);
      showNameRequest(btn.value);
      return;
    }

    // Skip name
    if (btn.action === 'skip_name') {
      showMainMenu(lang);
      return;
    }

    // Show categories from REAL products
    if (btn.action === 'show_categories') {
      var cats = getCategories();
      if (cats.length === 0) {
        addBot(lang === 'ar' ? 'جاري التحميل...' : 'Loading catalog...');
        callAI(lang === 'ar' ? 'اعرض الخدمات' : 'Show me what you have');
        return;
      }
      addBot(lang === 'ar' ? 'اختر القسم:' : 'Choose a category:');
      var catBtns = cats.map(function(cat) {
        var icon = getCatIcon(cat);
        var count = getProductsByCategory(cat).length;
        return { label: icon + ' ' + cat + ' (' + count + ')', action: 'show_category', category: cat };
      });
      catBtns.push({ label: lang === 'ar' ? '⬅️ رجوع' : '⬅️ Back', action: 'back_to_main' });
      setButtons(catBtns);
      return;
    }

    // Show products in category
    if (btn.action === 'show_category') {
      var catProds = getProductsByCategory(btn.category);
      if (catProds.length === 0) {
        catProds = products.filter(function(p) {
          return (p.category || '').toLowerCase().indexOf(btn.category.toLowerCase().slice(0, 3)) >= 0;
        });
      }
      if (catProds.length === 0) {
        addBot(lang === 'ar' ? 'ما لقيت منتجات. خلني أساعدك...' : 'No items found. Let me help...');
        callAI('Show me ' + btn.category + ' services');
        return;
      }

      var list = '';
      catProds.forEach(function(p) {
        var nameShow = lang === 'ar' ? (p.name_ar || p.name_en || '') : (p.name_en || p.name_ar || '');
        var price = formatPrice(p.price || 0);
        list = list + '• ' + nameShow + '\n  💰 ' + price + '\n';
        var desc = lang === 'ar' ? (p.description_ar || '') : (p.description_en || '');
        if (desc) list = list + '  ' + desc + '\n';
        list = list + '\n';
      });

      var headerText = lang === 'ar' ? ('قسم ' + btn.category + ':\n\n') : (btn.category + ' items:\n\n');
      addBot(headerText + list, 'RaseelAI', 'catalog_browse');

      var prodBtns = catProds.slice(0, 4).map(function(p) {
        var shortName = (p.name_en || p.name_ar || '').split(' ').slice(0, 3).join(' ');
        return { label: '🛒 ' + shortName, action: 'order_item', product: p };
      });
      prodBtns.push({ label: lang === 'ar' ? '📋 أقسام أخرى' : '📋 More Categories', action: 'show_categories' });
      prodBtns.push({ label: lang === 'ar' ? '⬅️ رجوع' : '⬅️ Back', action: 'back_to_main' });
      setButtons(prodBtns);
      return;
    }

    // Popular items
    if (btn.action === 'show_popular') {
      var top = products.slice(0, 5);
      var popList = lang === 'ar' ? 'الأكثر طلباً:\n\n' : 'Most popular:\n\n';
      top.forEach(function(p, i) {
        var nameShow = lang === 'ar' ? (p.name_ar || p.name_en || '') : (p.name_en || '');
        popList = popList + (i + 1) + '. ' + nameShow + ' - ' + formatPrice(p.price || 0) + '\n';
      });
      addBot(popList, 'RaseelAI', 'catalog_browse');
      var popBtns = top.slice(0, 3).map(function(p) {
        return { label: '🛒 ' + (p.name_en || '').split(' ').slice(0, 3).join(' '), action: 'order_item', product: p };
      });
      popBtns.push({ label: lang === 'ar' ? '📋 القائمة الكاملة' : '📋 Full Menu', action: 'show_categories' });
      popBtns.push({ label: lang === 'ar' ? '⬅️ رجوع' : '⬅️ Back', action: 'back_to_main' });
      setButtons(popBtns);
      return;
    }

    // All prices
    if (btn.action === 'show_all_prices') {
      var grouped = {};
      products.forEach(function(p) {
        var cat = p.category || 'general';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
      });
      var priceText = lang === 'ar' ? 'الأسعار (شامل 15% ضريبة):\n\n' : 'All prices (include 15% VAT):\n\n';
      Object.keys(grouped).forEach(function(cat) {
        priceText = priceText + getCatIcon(cat) + ' ' + cat.toUpperCase() + '\n';
        grouped[cat].forEach(function(p) {
          var nameShow = lang === 'ar' ? (p.name_ar || p.name_en || '') : (p.name_en || '');
          priceText = priceText + '  • ' + nameShow + ': ' + formatPrice(p.price || 0) + '\n';
        });
        priceText = priceText + '\n';
      });
      addBot(priceText, 'RaseelAI', 'pricing');
      setButtons([
        { label: lang === 'ar' ? '🛒 أطلب الآن' : '🛒 Order Now', action: 'ai', message: lang === 'ar' ? 'أبي أطلب' : 'I want to order' },
        { label: lang === 'ar' ? '📋 الأقسام' : '📋 Categories', action: 'show_categories' },
        { label: lang === 'ar' ? '⬅️ رجوع' : '⬅️ Back', action: 'back_to_main' },
      ]);
      return;
    }

    // Order item
    if (btn.action === 'order_item' && btn.product) {
      var pr = btn.product;
      var nameShow = lang === 'ar' ? (pr.name_ar || pr.name_en || '') : (pr.name_en || pr.name_ar || '');
      var orderText = lang === 'ar' ? 'اخترت:\n\n' : 'You selected:\n\n';
      orderText = orderText + '🛒 ' + nameShow + '\n💰 ' + formatPrice(pr.price || 0) + '\n\n';
      orderText = orderText + (lang === 'ar' ? 'كم تبي؟' : 'How many?');
      addBot(orderText, 'RaseelAI', 'ordering');
      setButtons([
        { label: '1️⃣', action: 'confirm_order', product: pr, qty: 1 },
        { label: '2️⃣', action: 'confirm_order', product: pr, qty: 2 },
        { label: '3️⃣', action: 'confirm_order', product: pr, qty: 3 },
        { label: '5️⃣', action: 'confirm_order', product: pr, qty: 5 },
        { label: lang === 'ar' ? '⬅️ رجوع' : '⬅️ Back', action: 'back_to_main' },
      ]);
      return;
    }

    // Confirm order
    if (btn.action === 'confirm_order') {
      var prd = btn.product;
      var qty = btn.qty || 1;
      var total = formatPrice((prd.price || 0) * qty);
      var nameS = lang === 'ar' ? (prd.name_ar || prd.name_en || '') : (prd.name_en || '');
      var summary = lang === 'ar' ? 'ملخص الطلب:\n\n' : 'Order Summary:\n\n';
      summary = summary + '📦 ' + nameS + ' x' + qty + '\n💰 ' + (lang === 'ar' ? 'الإجمالي: ' : 'Total: ') + total + '\n\n';
      summary = summary + (lang === 'ar' ? 'تأكيد الطلب؟' : 'Confirm order?');
      addBot(summary, 'RaseelAI', 'ordering');
      setButtons([
        { label: lang === 'ar' ? '✅ تأكيد' : '✅ Confirm', action: 'ai', message: (lang === 'ar' ? 'أكد طلبي: ' : 'Confirm my order: ') + qty + 'x ' + nameS + ' ' + total },
        { label: lang === 'ar' ? '➕ أضف المزيد' : '➕ Add More', action: 'show_categories' },
        { label: lang === 'ar' ? '❌ إلغاء' : '❌ Cancel', action: 'back_to_main' },
      ]);
      return;
    }

    // Back to main
    if (btn.action === 'back_to_main') {
      showMainMenu(lang);
      return;
    }

    // AI call
    if (btn.action === 'ai') {
      callAI(btn.message || btn.label);
      return;
    }
  };

  // Call AI
  var callAI = async function(messageText) {
    setLoading(true);
    try {
      var response = await api.post('/conversations/process', {
        business_id: business.id,
        customer_phone: '+966501234567',
        message_text: messageText,
        message_language: lang || 'en',
      });
      var data = response.data;
      addBot(data.response_text, data.agent_name, data.detected_intent);

      // Follow-up buttons
      var fb = [];
      var sector = (business && business.sector) || 'restaurant';
      if (data.detected_intent === 'ordering') {
        fb.push({ label: lang === 'ar' ? '✅ تأكيد' : '✅ Confirm', action: 'ai', message: lang === 'ar' ? 'نعم أكد' : 'Yes confirm' });
        fb.push({ label: lang === 'ar' ? '📋 القائمة' : '📋 Menu', action: 'show_categories' });
      } else {
        fb.push({ label: lang === 'ar' ? '📋 خدماتنا' : '📋 Our Services', action: 'show_categories' });
        fb.push({ label: lang === 'ar' ? '💰 الأسعار' : '💰 Prices', action: 'show_all_prices' });
      }
      fb.push({ label: lang === 'ar' ? '🏠 القائمة الرئيسية' : '🏠 Main Menu', action: 'back_to_main' });
      setButtons(fb);
    } catch (err) {
      addBot(lang === 'ar' ? 'عذراً، حدث خطأ. حاول مرة أخرى.' : 'Sorry, something went wrong.', 'System');
      setButtons([{ label: '🏠 Main Menu', action: 'back_to_main' }]);
    }
    setLoading(false);
  };

  // Handle typed message
  var sendMessage = async function(text) {
    var msg = text || input.trim();
    if (!msg || !business || loading) return;

    // If no language set yet, detect
    if (!lang) {
      var arabicCount = (msg.match(/[\u0600-\u06FF]/g) || []).length;
      setLang(arabicCount > msg.length * 0.3 ? 'ar' : 'en');
    }

    // If no name yet, save what they type as name
    if (!customerName && lang && messages.length >= 2) {
      var lastBot = '';
      for (var i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') { lastBot = messages[i].content; break; }
      }
      if (lastBot.indexOf('name') >= 0 || lastBot.indexOf('اسمك') >= 0) {
        var cleanName = msg.trim().replace(/[.!?,؟]/g, '');
        if (cleanName.length >= 2 && cleanName.length <= 30) {
          setCustomerName(cleanName);
          addUser(msg);
          setInput('');
          setButtons([]);
          showMainMenu(lang);
          return;
        }
      }
    }

    addUser(msg);
    setInput('');
    setButtons([]);
    callAI(msg);
  };

  var handleKeyPress = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  var clearChat = function() {
    setMessages([]);
    setButtons([]);
    setLang(null);
    setCustomerName(null);
    if (business) showLanguageChoice();
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <Bot size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Select a business from the header</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Bot size={22} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {(business.emoji || '') + ' ' + (business.displayName || '') + ' AI'}
            </h1>
            <p className="text-xs text-gray-500">
              {(business.sector || '') + ' • ' + (business.city || 'SA') + ' • Raseel AI'}
            </p>
          </div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-3 px-1">
        {messages.map(function(msg, i) {
          var isUser = msg.role === 'user';
          return (
            <div key={i} className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
              <div className="max-w-[85%]">
                <div className={'flex items-center gap-1.5 mb-1 ' + (isUser ? 'justify-end' : '')}>
                  {!isUser && <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center"><Sparkles size={12} className="text-indigo-600" /></div>}
                  <span className="text-xs text-gray-400">{isUser ? (customerName || 'You') : (msg.agent || 'RaseelAI')}</span>
                  {isUser && <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center"><User size={12} className="text-blue-600" /></div>}
                </div>
                <div className={'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + (isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md')}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {buttons.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 py-2 px-1 border-t border-gray-100">
          {buttons.map(function(btn, i) {
            var isBack = btn.action === 'back_to_main';
            var isConfirm = (btn.label || '').indexOf('Confirm') >= 0 || (btn.label || '').indexOf('تأكيد') >= 0;
            var isOrder = (btn.label || '').indexOf('Order') >= 0 || (btn.label || '').indexOf('🛒') >= 0;
            var cls = 'px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ';
            if (isConfirm) {
              cls = cls + 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600';
            } else if (isOrder) {
              cls = cls + 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600';
            } else if (isBack) {
              cls = cls + 'bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-200';
            } else {
              cls = cls + 'bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 border border-gray-200';
            }
            return (<button key={i} onClick={function() { handleButton(btn); }} className={cls}>{btn.label}</button>);
          })}
        </div>
      )}

      <div className="border-t pt-3">
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={input}
            onChange={function(e) { setInput(e.target.value); }}
            onKeyDown={handleKeyPress}
            placeholder={lang === 'ar' ? '... أو اكتب سؤالك هنا' : 'Or type your question...'}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
            disabled={loading} dir="auto" />
          <button onClick={function() { sendMessage(); }}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
