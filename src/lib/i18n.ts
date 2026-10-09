export type Language = 'en' | 'hi' | 'ta' | 'kn' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  sosButton: string;
  emergencyHelpline: string;
  trackTrain: string;
  reportIncident: string;
  aiAssistant: string;
  adminPortal: string;
  securityOverview: string;
  demoMode: string;
  switchRole: string;
  liveStatus: string;
  searchPlaceholder: string;
  safetyTitle: string;
  safetyDescription: string;
  emergencyContacts: string;
  quickServices: string;
  nationalEmergency: string;
  railwayProtectionForce: string;
  submitReport: string;
  incidentCategory: string;
  severity: string;
  status: string;
  description: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  testAlert: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'RailSafe 2.0',
    tagline: 'Autonomous Railway Passenger Safety & Operations Hub',
    sosButton: 'EMERGENCY SOS',
    emergencyHelpline: 'Railway Helpline: 139',
    trackTrain: 'Live Train Radar',
    reportIncident: 'Report Safety Incident',
    aiAssistant: 'AI Travel Assistant',
    adminPortal: 'Operations Dashboard',
    securityOverview: 'Cybersecurity Hub',
    demoMode: 'Judge Demo Mode',
    switchRole: 'Switch Persona',
    liveStatus: 'REAL-TIME ACTIVE',
    searchPlaceholder: 'Search train number, name, or station code...',
    safetyTitle: 'Passenger Protection & Rapid Response',
    safetyDescription: 'Securing millions of railway passengers with automated AI incident classification, encrypted live location sharing, and direct operator escalation.',
    emergencyContacts: 'Emergency Contacts',
    quickServices: 'Nearby Station Facilities',
    nationalEmergency: 'National Emergency: 112',
    railwayProtectionForce: 'RPF Security: 182 / 139',
    submitReport: 'Submit Incident Report',
    incidentCategory: 'Incident Category',
    severity: 'Severity',
    status: 'Status',
    description: 'Description',
    cancel: 'Cancel',
    confirm: 'Confirm Action',
    save: 'Save',
    delete: 'Delete',
    testAlert: 'Send Test SMS Alert',
  },
  hi: {
    appName: 'रेलसेफ 2.0 (RailSafe)',
    tagline: 'स्वायत्त रेल यात्री सुरक्षा एवं परिचालन केंद्र',
    sosButton: 'आपातकालीन एसओएस (SOS)',
    emergencyHelpline: 'रेलवे हेल्पलाइन: 139',
    trackTrain: 'लाइव ट्रेन रडार',
    reportIncident: 'सुरक्षा घटना दर्ज करें',
    aiAssistant: 'एआई यात्रा सहायक',
    adminPortal: 'कंट्रोल रूम डैशबोर्ड',
    securityOverview: 'साइबर सुरक्षा हब',
    demoMode: 'डेमो मोड',
    switchRole: 'भूमिका बदलें',
    liveStatus: 'वास्तविक समय सक्रिय',
    searchPlaceholder: 'ट्रेन नंबर, नाम या स्टेशन कोड खोजें...',
    safetyTitle: 'यात्री सुरक्षा एवं त्वरित सहायता',
    safetyDescription: 'स्वचालित एआई वर्गीकरण, लाइव लोकेशन शेयरिंग और तत्काल आरपीएफ सहायता के साथ सुरक्षित रेल यात्रा।',
    emergencyContacts: 'आपातकालीन संपर्क',
    quickServices: 'निकटवर्ती सुविधाएं',
    nationalEmergency: 'राष्ट्रीय आपातकाल: 112',
    railwayProtectionForce: 'आरपीएफ सुरक्षा: 182 / 139',
    submitReport: 'घटना रिपोर्ट जमा करें',
    incidentCategory: 'घटना श्रेणी',
    severity: 'गंभीरता',
    status: 'स्थिति',
    description: 'विवरण',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    testAlert: 'परीक्षण एसएमएस भेजें',
  },
  ta: {
    appName: 'ரெயில்சேஃப் 2.0 (RailSafe)',
    tagline: 'ரயில் பயணிகள் பாதுகாப்பு மற்றும் செயல்பாட்டு மையம்',
    sosButton: 'அவசர SOS உதவி',
    emergencyHelpline: 'ரயில்வே உதவி எண்: 139',
    trackTrain: 'ரயில் நேரடி கண்காணிப்பு',
    reportIncident: 'பாதுகாப்பு புகாரளி',
    aiAssistant: 'AI பயண உதவியாளர்',
    adminPortal: 'கட்டுப்பாட்டு அறை',
    securityOverview: 'பாதுகாப்பு மையம்',
    demoMode: 'டெமோ முறை',
    switchRole: 'பயனர் மாற்றம்',
    liveStatus: 'செயலில் உள்ளது',
    searchPlaceholder: 'ரயில் எண், பெயர் அல்லது நிலையக் குறியீடு...',
    safetyTitle: 'பயணிகள் பாதுகாப்பு மற்றும் விரைவு உதவி',
    safetyDescription: 'AI மூலம் உடனடி பகுப்பாய்வு, நேரலை இருப்பிட பகிர்வு மற்றும் RPF காவல் உதவி அமைப்பு.',
    emergencyContacts: 'அவசர தொடர்புகள்',
    quickServices: 'அருகிலுள்ள மருத்துவமனைகள்',
    nationalEmergency: 'தேசிய அவசர எண்: 112',
    railwayProtectionForce: 'RPF பாதுகாப்பு: 182 / 139',
    submitReport: 'புகார் சமர்ப்பிக்கவும்',
    incidentCategory: 'பிரிவு',
    severity: 'தீவிரம்',
    status: 'நிலை',
    description: 'விளக்கம்',
    cancel: 'ரத்துசெய்',
    confirm: 'உறுதிப்படுத்து',
    save: 'சேமி',
    delete: 'நீக்கு',
    testAlert: 'சோதனை SMS அனுப்பு',
  },
  kn: {
    appName: 'ರೈಲ್‌ಸೇಫ್ 2.0 (RailSafe)',
    tagline: 'ರೈಲ್ವೆ ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆ ಕೇಂದ್ರ',
    sosButton: 'ತುರ್ತು SOS ಸಹಾಯ',
    emergencyHelpline: 'ರೈಲ್ವೆ ಸಹಾಯವಾಣಿ: 139',
    trackTrain: 'ಲೈವ್ ರೈಲು ರೇಡಾರ್',
    reportIncident: 'ಸುರಕ್ಷತಾ ದೂರು ದಾಖಲಿಸಿ',
    aiAssistant: 'AI ಪ್ರಯಾಣ ಸಹಾಯಕ',
    adminPortal: 'ಕಾರ್ಯಾಚರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    securityOverview: 'ಸೈಬರ್ ಸುರಕ್ಷತಾ ಹಬ್',
    demoMode: 'ಡೆಮೊ ಮೋಡ್',
    switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    liveStatus: 'ನೈಜ ಸಮಯ ಸಕ್ರಿಯ',
    searchPlaceholder: 'ರೈಲು ಸಂಖ್ಯೆ, ಹೆಸರು ಅಥವಾ ನಿಲ್ದಾಣ...',
    safetyTitle: 'ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆ ಮತ್ತು ತ್ವರಿತ ಸ್ಪಂದನೆ',
    safetyDescription: 'AI ವರ್ಗೀಕರಣ ಮತ್ತು ಲೈವ್ ಸ್ಥಳ ಹಂಚಿಕೆಯೊಂದಿಗೆ ಭಾರತೀಯ ರೈಲ್ವೆ ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆ.',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    quickServices: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    nationalEmergency: 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಂಖ್ಯೆ: 112',
    railwayProtectionForce: 'ಆರ್‌ಪಿಎಫ್ ಭದ್ರತೆ: 182 / 139',
    submitReport: 'ದೂರು ಸಲ್ಲಿಸಿ',
    incidentCategory: 'ವರ್ಗ',
    severity: 'ತೀವ್ರತೆ',
    status: 'ಸ್ಥಿತಿ',
    description: 'ವಿವರಣೆ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
    save: 'ಉಳಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    testAlert: 'ಪರೀಕ್ಷಾರ್ಥ SMS ಕಳುಹಿಸಿ',
  },
  te: {
    appName: 'రైల్‌సేఫ్ 2.0 (RailSafe)',
    tagline: 'రైల్వే ప్రయాణీకుల భద్రత & కంట్రోల్ రూమ్',
    sosButton: 'అత్యవసర SOS సహాయం',
    emergencyHelpline: 'రైల్వే హెల్ప్‌లైన్: 139',
    trackTrain: 'లైవ్ రైలు ట్రాకింగ్',
    reportIncident: 'భద్రతా ఫిర్యాదు చేయండి',
    aiAssistant: 'AI ప్రయాణ సహాయకుడు',
    adminPortal: 'ఆపరేషన్స్ డ్యాష్‌బోర్డ్',
    securityOverview: 'సైబర్ సెక్యూరిటీ హబ్',
    demoMode: 'డెమో మోడ్',
    switchRole: 'పాత్ర మార్చండి',
    liveStatus: 'రియల్ టైమ్ యాక్టివ్',
    searchPlaceholder: 'రైలు నంబర్ లేదా స్టేషన్ కోడ్ శోధించండి...',
    safetyTitle: 'ప్రయాణీకుల రక్షణ & తక్షణ సహాయం',
    safetyDescription: 'AI వర్గీకరణ, లైవ్ లొకేషన్ షేరింగ్ మరియు తక్షణ RPF స్పందన వ్యవస్థతో సురక్షిత ప్రయాణం.',
    emergencyContacts: 'అత్యవసర పరిచయాలు',
    quickServices: 'సమీప ఆసుపత్రులు',
    nationalEmergency: 'జాతీయ అత్యవసర సంఖ్య: 112',
    railwayProtectionForce: 'RPF సెక్యూరిటీ: 182 / 139',
    submitReport: 'ఫిర్యాదు సమర్పించండి',
    incidentCategory: 'కేటగిరీ',
    severity: 'తీవ్రత',
    status: 'స్థితి',
    description: 'వివరాలు',
    cancel: 'రద్దు చేయి',
    confirm: 'ధృవీకరించు',
    save: 'భద్రపరుచు',
    delete: 'తొలగించు',
    testAlert: 'టెస్ట్ SMS పంపండి',
  },
};
