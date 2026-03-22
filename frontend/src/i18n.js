import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "horoscope": "Horoscope",
        "kundali": "Kundali",
        "numerology": "Numerology",
        "ai_readings": "AI Readings",
        "palm": "🖐 Palm Reading",
        "face": "🔍 Face Reading",
        "dashboard": "Dashboard",
        "login": "Login",
        "signup": "Get Started Free",
        "logout": "Logout"
      },
      "hero": {
        "badge": "AI-Powered Cosmic Intelligence",
        "title1": "Welcome to",
        "title2": "Arup",
        "title3": "Astro",
        "subtitle": "Experience the future of astrology. From precise Kundali generation to AI palm reading — discover what the cosmos has aligned for you.",
        "kundali_btn": "Generate Kundali",
        "horoscope_btn": "Check Horoscope",
        "stats": {
          "readings": "Readings Generated",
          "rating": "Average Rating",
          "authentic": "Vedic Authentic",
          "available": "Available"
        }
      },
      "form": {
        "title": "Know Your Horoscope & Kundali",
        "name": "Full Name",
        "dob": "Date of Birth",
        "time": "Time of Birth",
        "place": "Place of Birth (City)",
        "submit": "Get Free Report"
      }
    }
  },
  bn: {
    translation: {
      "nav": {
        "horoscope": "রাশিফল",
        "kundali": "কুণ্ডলী",
        "numerology": "সংখ্যাবিদ্যা",
        "ai_readings": "এআই রিডিং",
        "palm": "🖐 হস্তরেখা বিচার",
        "face": "🔍 মুখমণ্ডল বিচার",
        "dashboard": "ড্যাশবোর্ড",
        "login": "লগইন",
        "signup": "শুরু করুন",
        "logout": "লগআউট"
      },
      "hero": {
        "badge": "এআই চালিত মহাজাগতিক বুদ্ধিমত্তা",
        "title1": "স্বাগতম",
        "title2": "অরূপ",
        "title3": "অ্যাস্ট্রো",
        "subtitle": "জ্যোতিষশাস্ত্রের ভবিষ্যৎ অনুভব করুন। নিখুঁত কুণ্ডলী তৈরি থেকে এআই হস্তরেখা বিচার — আবিষ্কার করুন মহাবিশ্ব আপনার জন্য কী নির্ধারণ করেছে।",
        "kundali_btn": "কুণ্ডলী তৈরি করুন",
        "horoscope_btn": "রাশিফল দেখুন",
        "stats": {
          "readings": "রিপোর্ট তৈরি হয়েছে",
          "rating": "গড় রেটিং",
          "authentic": "বৈদিক খাঁটি",
          "available": "উপলব্ধ"
        }
      },
      "form": {
        "title": "আপনার রাশিফল ও কুণ্ডলী জানুন",
        "name": "সম্পূর্ণ নাম",
        "dob": "জন্ম তারিখ",
        "time": "জন্মের সময়",
        "place": "জন্মস্থান (শহর)",
        "submit": "ফ্রি রিপোর্ট পান"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
