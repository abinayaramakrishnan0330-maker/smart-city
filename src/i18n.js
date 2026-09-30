/* ═══════════════════════════════════════════════════════
   Smart City – Internationalization (i18n)
   ═══════════════════════════════════════════════════════ */

import store from './store.js';

const translations = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.services': 'Smart Services',
    'nav.report': 'Report Issue',
    'nav.community': 'Community',
    'nav.dashboard': 'Dashboard',
    'nav.map': 'Map',
    'nav.ai': 'CivicAI',
    'nav.about': 'About',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.reportBtn': 'Report an Issue',

    // Hero
    'hero.title': 'Smart City, Better Civic Life',
    'hero.subtitle': 'Connecting citizens, technology, and city services for a cleaner, safer, and smarter tomorrow.',
    'hero.cta1': 'Report a Civic Issue',
    'hero.cta2': 'Explore Smart Services',
    'hero.healthScore': 'City Health Score',
    'hero.connecting': 'Connecting to city sensors…',

    // Stats
    'stats.support': 'Citizen Support',
    'stats.resolved': 'Issues Resolved',
    'stats.services': 'Smart Services',
    'stats.updates': 'Real-Time Updates',

    // Services
    'services.title': 'Smart Services',
    'services.subtitle': 'Everything the city offers, in one place. Search or filter by topic.',
    'services.search': 'Search services (e.g. garbage, hospital, tax)',
    'services.noMatch': 'No services match. Try a different word or choose All.',

    // Report
    'report.title': 'Report a Civic Issue',
    'report.subtitle': 'Tell us what needs fixing. You\'ll get a complaint ID to track progress.',
    'report.name': 'Citizen name',
    'report.contact': 'Email or mobile number',
    'report.category': 'Issue category',
    'report.chooseCat': 'Choose a category',
    'report.desc': 'Description',
    'report.location': 'Location',
    'report.selectLoc': 'Select ward / zone',
    'report.upload': 'Upload image',
    'report.submit': 'Submit complaint',
    'report.success': 'Your complaint has been successfully registered.',
    'report.complaintId': 'Complaint ID',
    'report.track': 'Track a complaint',
    'report.trackHint': 'Try the sample ID CL-1042 or the one you just created.',
    'report.enterId': 'Enter complaint ID',
    'report.trackBtn': 'Track',
    'report.notFound': 'No complaint found. Check the ID and try again.',
    'report.errName': 'Enter your full name.',
    'report.errContact': 'Enter a valid email or 10-digit mobile number.',
    'report.errCat': 'Choose a category.',
    'report.errDesc': 'Describe the issue in at least 10 characters.',
    'report.errLoc': 'Select a location.',

    // Steps
    'step.submitted': 'Submitted',
    'step.assigned': 'Assigned',
    'step.inProgress': 'In Progress',
    'step.resolved': 'Resolved',

    // Community
    'community.title': 'Community Hub',
    'community.subtitle': 'Back the issues your neighbours reported, earn Civic Points, and watch smart bins fill in real time.',
    'community.nearYou': 'Issues near you',
    'community.points': 'Your Civic Points',
    'community.pointsInfo': 'Report +50 · Upvote +5 · Verified fix +20',
    'community.smartBins': 'Smart bins (live IoT)',
    'community.dispatched': 'truck dispatched 🚛',

    // Dashboard
    'dash.title': 'City Dashboard',
    'dash.subtitle': 'Live-style operational view. Figures update every few seconds in this demo.',
    'dash.total': 'Total complaints',
    'dash.resolved': 'Resolved',
    'dash.pending': 'Pending',
    'dash.emergency': 'Emergency alerts',
    'dash.byMonth': 'Complaints by month',
    'dash.reported': 'Reported',
    'dash.cityStatus': 'City status',
    'dash.resRate': 'Resolution rate',

    // Map
    'map.title': 'Smart City Map',
    'map.subtitle': 'Tap a marker for details. Sample data, ready to swap for a live maps API.',
    'map.selectMarker': 'Select a marker to see details.',
    'map.notifications': 'Notifications',
    'map.traffic': '🚦 Live traffic',
    'map.air': '🌫️ Air quality',

    // AI
    'ai.title': 'CivicAI Assistant',
    'ai.subtitle': 'Ask about services, facilities, schedules, and payments.',
    'ai.greeting': 'Hi, I\'m CivicAI. How can I help you today?',
    'ai.placeholder': 'Type your question',
    'ai.send': 'Send',

    // About
    'about.title': 'About the Project',
    'about.subtitle': 'Smart City – Civic Life uses AI, IoT, data analytics, and digital services to make cities more efficient, sustainable, accessible, and citizen-friendly.',

    // Profile
    'profile.title': 'My Profile',
    'profile.complaints': 'My Complaints',
    'profile.badges': 'Badges',
    'profile.logout': 'Logout',
    'profile.loginTitle': 'Citizen Login',
    'profile.loginSubtitle': 'Sign in to track your complaints and earn civic points.',
    'profile.loginBtn': 'Sign In',
    'profile.registerBtn': 'Register',
    'profile.nameField': 'Full Name',
    'profile.emailField': 'Email',
    'profile.passwordField': 'Password',
    'profile.guest': 'Continue as Guest',

    // Footer
    'footer.tagline': 'One digital platform for citizens and city administration.',
    'footer.quickLinks': 'Quick Links',
    'footer.emergency': 'Emergency Contacts',
    'footer.citizenSvcs': 'Citizen Services',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // General
    'all': 'All',
    'close': 'Close',
    'loading': 'Loading...',
    'sos': 'SOS',
    'copilot': 'Civic Copilot',
    'copilot.greeting': 'Hi, I\'m Civic Copilot 🤖. Describe an issue, ask about a feature, or track a complaint.',
    'copilot.desc': 'Understands your complaint, checks status, guides you around the app, and starts the report workflow.',

    // Weather
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.feelsLike': 'Feels like',

    // Categories
    'cat.Pothole': 'Pothole',
    'cat.Garbage': 'Garbage',
    'cat.Broken streetlight': 'Broken streetlight',
    'cat.Water leakage': 'Water leakage',
    'cat.Damaged road': 'Damaged road',
    'cat.Other': 'Other',

    // Zones
    'zone.1': 'Zone 1 – Central',
    'zone.2': 'Zone 2 – Riverside',
    'zone.3': 'Zone 3 – Tech Park',
    'zone.4': 'Zone 4 – Old Town',

    // Badges
    'badge.reporter': '🌱 Reporter',
    'badge.guardian': '🛡️ Street Guardian',
    'badge.hero': '🏙️ City Hero',

    // Toast
    'toast.success': 'Success',
    'toast.error': 'Error',
    'toast.warning': 'Warning',
    'toast.info': 'Info',
  },

  hi: {
    'nav.home': 'होम',
    'nav.services': 'स्मार्ट सेवाएं',
    'nav.report': 'शिकायत दर्ज करें',
    'nav.community': 'समुदाय',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.map': 'नक्शा',
    'nav.ai': 'सिविकAI',
    'nav.about': 'जानकारी',
    'nav.profile': 'प्रोफाइल',
    'nav.login': 'लॉगिन',
    'nav.reportBtn': 'शिकायत दर्ज करें',

    'hero.title': 'स्मार्ट सिटी, बेहतर नागरिक जीवन',
    'hero.subtitle': 'नागरिकों, तकनीक और शहरी सेवाओं को जोड़कर एक स्वच्छ, सुरक्षित और स्मार्ट कल बनाना।',
    'hero.cta1': 'नागरिक शिकायत दर्ज करें',
    'hero.cta2': 'स्मार्ट सेवाएं देखें',
    'hero.healthScore': 'शहर स्वास्थ्य स्कोर',
    'hero.connecting': 'शहर सेंसर से कनेक्ट हो रहा है…',

    'stats.support': 'नागरिक सहायता',
    'stats.resolved': 'समस्याएं हल',
    'stats.services': 'स्मार्ट सेवाएं',
    'stats.updates': 'लाइव अपडेट',

    'services.title': 'स्मार्ट सेवाएं',
    'services.subtitle': 'शहर की सभी सुविधाएं एक जगह। विषय के अनुसार खोजें या फ़िल्टर करें।',
    'services.search': 'सेवाएं खोजें (जैसे कचरा, अस्पताल, कर)',
    'services.noMatch': 'कोई सेवा नहीं मिली। कोई और शब्द आज़माएं।',

    'report.title': 'नागरिक शिकायत दर्ज करें',
    'report.subtitle': 'हमें बताएं क्या ठीक करना है। आपको ट्रैक करने के लिए शिकायत ID मिलेगी।',
    'report.name': 'नागरिक का नाम',
    'report.contact': 'ईमेल या मोबाइल नंबर',
    'report.category': 'शिकायत श्रेणी',
    'report.chooseCat': 'श्रेणी चुनें',
    'report.desc': 'विवरण',
    'report.location': 'स्थान',
    'report.selectLoc': 'वार्ड / ज़ोन चुनें',
    'report.upload': 'फोटो अपलोड करें',
    'report.submit': 'शिकायत दर्ज करें',
    'report.success': 'आपकी शिकायत सफलतापूर्वक दर्ज हो गई है।',
    'report.complaintId': 'शिकायत ID',
    'report.track': 'शिकायत ट्रैक करें',
    'report.trackHint': 'नमूना ID CL-1042 या अपनी बनाई ID आज़माएं।',
    'report.enterId': 'शिकायत ID दर्ज करें',
    'report.trackBtn': 'ट्रैक',
    'report.notFound': 'कोई शिकायत नहीं मिली। ID जाँचें और पुनः प्रयास करें।',
    'report.errName': 'अपना पूरा नाम दर्ज करें।',
    'report.errContact': 'वैध ईमेल या 10-अंकीय मोबाइल नंबर दर्ज करें।',
    'report.errCat': 'श्रेणी चुनें।',
    'report.errDesc': 'कम से कम 10 अक्षरों में समस्या बताएं।',
    'report.errLoc': 'स्थान चुनें।',

    'step.submitted': 'दर्ज',
    'step.assigned': 'सौंपी गई',
    'step.inProgress': 'प्रगति में',
    'step.resolved': 'हल',

    'community.title': 'सामुदायिक केंद्र',
    'community.subtitle': 'पड़ोसियों की शिकायतों का समर्थन करें, सिविक पॉइंट अर्जित करें।',
    'community.nearYou': 'आपके पास की समस्याएं',
    'community.points': 'आपके सिविक पॉइंट',
    'community.pointsInfo': 'शिकायत +50 · अपवोट +5 · सत्यापित सुधार +20',
    'community.smartBins': 'स्मार्ट डस्टबिन (लाइव IoT)',
    'community.dispatched': 'ट्रक भेजा गया 🚛',

    'dash.title': 'शहर डैशबोर्ड',
    'dash.subtitle': 'लाइव परिचालन दृश्य। यह डेमो में आंकड़े हर कुछ सेकंड अपडेट होते हैं।',
    'dash.total': 'कुल शिकायतें',
    'dash.resolved': 'हल',
    'dash.pending': 'लंबित',
    'dash.emergency': 'आपातकालीन अलर्ट',

    'map.title': 'स्मार्ट सिटी नक्शा',
    'map.subtitle': 'विवरण के लिए मार्कर पर टैप करें।',
    'map.selectMarker': 'विवरण देखने के लिए मार्कर चुनें।',
    'map.notifications': 'सूचनाएं',

    'ai.title': 'सिविकAI सहायक',
    'ai.subtitle': 'सेवाओं, सुविधाओं, शेड्यूल और भुगतान के बारे में पूछें।',
    'ai.greeting': 'नमस्ते, मैं सिविकAI हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    'ai.placeholder': 'अपना सवाल लिखें',
    'ai.send': 'भेजें',

    'about.title': 'परियोजना के बारे में',
    'about.subtitle': 'स्मार्ट सिटी – सिविक लाइफ शहरों को अधिक कुशल, टिकाऊ और नागरिक-अनुकूल बनाने के लिए AI, IoT, डेटा एनालिटिक्स और डिजिटल सेवाओं का उपयोग करती है।',

    'profile.title': 'मेरी प्रोफाइल',
    'profile.complaints': 'मेरी शिकायतें',
    'profile.badges': 'बैज',
    'profile.logout': 'लॉग आउट',
    'profile.loginTitle': 'नागरिक लॉगिन',
    'profile.loginSubtitle': 'अपनी शिकायतें ट्रैक करने और सिविक पॉइंट अर्जित करने के लिए साइन इन करें।',
    'profile.loginBtn': 'साइन इन',
    'profile.nameField': 'पूरा नाम',
    'profile.emailField': 'ईमेल',
    'profile.passwordField': 'पासवर्ड',
    'profile.guest': 'अतिथि के रूप में जारी रखें',

    'footer.tagline': 'नागरिकों और शहर प्रशासन के लिए एक डिजिटल प्लेटफॉर्म।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.emergency': 'आपातकालीन संपर्क',
    'footer.citizenSvcs': 'नागरिक सेवाएं',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',

    'all': 'सभी',
    'close': 'बंद करें',
    'loading': 'लोड हो रहा है...',
    'sos': 'SOS',
    'copilot': 'सिविक कोपायलट',
    'copilot.greeting': 'नमस्ते, मैं सिविक कोपायलट 🤖 हूँ। किसी समस्या का वर्णन करें या शिकायत ट्रैक करें।',

    'weather.humidity': 'नमी',
    'weather.wind': 'हवा',
    'weather.feelsLike': 'महसूस',

    'cat.Pothole': 'गड्ढा',
    'cat.Garbage': 'कचरा',
    'cat.Broken streetlight': 'टूटी स्ट्रीटलाइट',
    'cat.Water leakage': 'पानी का रिसाव',
    'cat.Damaged road': 'क्षतिग्रस्त सड़क',
    'cat.Other': 'अन्य',

    'badge.reporter': '🌱 रिपोर्टर',
    'badge.guardian': '🛡️ स्ट्रीट गार्डियन',
    'badge.hero': '🏙️ सिटी हीरो',

    'toast.success': 'सफल',
    'toast.error': 'त्रुटि',
    'toast.warning': 'चेतावनी',
    'toast.info': 'सूचना',
  },

  ta: {
    'nav.home': 'முகப்பு',
    'nav.services': 'சேவைகள்',
    'nav.report': 'புகார் அளிக்க',
    'nav.community': 'சமூகம்',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.map': 'வரைபடம்',
    'nav.ai': 'சிவிக்AI',
    'nav.about': 'பற்றி',
    'nav.profile': 'சுயவிவரம்',
    'nav.login': 'உள்நுழைய',
    'nav.reportBtn': 'புகார் அளிக்க',

    'hero.title': 'ஸ்மார்ட் சிட்டி, சிறந்த குடிமை வாழ்வு',
    'hero.subtitle': 'குடிமக்கள், தொழில்நுட்பம் மற்றும் நகர சேவைகளை இணைத்து சுத்தமான, பாதுகாப்பான நாளை.',
    'hero.cta1': 'குடிமை புகார் அளிக்க',
    'hero.cta2': 'சேவைகளை ஆராயுங்கள்',
    'hero.healthScore': 'நகர ஆரோக்கிய மதிப்பெண்',

    'services.title': 'ஸ்மார்ட் சேவைகள்',
    'report.title': 'குடிமை புகார் அளிக்க',
    'community.title': 'சமூக மையம்',
    'dash.title': 'நகர டாஷ்போர்டு',
    'map.title': 'ஸ்மார்ட் சிட்டி வரைபடம்',
    'ai.title': 'சிவிக்AI உதவியாளர்',
    'about.title': 'திட்டத்தைப் பற்றி',
    'profile.title': 'என் சுயவிவரம்',

    'all': 'அனைத்தும்',
    'close': 'மூடு',
    'sos': 'SOS',
    'copilot': 'சிவிக் கோபைலட்',

    'toast.success': 'வெற்றி',
    'toast.error': 'பிழை',
    'toast.warning': 'எச்சரிக்கை',
    'toast.info': 'தகவல்',
  }
};

/**
 * Get a translated string.
 * Falls back to English, then to the key itself.
 */
export function t(key) {
  const lang = store.lang;
  return translations[lang]?.[key]
    || translations.en[key]
    || key;
}

/**
 * Get current language code.
 */
export function currentLang() {
  return store.lang;
}

/**
 * Get all supported languages.
 */
export function supportedLangs() {
  return [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'ta', label: 'த' }
  ];
}

export default t;
