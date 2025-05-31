
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    home: 'Home',
    games: 'Games',
    sports: 'Sports',
    live: 'Live',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    logOut: 'Log out',
    accountSettings: 'Account Settings',
    
    // Navigation
    wallet: 'Wallet',
    sportsBetting: 'Sports Betting',
    liveTV: 'Live TV',
    admin: 'Admin',
    
    // Account
    myAccount: 'My Account',
    profile: 'Profile',
    verification: 'Verification',
    paymentMethods: 'Payment Methods',
    settings: 'Settings',
    
    // General
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    
    // Auth
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    username: 'Username',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    createAccount: 'Create Account',
    continueWithGoogle: 'Continue with Google',
    
    // Site name
    siteName: 'MEDB'
  },
  am: {
    // Header
    home: 'ቤት',
    games: 'ጨዋታዎች',
    sports: 'ስፖርት',
    live: 'ቀጥታ',
    signIn: 'ግባ',
    getStarted: 'ጀምር',
    logOut: 'ውጣ',
    accountSettings: 'የመለያ ቅንብሮች',
    
    // Navigation
    wallet: 'ዋሌት',
    sportsBetting: 'የስፖርት ውርርድ',
    liveTV: 'ቀጥታ ቴሌቪዥን',
    admin: 'አስተዳዳሪ',
    
    // Account
    myAccount: 'የእኔ መለያ',
    profile: 'መገለጫ',
    verification: 'ማረጋገጫ',
    paymentMethods: 'የክፍያ ዘዴዎች',
    settings: 'ቅንብሮች',
    
    // General
    welcome: 'እንኳን ደህና መጡ',
    loading: 'በመስራት ላይ...',
    save: 'አስቀምጥ',
    cancel: 'ሰርዝ',
    delete: 'ሰርዝ',
    edit: 'አርም',
    update: 'አዘምን',
    
    // Auth
    email: 'ኢሜይል',
    password: 'የይለፍ ቃል',
    firstName: 'ስም',
    lastName: 'የአባት ስም',
    username: 'የተጠቃሚ ስም',
    phoneNumber: 'ስልክ ቁጥር',
    dateOfBirth: 'የተወለዱበት ቀን',
    createAccount: 'መለያ ይፍጠሩ',
    continueWithGoogle: 'በGoogle ቀጥል',
    
    // Site name
    siteName: 'መዳብ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
