import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Aranya AI",
      cattleCare: "Cattle Care",
      description: "Smart Cattle Health Monitoring System",
      selectLanguage: "Select Language",
      login: "Login",
      back: "Back",
      signinMessage: "Sign in to continue",
      emailPlaceholder: "Email / Contact Number",
      passwordPlaceholder: "Password",
      fullNamePlaceholder: "Full Name",
      resetPassword: "Reset Password",
      signIn: "Sign In",
      forgotPassword: "Forgot password?",
      signup: "Sign up",
      createAccount: "Create your account",
      confirmPasswordPlaceholder: "Confirm password",
      createAccountBtn: "Create Account",
      dashboard: "Dashboard"
    }
  },
  hi: {
    translation: {
      welcome: "अरन्या में आपका स्वागत है",
      cattleCare: "कॅटल केयर",
      description: "स्मार्ट पशु स्वास्थ्य निगरानी प्रणाली",
      selectLanguage: "भाषा चुनें",
      login: "लॉगिन करें",
      back: "पीछे जाएँ",
      signinMessage: "जारी रखने के लिए साइन इन करें",
      emailPlaceholder: "ईमेल / संपर्क नंबर",
      passwordPlaceholder: "पासवर्ड",
      fullNamePlaceholder: "पूरा नाम",
      resetPassword: "पासवर्ड रीसेट करें",
      signIn: "साइन इन करें",
      forgotPassword: "पासवर्ड भूल गए?",
      signup: "साइन अप",
      createAccount: "अपना खाता बनाएँ",
      confirmPasswordPlaceholder: "पासवर्ड की पुष्टि करें",
      createAccountBtn: "खाता बनाएँ",
      dashboard: "डैशबोर्ड"
    }
  },
  kn: {
    translation: {
      welcome: "ಅರಣ್ಯಕ್ಕೆ ಸ್ವಾಗತ",
      cattleCare: "ಕ್ಯಾಟಲ್ ಕೇರ್",
      description: "ಸ್ಮಾರ್ಟ್ ಪಶು ಆರೋಗ್ಯ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ",
      selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      login: "ಲಾಗಿನ್ ಮಾಡಿ",
      back: "ಹಿಂದಕ್ಕೆ",
      signinMessage: "ಮುಂದೆ ಹೋಗಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
      emailPlaceholder: "ಇಮೇಲ್ / ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
      passwordPlaceholder: "ಪಾಸ್ವರ್ಡ್",
      fullNamePlaceholder: "ಪೂರ್ಣ ಹೆಸರು",
      resetPassword: "ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
      signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
      forgotPassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆತೀರಾ?",
      signup: "ಸೈನ್ ಅಪ್ ಮಾಡಿ",
      createAccount: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
      confirmPasswordPlaceholder: "ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
      createAccountBtn: "ಖಾತೆ ರಚಿಸಿ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"
    }
  },
  mr: {
    translation: {
      welcome: "अरन्या मध्ये आपले स्वागत आहे",
      cattleCare: "कॅटल केअर",
      description: "स्मार्ट पशु आरोग्य निरीक्षण प्रणाली",
      selectLanguage: "भाषा निवडा",
      login: "लॉगिन",
      back: "मागे जा",
      signinMessage: "सुरू ठेवण्यासाठी साइन इन करा",
      emailPlaceholder: "ईमेल / संपर्क नंबर",
      passwordPlaceholder: "पासवर्ड",
      fullNamePlaceholder: "पूर्ण नाव",
      resetPassword: "पासवर्ड रीसेट करा",
      signIn: "साइन इन करा",
      forgotPassword: "पासवर्ड विसरलात?",
      signup: "साइन अप करा",
      createAccount: "तुमचे खाते तयार करा",
      confirmPasswordPlaceholder: "पासवर्डची पुष्टी करा",
      createAccountBtn: "खाते तयार करा",
      dashboard: "डॅशबोर्ड"
    }
  },
  ta: {
    translation: {
      welcome: "அரண்யா வரவேற்கிறது",
      cattleCare: "காட்டல் பராமரிப்பு",
      description: "ஸ்மார்ட் கால்நடை சுகாதார கண்காணிப்பு அமைப்பு",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      login: "உள்நுழை",
      back: "பின்னுக்கு",
      signinMessage: "தொடர உள்நுழைக",
      emailPlaceholder: "மின்னஞ்சல் / தொடர்பு எண்",
      passwordPlaceholder: "கடவுச்சொல்",
      fullNamePlaceholder: "முழுப் பெயர்",
      resetPassword: "கடவுச்சொல்லை மீட்டமை",
      signIn: "உள்நுழை",
      forgotPassword: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      signup: "பதிவு செய்",
      createAccount: "உங்கள் கணக்கை உருவாக்கவும்",
      confirmPasswordPlaceholder: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      createAccountBtn: "கணக்கு உருவாக்கு",
      dashboard: "டாஷ்போர்டு"
    }
  },
  te: {
    translation: {
      welcome: "అరణ్యకు స్వాగతం",
      cattleCare: "క్యాటిల్ కేర్",
      description: "స్మార్ట్ పశువుల ఆరోగ్య మానిటరింగ్ సిస్టమ్",
      selectLanguage: "భాషను ఎంచుకోండి",
      login: "లాగిన్ చేయండి",
      back: "వెనక్కి వెళ్ళండి",
      signinMessage: "కొనసాగడానికి సైన్ ఇన్ చేయండి",
      emailPlaceholder: "ఈమెయిల్ / కాంటాక్ట్ నంబర్",
      passwordPlaceholder: "పాస్వర్డ్",
      fullNamePlaceholder: "పూర్తి పేరు",
      resetPassword: "పాస్‌వర్డ్ రీసెట్ చేయండి",
      signIn: "సైన్ ఇన్ చేయండి",
      forgotPassword: "పాస్వర్డ్ మర్చిపోయారా?",
      signup: "సైన్ అప్ చేయండి",
      createAccount: "మీ ఖాతాను సృష్టించండి",
      confirmPasswordPlaceholder: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
      createAccountBtn: "ఖాతా సృష్టించండి",
      dashboard: "డాష్‌బోర్డ్"
    }
  },
  bn: {
    translation: {
      welcome: "অরণ্যে স্বাগতম",
      cattleCare: "ক্যাটল কেয়ার",
      description: "স্মার্ট গবাদি পশু স্বাস্থ্য পর্যবেক্ষণ ব্যবস্থা",
      selectLanguage: "ভাষা নির্বাচন করুন",
      login: "লগইন",
      back: "ফিরে যান",
      signinMessage: "চালিয়ে যেতে সাইন ইন করুন",
      emailPlaceholder: "ইমেল / যোগাযোগ নম্বর",
      passwordPlaceholder: "পাসওয়ার্ড",
      fullNamePlaceholder: "পূর্ণ নাম",
      resetPassword: "পাসওয়ার্ড রিসেট করুন",
      signIn: "সাইন ইন করুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      signup: "সাইন আপ করুন",
      createAccount: "আপনার অ্যাকাউন্ট তৈরি করুন",
      confirmPasswordPlaceholder: "পাসওয়ার্ড নিশ্চিত করুন",
      createAccountBtn: "অ্যাকাউন্ট তৈরি করুন",
      dashboard: "ড্যাশবোর্ড"
    }
  },
  gu: {
    translation: {
      welcome: "અરણ્યમાં આપનું સ્વાગત છે",
      cattleCare: "કેટલ કేర్",
      description: "સ્માર્ટ પશુ આરોગ્ય મોનિટરિંગ સિસ્ટમ",
      selectLanguage: "ભાષા પસંદ કરો",
      login: "લોગિન",
      back: "પાછા જાઓ",
      signinMessage: "ચાલુ રાખવા માટે સાઇન ઇન કરો",
      emailPlaceholder: "ઇમેલ / સંપર્ક નંબર",
      passwordPlaceholder: "પાસવર્ડ",
      fullNamePlaceholder: "પૂર્ણ નામ",
      resetPassword: "પાસવર્ડ ફરી સેટ કરો",
      signIn: "સાઇન ઇન કરો",
      forgotPassword: "પાસવર્ડ ભૂલી ગયા?",
      signup: "સાઇન અપ કરો",
      createAccount: "તમારું એકાઉન્ટ બનાવો",
      confirmPasswordPlaceholder: "પાસવર્ડની પુષ્ટિ કરો",
      createAccountBtn: "એકાઉન્ટ બનાવો",
      dashboard: "ડેશબોર્ડ"
    }
  },
  ml: {
    translation: {
      welcome: "അരണ്യയിലേക്ക് സ്വാഗതം",
      cattleCare: "ക്യാറ്റിൽ കെയർ",
      description: "സ്മാർട്ട് കന്നുകാലി ആരോഗ്യ നിരീക്ഷണ സംവിധാനം",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      login: "ലോഗിൻ",
      back: "തിരികെ",
      signinMessage: "തുടരാൻ സൈൻ ഇൻ ചെയ്യുക",
      emailPlaceholder: "ഇമെയിൽ / കോൺടാക്റ്റ് നമ്പർ",
      passwordPlaceholder: "പാസ്വേഡ്",
      fullNamePlaceholder: "പൂർണ്ണ പേര്",
      resetPassword: "പാസ്വേഡ് പുനഃസജ്ജമാക്കുക",
      signIn: "സൈൻ ഇൻ ചെയ്യുക",
      forgotPassword: "പാസ്വേഡ് മറന്നോ?",
      signup: "സൈൻ അപ്പ് ചെയ്യുക",
      createAccount: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      confirmPasswordPlaceholder: "പാസ്വേഡ് സ്ഥിരീകരിക്കുക",
      createAccountBtn: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      dashboard: "ഡാഷ്ബോർഡ്"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
