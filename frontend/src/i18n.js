// i18n.js - Multilingual support for KisanVision
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ALL_TRANSLATIONS from './locales/index.js';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      recommend: 'Recommend',
      history: 'History',
      myFarm: 'My Farm',
      intelligence: 'Intelligence',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',

      // Common
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      search: 'Search',
      noData: 'No data found',
      error: 'Something went wrong. Please try again.',
      success: 'Success!',
      back: 'Back',

      // Disease Detection
      diseaseTitle: 'Crop Disease Detection',
      diseaseSubtitle: 'Describe your crop symptoms and get instant diagnosis',
      selectCrop: 'Select Crop',
      describeSymptoms: 'Describe Symptoms',
      symptomsPlaceholder: 'e.g., yellow spots on leaves, wilting, black fungal growth on stems...',
      diagnose: 'Diagnose Disease',
      diseaseFound: 'Disease Detected',
      severity: 'Severity',
      treatment: 'Treatment',
      prevention: 'Prevention',
      organicTreatment: 'Organic Treatment',
      imageTip: 'Visual Identification Tip',
      symptomsMatched: 'Symptoms Matched',

      // Calendar
      calendarTitle: 'Farm Calendar',
      calendarSubtitle: 'Week-by-week crop cultivation guide',
      sowDate: 'Sowing Date',
      generateCalendar: 'Generate Calendar',
      week: 'Week',
      phase: 'Phase',
      activities: 'Activities',
      irrigation: 'Irrigation',
      fertilizer: 'Fertilizer',
      watchOut: 'Watch Out',

      // Forum
      forumTitle: 'Farmer Community Forum',
      forumSubtitle: 'Ask questions and share knowledge with fellow farmers',
      askQuestion: 'Ask Question',
      postTitle: 'Question Title',
      postContent: 'Describe your problem or question',
      category: 'Category',
      cropTag: 'Crop Tag',
      answers: 'Answers',
      views: 'Views',
      likes: 'Likes',
      addAnswer: 'Add Answer',
      submitAnswer: 'Submit Answer',

      // Loan Eligibility
      loanTitle: 'Government Schemes & Loan Eligibility',
      loanSubtitle: 'Check your eligibility for government farming schemes',
      landArea: 'Land Area (Acres)',
      annualIncome: 'Annual Income (₹)',
      state: 'State',
      hasKisanCard: 'Do you have Kisan Card?',
      isSmallFarmer: 'Are you a Small/Marginal Farmer?',
      hasBankAccount: 'Do you have a Bank Account?',
      checkEligibility: 'Check Eligibility',
      eligibleSchemes: 'Eligible Schemes',
      totalBenefit: 'Total Estimated Benefit',
      applyNow: 'Apply Now',

      // Market Forecast
      forecastTitle: 'Yield & Market Price Forecast',
      forecastSubtitle: 'Predict your yield and best time to sell',
      landAreaAcres: 'Land Area (Acres)',
      soilType: 'Soil Type',
      rainfallLevel: 'Rainfall Level',
      season: 'Season',
      fertilizerUsed: 'Using Chemical Fertilizer?',
      forecast: 'Get Forecast',
      yieldPerAcre: 'Yield Per Acre',
      totalYield: 'Total Yield',
      netProfit: 'Net Profit',
      bestSellingMonths: 'Best Months to Sell',
      pricetrend: 'Price Trend',

      // Dashboard
      dashboardTitle: 'Farm Analytics Dashboard',
      totalPredictions: 'Total Predictions',
      topCrop: 'Top Recommended Crop',
      avgConfidence: 'Average Confidence',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',

      // Weather
      weatherTitle: 'Weather & Alerts',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      forecast7day: '7-Day Forecast',
      weatherAlert: 'Weather Alert',

      // Chat
      chatTitle: 'KisanVision Assistant',
      chatPlaceholder: 'Ask about farming...',

      // Crop names
      rice: 'Rice', wheat: 'Wheat', cotton: 'Cotton', maize: 'Maize', tomato: 'Tomato',
      potato: 'Potato', onion: 'Onion', groundnut: 'Groundnut', soybean: 'Soybean',
      sugarcane: 'Sugarcane', chilli: 'Chilli', mustard: 'Mustard', bajra: 'Pearl Millet',
      jowar: 'Sorghum', sunflower: 'Sunflower',

      // Seasons
      kharif: 'Kharif (Monsoon)', rabi: 'Rabi (Winter)', zaid: 'Zaid (Summer)',
    }
  },

  hi: {
    translation: {
      home: 'होम', recommend: 'फसल सिफारिश', history: 'इतिहास', myFarm: 'मेरा खेत',
      intelligence: 'इंटेलिजेंस', logout: 'लॉगआउट', login: 'लॉगिन', register: 'रजिस्टर',
      loading: 'लोड हो रहा है...', submit: 'जमा करें', cancel: 'रद्द करें', save: 'सहेजें',
      delete: 'हटाएं', search: 'खोजें', noData: 'कोई डेटा नहीं मिला',
      error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।', success: 'सफलता!', back: 'वापस',

      diseaseTitle: 'फसल रोग पहचान', diseaseSubtitle: 'अपने फसल के लक्षण बताएं और तुरंत निदान पाएं',
      selectCrop: 'फसल चुनें', describeSymptoms: 'लक्षण बताएं',
      symptomsPlaceholder: 'जैसे: पत्तियों पर पीले धब्बे, मुरझाना, तनों पर काला कवक...',
      diagnose: 'रोग पहचानें', diseaseFound: 'रोग मिला', severity: 'गंभीरता',
      treatment: 'उपचार', prevention: 'रोकथाम', organicTreatment: 'जैविक उपचार',
      imageTip: 'दृश्य पहचान युक्ति', symptomsMatched: 'मिले लक्षण',

      calendarTitle: 'खेती कैलेंडर', calendarSubtitle: 'सप्ताह दर सप्ताह खेती मार्गदर्शिका',
      sowDate: 'बुवाई तिथि', generateCalendar: 'कैलेंडर बनाएं', week: 'सप्ताह',
      phase: 'चरण', activities: 'गतिविधियां', irrigation: 'सिंचाई', fertilizer: 'खाद', watchOut: 'सावधान रहें',

      forumTitle: 'किसान समुदाय मंच', forumSubtitle: 'सवाल पूछें और साथी किसानों से ज्ञान साझा करें',
      askQuestion: 'सवाल पूछें', postTitle: 'सवाल का शीर्षक',
      postContent: 'अपनी समस्या या सवाल विस्तार से बताएं',
      category: 'श्रेणी', cropTag: 'फसल टैग', answers: 'जवाब', views: 'देखा', likes: 'पसंद',
      addAnswer: 'जवाब दें', submitAnswer: 'जवाब जमा करें',

      loanTitle: 'सरकारी योजनाएं और ऋण पात्रता', loanSubtitle: 'सरकारी कृषि योजनाओं के लिए पात्रता जांचें',
      landArea: 'जमीन का क्षेत्र (एकड़)', annualIncome: 'वार्षिक आय (₹)', state: 'राज्य',
      hasKisanCard: 'क्या आपके पास किसान कार्ड है?', isSmallFarmer: 'क्या आप छोटे/सीमांत किसान हैं?',
      hasBankAccount: 'क्या आपके पास बैंक खाता है?', checkEligibility: 'पात्रता जांचें',
      eligibleSchemes: 'पात्र योजनाएं', totalBenefit: 'कुल अनुमानित लाभ', applyNow: 'अभी आवेदन करें',

      forecastTitle: 'उपज और बाजार मूल्य पूर्वानुमान', forecastSubtitle: 'अपनी उपज का अनुमान और बेचने का सबसे अच्छा समय जानें',
      landAreaAcres: 'जमीन (एकड़)', soilType: 'मिट्टी का प्रकार', rainfallLevel: 'वर्षा स्तर',
      season: 'मौसम', fertilizerUsed: 'रासायनिक खाद उपयोग कर रहे हैं?',
      forecast: 'पूर्वानुमान पाएं', yieldPerAcre: 'प्रति एकड़ उपज', totalYield: 'कुल उपज',
      netProfit: 'शुद्ध लाभ', bestSellingMonths: 'बेचने के सर्वोत्तम महीने', pricetrend: 'मूल्य रुझान',

      dashboardTitle: 'खेती विश्लेषण डैशबोर्ड', totalPredictions: 'कुल पूर्वानुमान',
      topCrop: 'शीर्ष अनुशंसित फसल', avgConfidence: 'औसत विश्वास', recentActivity: 'हालिया गतिविधि',
      quickActions: 'त्वरित क्रियाएं',

      weatherTitle: 'मौसम और अलर्ट', temperature: 'तापमान', humidity: 'आर्द्रता',
      rainfall: 'वर्षा', forecast7day: '7 दिन का पूर्वानुमान', weatherAlert: 'मौसम चेतावनी',

      chatTitle: 'KisanVision सहायक', chatPlaceholder: 'खेती के बारे में पूछें...',

      rice: 'चावल', wheat: 'गेहूं', cotton: 'कपास', maize: 'मक्का', tomato: 'टमाटर',
      potato: 'आलू', onion: 'प्याज', groundnut: 'मूंगफली', soybean: 'सोयाबीन',
      sugarcane: 'गन्ना', chilli: 'मिर्च', mustard: 'सरसों', bajra: 'बाजरा',
      jowar: 'ज्वार', sunflower: 'सूरजमुखी',
      kharif: 'खरीफ (वर्षा)', rabi: 'रबी (सर्दी)', zaid: 'जायद (गर्मी)',
    }
  },

  te: {
    translation: {
      home: 'హోమ్', recommend: 'పంట సూచన', history: 'చరిత్ర', myFarm: 'నా పొలం',
      intelligence: 'ఇంటెలిజెన్స్', logout: 'లాగ్ అవుట్', login: 'లాగిన్', register: 'నమోదు',
      loading: 'లోడవుతోంది...', submit: 'సమర్పించు', cancel: 'రద్దు చేయి', save: 'సేవ్ చేయి',
      delete: 'తొలగించు', search: 'వెతుకు', noData: 'డేటా కనుగొనబడలేదు',
      error: 'ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.', success: 'విజయం!', back: 'వెనక్కి',

      diseaseTitle: 'పంట వ్యాధి గుర్తింపు', diseaseSubtitle: 'మీ పంట లక్షణాలను వివరించి తక్షణ నిర్ధారణ పొందండి',
      selectCrop: 'పంటను ఎంచుకోండి', describeSymptoms: 'లక్షణాలను వివరించండి',
      symptomsPlaceholder: 'ఉదా: ఆకులపై పసుపు మచ్చలు, వాడిపోవడం, కాండాలపై నల్ల శిలీంధ్రం...',
      diagnose: 'వ్యాధిని గుర్తించండి', diseaseFound: 'వ్యాధి గుర్తించబడింది', severity: 'తీవ్రత',
      treatment: 'చికిత్స', prevention: 'నివారణ', organicTreatment: 'సేంద్రీయ చికిత్స',
      imageTip: 'దృశ్య గుర్తింపు చిట్కా', symptomsMatched: 'సరిపోలిన లక్షణాలు',

      calendarTitle: 'వ్యవసాయ క్యాలెండర్', calendarSubtitle: 'వారం వారం పంట సాగు మార్గదర్శి',
      sowDate: 'విత్తే తేదీ', generateCalendar: 'క్యాలెండర్ రూపొందించు',
      week: 'వారం', phase: 'దశ', activities: 'కార్యక్రమాలు', irrigation: 'నీటిపారుదల',
      fertilizer: 'ఎరువు', watchOut: 'జాగ్రత్త',

      forumTitle: 'రైతు సమాజ వేదిక', forumSubtitle: 'సహ రైతులతో ప్రశ్నలు అడగండి మరియు జ్ఞానం పంచుకోండి',
      askQuestion: 'ప్రశ్న అడగండి', postTitle: 'ప్రశ్న శీర్షిక', postContent: 'మీ సమస్య వివరించండి',
      category: 'వర్గం', cropTag: 'పంట ట్యాగ్', answers: 'సమాధానాలు', views: 'వీక్షణలు',
      likes: 'లైకులు', addAnswer: 'సమాధానం ఇవ్వండి', submitAnswer: 'సమాధానం సమర్పించు',

      loanTitle: 'ప్రభుత్వ పథకాలు & రుణ అర్హత', loanSubtitle: 'ప్రభుత్వ వ్యవసాయ పథకాలకు అర్హతను తనిఖీ చేయండి',
      landArea: 'భూమి విస్తీర్ణం (ఎకరాలు)', annualIncome: 'వార్షిక ఆదాయం (₹)', state: 'రాష్ట్రం',
      hasKisanCard: 'మీకు కిసాన్ కార్డ్ ఉందా?', isSmallFarmer: 'మీరు చిన్న/సన్నకారు రైతా?',
      hasBankAccount: 'మీకు బ్యాంక్ ఖాతా ఉందా?', checkEligibility: 'అర్హత తనిఖీ చేయి',
      eligibleSchemes: 'అర్హత ఉన్న పథకాలు', totalBenefit: 'మొత్తం అంచనా లాభం', applyNow: 'ఇప్పుడు దరఖాస్తు చేయండి',

      forecastTitle: 'దిగుబడి & మార్కెట్ ధర అంచనా', forecastSubtitle: 'మీ దిగుబడి మరియు అమ్మడానికి అత్యుత్తమ సమయాన్ని తెలుసుకోండి',
      landAreaAcres: 'భూమి (ఎకరాలు)', soilType: 'మట్టి రకం', rainfallLevel: 'వర్షపాతం స్థాయి',
      season: 'సీజన్', fertilizerUsed: 'రసాయన ఎరువు వాడుతున్నారా?',
      forecast: 'అంచనా పొందండి', yieldPerAcre: 'ఎకరాకు దిగుబడి', totalYield: 'మొత్తం దిగుబడి',
      netProfit: 'నికర లాభం', bestSellingMonths: 'అమ్మడానికి అత్యుత్తమ నెలలు', pricetrend: 'ధర ధోరణి',

      dashboardTitle: 'వ్యవసాయ విశ్లేషణ డాష్‌బోర్డ్', totalPredictions: 'మొత్తం అంచనాలు',
      topCrop: 'అగ్ర సూచించిన పంట', avgConfidence: 'సగటు విశ్వాసం', recentActivity: 'ఇటీవల కార్యకలాపాలు',
      quickActions: 'త్వరిత చర్యలు',

      weatherTitle: 'వాతావరణం & హెచ్చరికలు', temperature: 'ఉష్ణోగ్రత', humidity: 'తేమ',
      rainfall: 'వర్షపాతం', forecast7day: '7 రోజుల అంచనా', weatherAlert: 'వాతావరణ హెచ్చరిక',
      chatTitle: 'KisanVision సహాయకుడు', chatPlaceholder: 'వ్యవసాయం గురించి అడగండి...',

      rice: 'వరి', wheat: 'గోధుమ', cotton: 'పత్తి', maize: 'మొక్కజొన్న', tomato: 'టమాట',
      potato: 'బంగాళదుంప', onion: 'ఉల్లి', groundnut: 'వేరుశెనగ', soybean: 'సోయాబీన్',
      sugarcane: 'చెరకు', chilli: 'మిర్చి', mustard: 'ఆవాలు', bajra: 'సజ్జ',
      jowar: 'జొన్న', sunflower: 'పొద్దుతిరుగుడు',
      kharif: 'ఖరీఫ్ (వర్షాకాలం)', rabi: 'రబీ (చలికాలం)', zaid: 'జైద్ (వేసవి)',
    }
  },

  ta: {
    translation: {
      home: 'முகப்பு', recommend: 'பயிர் பரிந்துரை', history: 'வரலாறு', myFarm: 'என் பண்ணை',
      intelligence: 'நுண்ணறிவு', logout: 'வெளியேறு', login: 'உள்நுழை', register: 'பதிவு',
      loading: 'ஏற்றுகிறது...', submit: 'சமர்ப்பி', cancel: 'ரத்து செய்', save: 'சேமி',
      delete: 'நீக்கு', search: 'தேடு', noData: 'தரவு எதுவும் இல்லை',
      error: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.', success: 'வெற்றி!', back: 'பின்',
      diseaseTitle: 'பயிர் நோய் கண்டறிதல்', diseaseSubtitle: 'உங்கள் பயிரின் அறிகுறிகளை விவரிக்கவும்',
      selectCrop: 'பயிர் தேர்வு', describeSymptoms: 'அறிகுறிகளை விவரி',
      symptomsPlaceholder: 'எ.கா: இலைகளில் மஞ்சள் புள்ளிகள், வாடுதல்...',
      diagnose: 'நோய் கண்டறி', diseaseFound: 'நோய் கண்டறியப்பட்டது', severity: 'தீவிரம',
      treatment: 'சிகிச்சை', prevention: 'தடுப்பு', organicTreatment: 'இயற்கை சிகிச்சை',
      imageTip: 'காட்சி அடையாள குறிப்பு', symptomsMatched: 'பொருந்திய அறிகுறிகள்',
      calendarTitle: 'வேளாண் நாட்காட்டி', calendarSubtitle: 'வார வாரமான பயிர் வழிகாட்டி',
      loanTitle: 'அரசு திட்டங்கள் & கடன் தகுதி', checkEligibility: 'தகுதி சரிபார்',
      forecastTitle: 'விளைச்சல் & சந்தை விலை முன்னறிவிப்பு',
      dashboardTitle: 'வேளாண் பகுப்பாய்வு டாஷ்போர்டு',
      weatherTitle: 'வானிலை & எச்சரிக்கைகள்',
      chatTitle: 'KisanVision உதவியாளர்', chatPlaceholder: 'வேளாண்மை பற்றி கேளுங்கள்...',
      rice: 'நெல்', wheat: 'கோதுமை', cotton: 'பருத்தி', maize: 'சோளம்', tomato: 'தக்காளி',
      potato: 'உருளைக்கிழங்கு', onion: 'வெங்காயம்', groundnut: 'வேர்க்கடலை',
      kharif: 'காரிஃப் (மழைக்காலம்)', rabi: 'ரபி (குளிர்காலம்)', zaid: 'ஜெய்த் (கோடைக்காலம்)',
    }
  },

  kn: {
    translation: {
      home: 'ಮುಖಪುಟ', recommend: 'ಬೆಳೆ ಶಿಫಾರಸು', history: 'ಇತಿಹಾಸ', myFarm: 'ನನ್ನ ಹೊಲ',
      intelligence: 'ಬುದ್ಧಿಮತ್ತೆ', logout: 'ಲಾಗ್ ಔಟ್', login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', submit: 'ಸಲ್ಲಿಸು', cancel: 'ರದ್ದು ಮಾಡು', save: 'ಉಳಿಸು',
      delete: 'ಅಳಿಸು', search: 'ಹುಡುಕು', noData: 'ಯಾವುದೇ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ',
      error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', success: 'ಯಶಸ್ಸು!', back: 'ಹಿಂದೆ',
      diseaseTitle: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ', diseaseSubtitle: 'ನಿಮ್ಮ ಬೆಳೆಯ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ',
      selectCrop: 'ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ', describeSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ',
      diagnose: 'ರೋಗ ಪತ್ತೆ ಮಾಡಿ', diseaseFound: 'ರೋಗ ಪತ್ತೆಯಾಗಿದೆ', severity: 'ತೀವ್ರತೆ',
      treatment: 'ಚಿಕಿತ್ಸೆ', prevention: 'ತಡೆಗಟ್ಟುವಿಕೆ', organicTreatment: 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',
      calendarTitle: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್', loanTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು & ಸಾಲ ಅರ್ಹತೆ',
      forecastTitle: 'ಇಳುವರಿ & ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
      dashboardTitle: 'ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      chatTitle: 'KisanVision ಸಹಾಯಕ', chatPlaceholder: 'ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ...',
      rice: 'ಭತ್ತ', wheat: 'ಗೋಧಿ', cotton: 'ಹತ್ತಿ', maize: 'ಮೆಕ್ಕೆಜೋಳ', tomato: 'ಟೊಮೇಟೊ',
      kharif: 'ಖರೀಫ್ (ಮಳೆಗಾಲ)', rabi: 'ರಬಿ (ಚಳಿಗಾಲ)', zaid: 'ಝಾಯ್ದ್ (ಬೇಸಿಗೆ)',
    }
  },

  mr: {
    translation: {
      home: 'मुखपृष्ठ', recommend: 'पीक शिफारस', history: 'इतिहास', myFarm: 'माझी शेत',
      intelligence: 'बुद्धिमत्ता', logout: 'लॉगआउट', login: 'लॉगिन', register: 'नोंदणी',
      loading: 'लोड होत आहे...', submit: 'सबमिट करा', cancel: 'रद्द करा', save: 'जतन करा',
      diseaseTitle: 'पीक रोग ओळख', selectCrop: 'पीक निवडा', diagnose: 'रोग ओळखा',
      treatment: 'उपचार', prevention: 'प्रतिबंध',
      calendarTitle: 'शेती दिनदर्शिका', loanTitle: 'सरकारी योजना आणि कर्ज पात्रता',
      forecastTitle: 'उत्पादन आणि बाजार किंमत अंदाज',
      chatTitle: 'KisanVision सहाय्यक', chatPlaceholder: 'शेतीबद्दल विचारा...',
      rice: 'भात', wheat: 'गहू', cotton: 'कापूस', maize: 'मका', tomato: 'टोमॅटो',
      kharif: 'खरीप (पावसाळा)', rabi: 'रब्बी (हिवाळा)', zaid: 'उन्हाळी',
    }
  }
};

// Merge ALL_TRANSLATIONS for all 22 languages into i18next resources
const combinedResources = { ...resources };
Object.keys(ALL_TRANSLATIONS).forEach(code => {
  combinedResources[code] = {
    translation: {
      ...(resources[code]?.translation || {}),
      ...(ALL_TRANSLATIONS[code] || {}),
    }
  };
});

const initialLang = (typeof localStorage !== 'undefined' && localStorage.getItem('cv_language')) || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: combinedResources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'cv_language',
      caches: ['localStorage'],
    },
  });

export default i18n;

