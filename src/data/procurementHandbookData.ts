// =========================================================================================
// सम्पूर्ण सार्वजनिक खरिद कानूनी प्रश्नोत्तर सङ्ग्रह (Complete Integrated Public Procurement Q&A Handbook)
// सार्वजनिक खरिद ऐन, २०६३ (संशोधनसहित) र सार्वजनिक खरिद नियमावली, २०६४ (१६औँ संशोधनसहित) को
// परस्पर सम्बन्धित दफा, नियम, उपनियम, अनुसूची तथा PPMO/PPRC नजिरहरूको पूर्ण एकीकृत कानूनी भण्डार।
// =========================================================================================

export interface HandbookTopic {
  id: string;
  number: number;
  group: 'khareed-tayari' | 'vidhi-chhanot' | 'bolpatra-prakriya' | 'mulyankan-chhanot' | 'samjhauta-karyannawayan' | 'gunastar-bhuktani' | 'vivad-punaravalokan' | 'sushasan-kanuni-byawastha';
  groupTitle: string;
  title: string;
  titleEn: string;
  actSections: string;
  ruleSections: string;
  coreSummary: string;
}

export interface VeryShortQA {
  id: string;
  topicId: string;
  topicNumber: number;
  question: string;
  answer: string;
  keyMetric: string;
  actRef: string;
  ruleRef: string;
  exceptionOrNote?: string;
}

export interface ShortQA {
  id: string;
  topicId: string;
  topicNumber: number;
  question: string;
  purposeAndSignificance: string;
  legalBasis: string;
  keyPointsOrSteps: string[];
  responsibleAuthority: string;
  impactOrCaution: string;
}

export interface LongQA {
  id: string;
  topicId: string;
  topicNumber: number;
  question: string;
  introduction: string;
  legalGrounding: {
    act: string;
    rules: string;
    amendments?: string;
    directives?: string;
  };
  integratedProvisions: string[];
  workflowSteps: {
    stepNo: number;
    title: string;
    detail: string;
    authority: string;
    timeline?: string;
  }[];
  responsibleAuthorities: string[];
  limitsAndThresholds: string[];
  specialConditionsAndExceptions: string[];
  safeguardsAndAuditRisks: string[];
  conclusion: string;
}

export interface ComparativeAnalysis {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  parameters: string[];
  columns: {
    name: string;
    values: string[];
  }[];
  keyTakeaway: string;
}

export interface MasterFactRow {
  id: string;
  topic: string;
  matter: string;
  limitOrValue: string;
  legalRef: string;
  remarks?: string;
}

// -------------------------------------------------------------
// १. ५४ विषयगत क्षेत्रहरू (54 Comprehensive Topics)
// -------------------------------------------------------------
export const HANDBOOK_TOPICS: HandbookTopic[] = [
  {
    "id": "t1",
    "number": 1,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "सार्वजनिक खरिदको परिचय, उद्देश्य, सिद्धान्त तथा परिभाषा",
    "titleEn": "Introduction, Objectives, Principles and Definitions of Public Procurement",
    "actSections": "दफा १, २, ३",
    "ruleSections": "नियम १, २",
    "coreSummary": "सार्वजनिक खरिद ऐन २०६३ तथा नियमावली २०६४ को क्षेत्राधिकार, सार्वजनिक कोष प्रयोग हुने सबै निकायमा अनिवार्यता, प्रतिस्पर्धा, स्वच्छता, मितव्ययिता, जवाफदेहिता र ३०% मूल्य अभिवृद्धि भएको स्वदेशी मालसामान सम्बन्धी आधारभूत कानूनी परिभाषा।"
  },
  {
    "id": "t2",
    "number": 2,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "सार्वजनिक निकायको दायित्व तथा जिम्मेवारी",
    "titleEn": "Obligations and Responsibilities of Public Entities",
    "actSections": "दफा ३, ४, ७, ६१",
    "ruleSections": "नियम ३, ४, ५, ६, १४६",
    "coreSummary": "सरकारी कोष खर्च गर्दा ऐन बमोजिम मात्र गर्नुपर्ने, खरिद इकाइ खडा गर्नुपर्ने, जिम्मेवार अधिकृत तोक्नुपर्ने, कानून प्रतिकूल भएको खरिद स्वतः बदर हुने र जिम्मेवार पदाधिकारी उपर विभागीय तथा कानूनी दायित्व सिर्जना हुने व्यवस्था।"
  },
  {
    "id": "t3",
    "number": 3,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "खरिद आवश्यकताको पहिचान तथा तयारी",
    "titleEn": "Identification and Preparation of Procurement Needs",
    "actSections": "दफा ४",
    "ruleSections": "नियम ३, ४, ५, ६",
    "coreSummary": "प्रत्येक आर्थिक वर्षको सुरुमै आवश्यकता पहिचान, स्पेसिफिकेसन, ड्रइङ, डिजाइन र कार्यक्षेत्रगत सर्त (TOR) तयार गर्ने, उद्देश्यअनुकूल मात्र सामान माग गर्ने र अनावश्यक वस्तु खरिद गर्न नपाइने कानूनी व्यवस्था।"
  },
  {
    "id": "t4",
    "number": 4,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "वार्षिक खरिद योजना र गुरुयोजना",
    "titleEn": "Annual Procurement Plan and Master Procurement Plan",
    "actSections": "दफा ६",
    "ruleSections": "नियम ७, ८",
    "coreSummary": "१० करोड रुपैयाँभन्दा बढी लागत अनुमान भएका वा १ वर्षभन्दा बढी सञ्चालन हुने आयोजनामा खरिद गुरुयोजना (Master Plan) अनिवार्य; १० लाख रुपैयाँभन्दा बढीको खरिदमा वार्षिक खरिद योजना (Annual Plan) बनाई स्वीकृत गर्नुपर्ने अनिवार्यता।"
  },
  {
    "id": "t5",
    "number": 5,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "लागत अनुमान तयार गर्ने प्रक्रिया तथा आधार",
    "titleEn": "Process and Basis for Preparing Cost Estimate",
    "actSections": "दफा ५",
    "ruleSections": "नियम ९, १०, ११, १२, १३, १४, १५",
    "coreSummary": "जिल्ला दररेट, सरकारी दररेट, बजार दररेट, नर्म्स, परिमाणको लगत (BOQ) र स्थलगत अध्ययनका आधारमा निर्माण, मालसामान र परामर्श सेवाको यथार्थपरक लागत अनुमान तयार गर्ने विधि।"
  },
  {
    "id": "t6",
    "number": 6,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "लागत अनुमान स्वीकृत गर्ने अधिकारी तथा अधिकार",
    "titleEn": "Competent Authority and Powers to Approve Cost Estimate",
    "actSections": "दफा ५(२)",
    "ruleSections": "नियम १६",
    "coreSummary": "रा.प.अनं. प्रमुख, शाखा प्रमुख, कार्यालय प्रमुख, विभागीय प्रमुख, मन्त्रालयका सचिव र विकास समिति/बोर्डको कार्यकारी प्रमुखले लागत अनुमान स्वीकृत गर्न पाउने आर्थिक सीमा तथा अधिकार क्षेत्र।"
  },
  {
    "id": "t7",
    "number": 7,
    "group": "khareed-tayari",
    "groupTitle": "खरिद तयारी, योजना तथा लागत अनुमान",
    "title": "खरिदलाई टुक्र्याउने वा प्याकेज बनाउनेसम्बन्धी व्यवस्था",
    "titleEn": "Prohibition of Slicing Procurement and Packaging Rules",
    "actSections": "दफा ७",
    "ruleSections": "नियम ८(२), १७",
    "coreSummary": "प्रतिस्पर्धा सीमित गर्न वा उच्च खरिद विधि (खुला बोलपत्र) छल्न एउटै प्रकृतिको खरिदलाई साना-साना टुक्रामा विभाजन गर्न पूर्ण निषेध; प्राविधिक र आर्थिक मितव्ययिताका लागि प्याकेजिङ गर्दा खुला प्रतिस्पर्धा बढाउनुपर्ने कानूनी सर्त।"
  },
  {
    "id": "t8",
    "number": 8,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "खरिदका विधि र ती विधि छनोट गर्ने आधार",
    "titleEn": "Procurement Methods and Criteria for Selection",
    "actSections": "दफा ८, ९, १०",
    "ruleSections": "नियम १७, १८, ३१",
    "coreSummary": "खुला बोलपत्रलाई मूल विधिको रूपमा अवलम्बन गर्दै सिलबन्दी दरभाउपत्र, सोझै खरिद, उपभोक्ता समिति, अमानत, क्याटलग सपिङ, सीमित बोलपत्र, र बाइब्याक विधि छनोट गर्दा पूरा गर्नुपर्ने कानूनी आधार र सीमा।"
  },
  {
    "id": "t9",
    "number": 9,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "अन्तर्राष्ट्रिय खुला बोलपत्र (ICB)",
    "titleEn": "International Competitive Bidding (ICB)",
    "actSections": "दफा १५",
    "ruleSections": "नियम ३१, ३१ख, ३१ग, ३१ङ",
    "coreSummary": "नेपालभित्र पर्याप्त प्रतिस्पर्धा हुन नसक्ने, विदेशी सहायता सम्झौतामा सर्त रहेको वा ५ अर्ब रुपैयाँभन्दा बढी लागत अनुमान भएका निर्माण कार्यमा ४५ दिने सूचना, अन्तर्राष्ट्रिय व्यापारिक सर्त (Incoterms), विदेशी मुद्रा भुक्तानी र अन्तर्राष्ट्रिय मध्यस्थता।"
  },
  {
    "id": "t10",
    "number": 10,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "राष्ट्रिय खुला बोलपत्र (NCB)",
    "titleEn": "National Competitive Bidding (NCB)",
    "actSections": "दफा ८, १४",
    "ruleSections": "नियम १८, ३१ङ",
    "coreSummary": "रु २ करोडदेखि रु ५ अर्ब सम्मका निर्माण कार्यमा नेपाली निर्माण व्यवसायीहरू बीच मात्र प्रतिस्पर्धा हुने (१६औँ संशोधन); ३० दिने सूचना, नेपाली मुद्रा भुक्तानी, एकल वा संयुक्त उपक्रम (JV) र स्वदेशी क्षमता प्रवर्धन।"
  },
  {
    "id": "t11",
    "number": 11,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "सिलबन्दी दरभाउपत्र (Sealed Quotation)",
    "titleEn": "Sealed Quotation Procurement",
    "actSections": "दफा ४०",
    "ruleSections": "नियम ८४",
    "coreSummary": "रु २० लाख रुपैयाँसम्मको मालसामान वा निर्माण कार्य र रु ५ लाख सम्मको परामर्श सेवा खरिदमा १५ दिने राष्ट्रिय/स्थानीय सूचना प्रकाशन गरी कम्तीमा ३ वटा दरभाउपत्र प्राप्त हुनैपर्ने अनिवार्य कानूनी प्रावधान।"
  },
  {
    "id": "t12",
    "number": 12,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "सोझै खरिद (Direct Procurement)",
    "titleEn": "Direct Procurement / Single Source",
    "actSections": "दफा ४१",
    "ruleSections": "नियम ८५",
    "coreSummary": "रु ५ लाख सम्मको सामान्य खरिद, विशेष परिस्थितिमा रु २५ लाख सम्म, उत्पादक वा अधिकृत वितरकबाट निश्चित दरमा, पेटेन्ट/कपिराइट अधिकार भएको अवस्थामा औचित्य पुष्टि गरी बिना प्रतिस्पर्धा खरिद गर्ने कडा कानूनी सर्तहरू।"
  },
  {
    "id": "t13",
    "number": 13,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "उपभोक्ता समिति तथा लाभग्राही समुदायमार्फत गरिने खरिद वा कार्यसम्पादन",
    "titleEn": "Procurement through Users Committee and Beneficiary Community",
    "actSections": "दफा ४२",
    "ruleSections": "नियम ९७",
    "coreSummary": "रु १ करोड रुपैयाँसम्म लागत अनुमान भएका श्रममूलक पूर्वाधार निर्माण; हेभी मेसिनरी (डोजर, एक्साभेटर) प्रयोग गर्न पूर्ण निषेध, ठेकेदारलाई पेटी ठेक्का दिन नपाइने, जनसहभागिता र सार्वजनिक परीक्षण (Social Audit) अनिवार्यता।"
  },
  {
    "id": "t14",
    "number": 14,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "अमानतबाट गरिने काम (Force Account)",
    "titleEn": "Force Account / Departmental Execution",
    "actSections": "दफा ४३",
    "ruleSections": "नियम ९८",
    "coreSummary": "सार्वजनिक निकायले आफ्नै जनशक्ति, मेसिन र उपकरण प्रयोग गरी प्रत्यक्ष सुपरिवेक्षणमा काम गर्ने विधि; बोलपत्र आह्वान गर्दा पनि कसैले नलिएको वा आपतकालीन अवस्थामा विभागीय प्रमुखको पूर्वस्वीकृति लिएर मात्र गरिने काम।"
  },
  {
    "id": "t15",
    "number": 15,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "परामर्श सेवा खरिद (Consulting Services)",
    "titleEn": "Procurement of Consulting Services",
    "actSections": "दफा २९-३८",
    "ruleSections": "नियम ६९-८०",
    "coreSummary": "बौद्धिक प्रकृतिको काममा आशयपत्र (EOI), सर्टलिस्टिङ (३-६ जना), प्रस्ताव आह्वान (RFP), QCBS/QBS/LCS/FBS छनोट विधि, प्राविधिक प्रस्ताव मूल्याङ्कन, आर्थिक प्रस्ताव खोल्ने, कार्यसर्त वार्ता (Negotiation) र सम्झौता।"
  },
  {
    "id": "t16",
    "number": 16,
    "group": "vidhi-chhanot",
    "groupTitle": "खरिद विधि र छनोटका आधार",
    "title": "वस्तु, निर्माण कार्य तथा अन्य सेवा खरिद",
    "titleEn": "Procurement of Goods, Works and Non-Consulting Services",
    "actSections": "दफा २, ८, १०",
    "ruleSections": "नियम १८, ८३",
    "coreSummary": "मालसामान, भौतिक निर्माण कार्य र गैर-परामर्श सेवा (सवारी भाडा, सरसफाइ, सेक्युरिटी, क्याटरिङ, ढुवानी) खरिदका कानुनी भिन्नता, प्राविधिक स्पेसिफिकेसन र सम्झौताका प्रारूप।"
  },
  {
    "id": "t17",
    "number": 17,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "पूर्वयोग्यता निर्धारण (Prequalification)",
    "titleEn": "Prequalification Proceedings",
    "actSections": "दफा ११",
    "ruleSections": "नियम ३२, ३३, ३४, ३५, ३६, ३७",
    "coreSummary": "जटिल, ठूला र विशिष्ट प्रकृतिका निर्माण कार्य वा मालसामानमा बोलपत्र आह्वान गर्नुपूर्व बोलपत्रदाताहरूको प्राविधिक, आर्थिक र व्यावसायिक क्षमता जाँच्ने विधि, ३० दिने सूचना र पूर्वयोग्य सूची निर्माण।"
  },
  {
    "id": "t18",
    "number": 18,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्रसम्बन्धी कागजात तयार गर्ने प्रक्रिया (SBD)",
    "titleEn": "Preparation of Standard Bidding Documents",
    "actSections": "दफा १२",
    "ruleSections": "नियम ३८, ३९, ४०, ४१, ४२",
    "coreSummary": "PPMO द्वारा जारी नमुना बोलपत्र कागजात (SBD) अनिवार्य प्रयोग गर्नुपर्ने, निर्देशिका, बोलपत्रदातालाई निर्देशन (ITB), सम्झौताका साधारण सर्त (GCC), विशेष सर्त (SCC), BOQ र मूल्याङ्कन मापदण्ड समावेश गर्ने नियम।"
  },
  {
    "id": "t19",
    "number": 19,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्र आह्वान तथा सूचना प्रकाशन",
    "titleEn": "Invitation to Bid and Notice Publication",
    "actSections": "दफा १३, १४",
    "ruleSections": "नियम ४३, ४४, ४५, ४६",
    "coreSummary": "राष्ट्रियस्तरको दैनिक पत्रिका र e-GP पोर्टलमा सूचना प्रकाशन अनिवार्य; सूचनामा खुलाउनुपर्ने मुख्य विवरणहरू, बोलपत्र दस्तुर, जमानत रकम, कार्यक्षेत्र, योग्यता र दाखिला गर्ने मिति समय।"
  },
  {
    "id": "t20",
    "number": 20,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्रसम्बन्धी समयसीमा (Timelines)",
    "titleEn": "Bidding Timelines and Deadlines",
    "actSections": "दफा १४",
    "ruleSections": "नियम ४४, ४५, ५६",
    "coreSummary": "राष्ट्रिय बोलपत्रमा ३० दिन, अन्तर्राष्ट्रियमा ४५ दिन, सिलबन्दी दरभाउपत्रमा १५ दिन, पूर्वयोग्यतामा ३० दिन, दोस्रो पटक आह्वान गर्दा १५ दिन (राष्ट्रिय) र २१ दिन (अन्तर्राष्ट्रिय) को न्यूनतम म्यादको कानूनी बाध्यता।"
  },
  {
    "id": "t21",
    "number": 21,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्र जमानत तथा कार्यसम्पादन जमानत",
    "titleEn": "Bid Security and Performance Security",
    "actSections": "दफा १८, २८",
    "ruleSections": "नियम ५२, ५३, ५४",
    "coreSummary": "बोलपत्र जमानत लागत अनुमानको २% देखि ३% (मान्यता अवधिभन्दा ३० दिन बढी); कार्यसम्पादन जमानत कबोल रकमको ५% र १५% भन्दा बढी घटेकोमा थप कार्यसम्पादन जमानत (APS) सम्बन्धी १६औँ संशोधनका कडा प्रावधान।"
  },
  {
    "id": "t22",
    "number": 22,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्र दाखिला, संशोधन, फिर्ता तथा म्याद थप",
    "titleEn": "Submission, Modification, Withdrawal and Extension of Bids",
    "actSections": "दफा १५, १६",
    "ruleSections": "नियम ४७, ५७, ५८",
    "coreSummary": "तोकिएको मिति र समयभित्र e-GP मार्फत दाखिला गर्नुपर्ने, म्याद सकिनुअघि एक पटक मात्र संशोधन वा फिर्ता गर्न पाइने, म्याद सकिएपछि दाखिला भएको स्वतः अमान्य हुने र बोलपत्रको ग्राह्य अवधि थप गर्ने प्रक्रिया।"
  },
  {
    "id": "t23",
    "number": 23,
    "group": "bolpatra-prakriya",
    "groupTitle": "पूर्वयोग्यता, बोलपत्र कागजात र आह्वान",
    "title": "बोलपत्र खोल्ने प्रक्रिया",
    "titleEn": "Bid Opening Proceedings",
    "actSections": "दफा १७",
    "ruleSections": "नियम ५९",
    "coreSummary": "दाखिला गर्ने अन्तिम म्याद सकिएकै दिन तोकिएको समयमा सार्वजनिक रूपमा बोलपत्र खोल्नुपर्ने; प्रतिनिधि अनुपस्थित भए पनि काम नरोकिने, कबोल अङ्क र छुट पढेर मुचुल्का (Opening Minutes) तयार गर्नुपर्ने व्यवस्था।"
  },
  {
    "id": "t24",
    "number": 24,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "बोलपत्रको परीक्षण तथा मूल्याङ्कन",
    "titleEn": "Examination and Evaluation of Bids",
    "actSections": "दफा १९, २१, २३",
    "ruleSections": "नियम ६०, ६१, ६२, ६३, ६४, ६५",
    "coreSummary": "मूल्याङ्कन समितिले पूर्णता जाँच, योग्यता परीक्षण, प्राविधिक मूल्याङ्कन, व्यापारिक सर्त जाँच र आर्थिक मूल्याङ्कन (अङ्कगणितीय त्रुटि सच्याउने, छुट समायोजन, कर/भ्याट जाँच) गरी कारणसहित प्रतिवेदन पेस गर्ने विधि।"
  },
  {
    "id": "t25",
    "number": 25,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "बोलपत्रदाताको योग्यता निर्धारण (Qualification)",
    "titleEn": "Determination of Bidder Qualifications",
    "actSections": "दफा १०, २०",
    "ruleSections": "नियम ३५, ६१",
    "coreSummary": "व्यावसायिक क्षमता, आर्थिक स्रोत, नगद प्रवाह, औसत वार्षिक निर्माण कारोबार (AATC), समान प्रकृतिको कामको अनुभव, उपकरण, मुख्य जनशक्ति, कानुनी विवादको इतिहास र कालोसूची जाँचको कानुनी आधार।"
  },
  {
    "id": "t26",
    "number": 26,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "बोलपत्रको सारभूत प्रभावग्राहिता (Substantial Responsiveness)",
    "titleEn": "Substantial Responsiveness of Bids",
    "actSections": "दफा २१",
    "ruleSections": "नियम ६२",
    "coreSummary": "बोलपत्र कागजातका सर्त, कार्यक्षेत्र, परिमाण र गुणस्तरमा तात्विक भिन्नता नभएको प्रस्ताव; सच्याउन मिल्ने सामान्य त्रुटि (Minor Deviation) र सारभूत विचलन (Material Deviation) बीचको कानुनी भिन्नता र सीमा।"
  },
  {
    "id": "t27",
    "number": 27,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "बोलपत्र अस्वीकार वा रद्द गर्ने आधार",
    "titleEn": "Grounds for Rejection or Cancellation of Bids",
    "actSections": "दफा २६",
    "ruleSections": "नियम ६५",
    "coreSummary": "कुनै पनि बोलपत्र सारभूत रूपमा प्रभावग्राही नभएमा, कबोल अङ्क लागत अनुमानभन्दा अस्वाभाविक उच्च भएमा, मिलोमतो (Collusion) प्रमाणित भएमा वा खरिद आवश्यकता नै नरहेमा कारण खुलाएर रद्द गर्ने व्यवस्था।"
  },
  {
    "id": "t28",
    "number": 28,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "न्यूनतम मूल्याङ्कित सारभूत रूपमा प्रभावग्राही बोलपत्र र औसत अङ्क छनोट",
    "titleEn": "Lowest Evaluated Substantially Responsive Bid and Average Bidding Method",
    "actSections": "दफा २५(५क), २५(७क), २५(७ख)",
    "ruleSections": "नियम ३१ज, ६५च",
    "coreSummary": "१६औँ संशोधनको क्रान्तिकारी व्यवस्था: लागत अनुमानभन्दा ३०% भन्दा बढी घटेका बोलपत्र स्वतः खारेज हुने; बाँकी प्रभावग्राही बोलपत्रहरूको औसत अङ्क (Average Price) निकालिने र सो औसतसँग निकटतम बोलपत्रदाता छनोट हुने।"
  },
  {
    "id": "t29",
    "number": 29,
    "group": "mulyankan-chhanot",
    "groupTitle": "परीक्षण, मूल्याङ्कन, औसत अङ्क र स्वीकृति",
    "title": "खरिद सम्झौता तथा सम्झौता प्रदान (LOI & Award)",
    "titleEn": "Contract Award and Letter of Intent",
    "actSections": "दफा २७",
    "ruleSections": "नियम ६७, ६८",
    "coreSummary": "छनोट भएको बोलपत्र स्वीकृत गर्ने आशयको सूचना (Letter of Intent - LOI) ७ दिनको म्याद दिई सबैलाई जानकारी गराउने; उजुरी नपरेमा १५ दिनभित्र कार्यसम्पादन जमानत लिई सम्झौता गर्न बोलाउने अनिवार्य प्रक्रिया।"
  },
  {
    "id": "t30",
    "number": 30,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "सम्झौता कार्यान्वयन तथा व्यवस्थापन",
    "titleEn": "Contract Implementation and Management",
    "actSections": "दफा ३९, ५२",
    "ruleSections": "नियम ९९-१०९",
    "coreSummary": "सम्झौता भएपछि कार्य सुरु गर्ने आदेश (Notice to Proceed), आयोजना प्रबन्धक/इन्जिनियरको नियुक्ति, सम्झौताका सर्तको परिपालना, जोखिम बाँडफाँड र नियमित अनुगमन सम्बन्धी व्यवस्था।"
  },
  {
    "id": "t31",
    "number": 31,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "कार्यतालिका तथा कार्यसम्पादन प्रगति",
    "titleEn": "Work Schedule and Performance Milestones",
    "actSections": "दफा ५२",
    "ruleSections": "नियम १००, १०२",
    "coreSummary": "सम्झौता भएको निश्चित दिनभित्र निर्माण व्यवसायीले विस्तृत कार्यतालिका (Work Schedule/CPM) पेस गर्नुपर्ने, माइलस्टोन प्रगति अनुगमन गर्ने र निर्धारित माइलस्टोन पूरा नभएमा अग्रिम भुक्तानी वा रनिङ बिल कट्टी गर्ने नियम।"
  },
  {
    "id": "t32",
    "number": 32,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "अग्रिम भुक्तानी (Mobilization Advance)",
    "titleEn": "Mobilization Advance Payment",
    "actSections": "दफा ५२",
    "ruleSections": "नियम ५५",
    "coreSummary": "सम्झौता रकमको बढीमा १०% वा विशेष अवस्थामा २०% सम्म बैंक जमानत लिई अग्रिम भुक्तानी दिइने; काम सुरु भएपछि प्रत्येक रनिङ बिलबाट समानुपातिक रूपमा कट्टी गरी अन्तिम बिल अगावै पूर्ण फर्स्योट गर्नुपर्ने।"
  },
  {
    "id": "t33",
    "number": 33,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "रनिङ बिल तथा अन्तिम भुक्तानी",
    "titleEn": "Running Bill and Final Payment Proceedings",
    "actSections": "दफा ५२",
    "ruleSections": "नियम १२५, १२६",
    "coreSummary": "सम्पन्न भएको कामको नापजाँच (Measurement Book - MB), ल्याब टेस्ट रिपोर्ट, ५% धरौटी कट्टी (Retention Money), कर/भ्याट कट्टी गरी ३० दिनभित्र भुक्तानी दिने र कार्य सम्पन्न प्रतिवेदन (Completion Report) पछि अन्तिम भुक्तानी।"
  },
  {
    "id": "t34",
    "number": 34,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "मूल्य समायोजन (Price Adjustment Formula)",
    "titleEn": "Price Adjustment and Escalation",
    "actSections": "दफा ५५",
    "ruleSections": "नियम ११८",
    "coreSummary": "१२ महिनाभन्दा बढी अवधिका सम्झौतामा श्रम, इन्धन र निर्माण सामग्रीको मूल्यवृद्धि समायोजन सूत्र अनुसार हिसाब गरिने; १०% भन्दा बढी मूल्य वृद्धि भएमा समायोजन हुने र सम्झौता रकमको २५% भन्दा बढी हुन नहुने।"
  },
  {
    "id": "t35",
    "number": 35,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "भेरिएसन आदेश तथा परिमाण परिवर्तन",
    "titleEn": "Variation Order and Scope Alteration",
    "actSections": "दफा ५४",
    "ruleSections": "नियम १११, ११२",
    "coreSummary": "मूल कामको प्रकृति नबदलिने गरी ५% सम्म राजपत्र अनंकित प्रमुख वा शाखा प्रमुख, १०% सम्म कार्यालय प्रमुख, १५% सम्म विभागीय प्रमुख र २५% सम्म सचिव/मन्त्रालयबाट स्वीकृत गर्नुपर्ने कानुनी सीमा।"
  },
  {
    "id": "t36",
    "number": 36,
    "group": "samjhauta-karyannawayan",
    "groupTitle": "सम्झौता व्यवस्थापन, म्याद थप र भेरिएसन",
    "title": "म्याद थप तथा त्यसका आधार (Extension of Time)",
    "titleEn": "Extension of Contract Period (EOT)",
    "actSections": "दफा ४६, ५६",
    "ruleSections": "नियम १२०",
    "coreSummary": "काबू बाहिरको परिस्थिति, साइट उपलब्ध नहुनु वा डिजाइन परिवर्तनका कारण म्याद नाघ्नुअघि कम्तीमा २१ दिन बाँकी छँदै निवेदन दिनुपर्ने; मनासिब कारण भएमा मात्र स्वीकृत अधिकारीबाट म्याद थप हुने प्रक्रिया।"
  },
  {
    "id": "t37",
    "number": 37,
    "group": "gunastar-bhuktani",
    "groupTitle": "नापजाँच, निरीक्षण, बिल भुक्तानी र क्षतिपूर्ति",
    "title": "क्षतिपूर्ति तथा पूर्वनिर्धारित क्षतिपूर्ति (Liquidated Damages)",
    "titleEn": "Liquidated Damages (LD) and Compensation",
    "actSections": "दफा ५२",
    "ruleSections": "नियम १२१",
    "coreSummary": "ठेकेदारको आफ्नै ढिलाइले म्यादभित्र काम सम्पन्न नगरेमा प्रतिदिन सम्झौता मूल्यको ०.०५% का दरले अधिकतम १०% सम्म पूर्वनिर्धारित क्षतिपूर्ति कट्टी गरिने; १०% पुगेपछि सम्झौता अन्त्य गर्न सकिने व्यवस्था।"
  },
  {
    "id": "t38",
    "number": 38,
    "group": "gunastar-bhuktani",
    "groupTitle": "नापजाँच, निरीक्षण, बिल भुक्तानी र क्षतिपूर्ति",
    "title": "निर्माण कार्यको नापजाँच तथा गुणस्तर नियन्त्रण",
    "titleEn": "Measurement of Works and Quality Control",
    "actSections": "दफा ३९",
    "ruleSections": "नियम १०९, ११०",
    "coreSummary": "इन्जिनियर वा प्राविधिक कर्मचारीले नापी किताब (Measurement Book) मा अनिवार्य रेकर्ड राख्नुपर्ने, गुणस्तर परीक्षण प्रतिवेदन (Lab Test) संलग्न हुनुपर्ने र गलत नापजाँच गरेमा प्राविधिक कर्मचारी नै व्यक्तिगत जिम्मेवार हुने।"
  },
  {
    "id": "t39",
    "number": 39,
    "group": "gunastar-bhuktani",
    "groupTitle": "नापजाँच, निरीक्षण, बिल भुक्तानी र क्षतिपूर्ति",
    "title": "सामान तथा सेवाको निरीक्षण र स्वीकृति",
    "titleEn": "Inspection and Acceptance of Goods and Services",
    "actSections": "दफा ३९",
    "ruleSections": "नियम १२२, १२३",
    "coreSummary": "दाखिला भएका मालसामानको निरीक्षण समिति गठन गरी स्पेसिफिकेसन अनुसार भए नभएको जाँच्ने, दाखिला प्रतिवेदन (Goods Acceptance Report) जारी गर्ने र त्रुटिपूर्ण सामान फिर्ता पठाउने कानुनी कार्यविधि।"
  },
  {
    "id": "t40",
    "number": 40,
    "group": "gunastar-bhuktani",
    "groupTitle": "नापजाँच, निरीक्षण, बिल भुक्तानी र क्षतिपूर्ति",
    "title": "सम्झौताको अन्त्य तथा रद्द (Termination of Contract)",
    "titleEn": "Contract Termination and Remedies",
    "actSections": "दफा ५९",
    "ruleSections": "नियम १२८, १२९",
    "coreSummary": "ठेकेदार टाट पल्टिएमा, चरम लापरबाही गरी काम रोकेमा, LD १०% पुगेमा वा भ्रष्टाचार/मिलेमतो गरेमा १४ दिने पूर्वसूचना दिई सम्झौता अन्त्य गर्ने, कार्यसम्पादन जमानत जफत गर्ने र बाँकी कामको क्षतिपूर्ति असुल गर्ने।"
  },
  {
    "id": "t41",
    "number": 41,
    "group": "vivad-punaravalokan",
    "groupTitle": "विवाद समाधान, पुनरावलोकन र कालोसूची",
    "title": "विवाद समाधान (Adjudicator, DRC, Arbitration)",
    "titleEn": "Dispute Resolution Mechanisms",
    "actSections": "दफा ५८",
    "ruleSections": "नियम १३०, १३१, १३२, १३३, १३४",
    "coreSummary": "पारस्परिक सहमति नभएमा रु १० करोड सम्मको काममा एड्जुडिकेटर (Adjudicator), रु १० करोड माथि विवाद समाधान समिति (DRC) र त्यसबाट पनि समाधान नभएमा नेपाल मध्यस्थता ऐन २०५८ बमोजिम मध्यस्थता (Arbitration) मा जाने।"
  },
  {
    "id": "t42",
    "number": 42,
    "group": "vivad-punaravalokan",
    "groupTitle": "विवाद समाधान, पुनरावलोकन र कालोसूची",
    "title": "पुनरावलोकन तथा उजुरीसम्बन्धी व्यवस्था",
    "titleEn": "Administrative Review and Procurement Review Committee (PPRC)",
    "actSections": "दफा ४७, ४८, ४९, ५०",
    "ruleSections": "नियम १००-१०८",
    "coreSummary": "बोलपत्र स्वीकृति आशयको सूचना प्रकाशित भएको ७ दिनभित्र कार्यालय प्रमुख समक्ष उजुरी; कार्यालय प्रमुखको निर्णयमा चित्त नबुझे ७ दिनभित्र पुनरावलोकन समिति (PPRC केशरमहल) मा कबोल रकमको ०.१५% नगद धरौटी राखी उजुरी दिने प्रक्रिया।"
  },
  {
    "id": "t43",
    "number": 43,
    "group": "vivad-punaravalokan",
    "groupTitle": "विवाद समाधान, पुनरावलोकन र कालोसूची",
    "title": "कालोसूचीमा राख्ने प्रक्रिया (Blacklisting)",
    "titleEn": "Blacklisting Proceedings and Effects",
    "actSections": "दफा ६३",
    "ruleSections": "नियम १४१, १४२, १४३, १४४, १४५",
    "coreSummary": "सम्झौता गर्न नआएमा, सम्झौता बमोजिम काम नगरी बीचैमा छाडेमा वा जालसाजी गरेमा सार्वजनिक निकायले सिफारिस गर्ने र PPMO ले १ वर्षदेखि ३ वर्षसम्म कालोसूचीमा राखी कुनै पनि सरकारी खरिदमा भाग लिन प्रतिबन्ध लगाउने।"
  },
  {
    "id": "t44",
    "number": 44,
    "group": "vivad-punaravalokan",
    "groupTitle": "विवाद समाधान, पुनरावलोकन र कालोसूची",
    "title": "सार्वजनिक खरिद अनुगमन कार्यालयको भूमिका तथा अधिकार",
    "titleEn": "Role and Authority of Public Procurement Monitoring Office (PPMO)",
    "actSections": "दफा ६४, ६५",
    "ruleSections": "नियम १४६, १४७",
    "coreSummary": "प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय मातहत रही खरिद नीतिको तर्जुमा, नमुना बोलपत्र कागजात (SBD) जारी, e-GP प्रणाली सञ्चालन, सरकारी निकायहरूलाई राय/परामर्श प्रदान, अनुगमन र कालोसूची कार्यान्वयन गर्ने केन्द्रीय निकाय।"
  },
  {
    "id": "t45",
    "number": 45,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "मूल्याङ्कन समिति तथा अन्य समितिको गठन र जिम्मेवारी",
    "titleEn": "Constitution and Duties of Evaluation and Inspection Committees",
    "actSections": "दफा २२",
    "ruleSections": "नियम ६०, १२२",
    "coreSummary": "कार्यालय प्रमुख वा निजले तोकेको अधिकृत (संयोजक), आर्थिक प्रशासन प्रमुख (सदस्य), र प्राविधिक अधिकृत (सदस्य-सचिव) रहेको तीन सदस्यीय मूल्याङ्कन समिति गठन र निष्पक्ष परीक्षणको कानूनी दायित्व।"
  },
  {
    "id": "t46",
    "number": 46,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "अधिकार प्रत्यायोजन तथा स्वीकृति अधिकार",
    "titleEn": "Delegation of Powers and Financial Approval Thresholds",
    "actSections": "दफा ६८",
    "ruleSections": "नियम १४८",
    "coreSummary": "सार्वजनिक निकायको प्रमुखले आफूमा निहित खरिद सम्बन्धी अधिकार लिखित रूपमा मातहतका अधिकृतलाई प्रत्यायोजन गर्न सक्ने; तर मुख्य स्वीकृति र कालोसूची सिफारिसको अधिकार प्रत्यायोजन गर्न नमिल्ने व्यवस्था।"
  },
  {
    "id": "t47",
    "number": 47,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "अभिलेख व्यवस्थापन तथा कागजात संरक्षण",
    "titleEn": "Procurement Records and Document Retention",
    "actSections": "दफा ६५",
    "ruleSections": "नियम १४७",
    "coreSummary": "खरिद सम्बन्धी सम्पूर्ण फाइल, प्रस्ताव, मुचुल्का, मूल्याङ्कन प्रतिवेदन, सम्झौता र भुक्तानी बिलहरू सम्झौता सम्पन्न भएको मितिले कम्तीमा ५ वर्षसम्म सुरक्षित राख्नुपर्ने अनिवार्य कानुनी दायित्व।"
  },
  {
    "id": "t48",
    "number": 48,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "विद्युतीय खरिद प्रणाली (e-GP) सम्बन्धी व्यवस्था",
    "titleEn": "Electronic Government Procurement (e-GP) Directives",
    "actSections": "दफा ६०",
    "ruleSections": "नियम १४०क, १४०ख, १४०ग, १४०घ",
    "coreSummary": "PPMO को केन्द्रीय e-GP पोर्टल (bolpatra.gov.np) मार्फत सूचना प्रकाशन, बोलपत्र खरिद, अनलाइन बिड दाखिला, अनलाइन मुचुल्का, मूल्याङ्कन र आशयको सूचना जारी गर्ने पूर्ण डिजिटल खरिद प्रक्रिया।"
  },
  {
    "id": "t49",
    "number": 49,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "पारदर्शिता, प्रतिस्पर्धा तथा स्वच्छ खरिद (Code of Conduct)",
    "titleEn": "Transparency, Competition and Code of Conduct",
    "actSections": "दफा ६१, ६२",
    "ruleSections": "नियम १४६",
    "coreSummary": "कर्मचारी र बोलपत्रदाता दुवैले पालना गर्नुपर्ने आचारसंहिता: स्वार्थको द्वन्द्व (Conflict of Interest) भएमा संलग्न हुन नहुने, गोप्यता कायम राख्नुपर्ने, घुस/प्रभाव निषेध र मिलेमतो विरुद्ध शून्य सहनशीलता।"
  },
  {
    "id": "t50",
    "number": 50,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "अनियमितता, कसुर, सजाय तथा जिम्मेवारी",
    "titleEn": "Offences, Penalties and Accountability",
    "actSections": "दफा ६३, ६७",
    "ruleSections": "नियम १४५",
    "coreSummary": "कानून विपरीत खरिद गर्ने कर्मचारी उपर विभागीय कारबाही, भ्रष्टाचार निवारण ऐन बमोजिम मुद्दा, धरौटी जफत, क्षतिपूर्ति असुल र गलत गर्ने बोलपत्रदातालाई कालोसूची र क्षतिपूर्ति असुली।"
  },
  {
    "id": "t51",
    "number": 51,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "लेखापरीक्षण, बेरुजु तथा वित्तीय जोखिम",
    "titleEn": "Audit, Irregularities (Beruju) and Fiduciary Risk",
    "actSections": "दफा ३, ५, ६५",
    "ruleSections": "नियम १४७, आर्थिक कार्यविधि ऐन",
    "coreSummary": "आन्तरिक तथा अन्तिम लेखापरीक्षण (महालेखापरीक्षक) ले औँल्याउने प्रमुख खरिद बेरुजुहरू—विभाजन गरी खरिद, बिना प्रतिस्पर्धा सोझै खरिद, अत्यधिक भेरिएसन, म्याद थप बिना काम, र असुलउपर गर्नुपर्ने जोखिमहरू।"
  },
  {
    "id": "t52",
    "number": 52,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "ऐन तथा नियमावलीका विशेष व्यवस्था, अपवाद र निषेध",
    "titleEn": "Special Provisions, Legal Exceptions and Prohibitions",
    "actSections": "दफा ६६, ६७",
    "ruleSections": "नियम १४९, १५०",
    "coreSummary": "राष्ट्रिय सुरक्षा, प्रतिरक्षा सामग्री, दैवी प्रकोप, आपतकालीन उद्धार कार्यमा मन्त्रिपरिषद्को निर्णयबाट हुने विशेष खरिद र ऐनले तोकेका ४८ वटा कडा निषेधहरू र ९० वटा कानुनी अपवादहरू।"
  },
  {
    "id": "t53",
    "number": 53,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "अनुसूची, नमुना फाराम तथा ढाँचासम्बन्धी व्यवस्था",
    "titleEn": "Schedules, Standard Forms and Formats",
    "actSections": "ऐनका विभिन्न दफा",
    "ruleSections": "अनुसूची १ देखि १३",
    "coreSummary": "बोलपत्र जमानत ढाँचा (अनुसूची २), कार्यसम्पादन जमानत (अनुसूची ३), अग्रिम भुक्तानी जमानत (अनुसूची ४), लागत अनुमान फाराम, सम्झौता ढाँचा र PPMO का मानक फारामहरूको कानुनी मान्यता।"
  },
  {
    "id": "t54",
    "number": 54,
    "group": "sushasan-kanuni-byawastha",
    "groupTitle": "संस्थागत संरचना, आचरण, e-GP, अपवाद र अनुसूची",
    "title": "ऐन तथा नियमावलीका अन्य सबै छुटेका विषय र अद्यावधिक नजिरहरू",
    "titleEn": "Miscellaneous Provisions and Updated PPMO/PPRC Precedents",
    "actSections": "दफा ६९, ७०",
    "ruleSections": "नियम १५१, १५२",
    "coreSummary": "नियम बनाउने अधिकार, निर्देशिका जारी गर्ने अधिकार, खारेजी र बचाउ, र सार्वजनिक खरिद पुनरावलोकन समिति (PPRC) का महत्वपूर्ण नजिरहरू र PPMO का नवीनतम परिपत्रहरू।"
  }
];

// -------------------------------------------------------------
// २. तह १: अति छोटो प्रश्नोत्तर (Level A: Very Short Fact-Based Q&A)
// -------------------------------------------------------------
export const VERY_SHORT_QA: VeryShortQA[] = [
  {
    "id": "qa-a-1",
    "topicId": "t1",
    "topicNumber": 1,
    "question": "सार्वजनिक खरिद ऐन, २०६३ बमोजिम 'स्वदेशी मालसामान' (Domestic Goods) भन्नाले के बुझिन्छ?",
    "answer": "नेपाल राज्यभित्र उत्पादन भएको वा कम्तीमा ३० (तीस) प्रतिशत मूल्य अभिवृद्धि (Value Added) भएको मालसामानलाई स्वदेशी मालसामान भनिन्छ।",
    "keyMetric": "कम्तीमा ३०% मूल्य अभिवृद्धि",
    "actRef": "दफा २(न१)",
    "ruleRef": "नियम १८(ख)",
    "exceptionOrNote": "अन्तर्राष्ट्रिय बोलपत्रमा स्वदेशी उत्पादकलाई १५% सम्म डोमेस्टिक प्रिफरेन्स (Domestic Preference) दिन सकिन्छ।"
  },
  {
    "id": "qa-a-2",
    "topicId": "t1",
    "topicNumber": 1,
    "question": "ऐनको विपरीत हुने गरी गरिएको सार्वजनिक खरिदको कानूनी हैसियत के हुन्छ?",
    "answer": "सार्वजनिक खरिद ऐन, २०६३ को दफा ३ प्रतिकूल हुने गरी गरिएको जुनसुकै सार्वजनिक खरिद स्वतः अमान्य र बदर (Null and Void) हुन्छ।",
    "keyMetric": "स्वतः बदर र अमान्य",
    "actRef": "दफा ३",
    "ruleRef": "नियम ३",
    "exceptionOrNote": "यसरी गरिएको खरिदबाट सरकारी कोषमा हानि-नोक्सानी भएमा संलग्न पदाधिकारीबाट असुलउपर गरिन्छ।"
  },
  {
    "id": "qa-a-3",
    "topicId": "t4",
    "topicNumber": 4,
    "question": "खरिद गुरुयोजना (Master Procurement Plan) कुन अवस्थामा तयार गर्नुपर्छ?",
    "answer": "रु १० (दस) करोडभन्दा बढी लागत अनुमान भएको वा १ (एक) वर्षभन्दा बढी अवधि सञ्चालन हुने आयोजनामा अनिवार्य रूपमा खरिद गुरुयोजना बनाउनुपर्छ।",
    "keyMetric": "१० करोड रुपैयाँभन्दा बढी / १ वर्षभन्दा बढी अवधि",
    "actRef": "दफा ६",
    "ruleRef": "नियम ७",
    "exceptionOrNote": "गुरुयोजनालाई प्रत्येक आर्थिक वर्षमा वार्षिक खरिद योजनासँग अद्यावधिक गर्नुपर्छ।"
  },
  {
    "id": "qa-a-4",
    "topicId": "t4",
    "topicNumber": 4,
    "question": "वार्षिक खरिद योजना (Annual Procurement Plan) कति रकमभन्दा माथिको खरिदमा बनाउनु अनिवार्य छ?",
    "answer": "रु १० (दस) लाखभन्दा बढी रकमको खरिद गर्ने प्रत्येक सार्वजनिक निकायले अनिवार्य रूपमा वार्षिक खरिद योजना बनाई स्वीकृत गराउनुपर्छ।",
    "keyMetric": "१० लाख रुपैयाँभन्दा बढी",
    "actRef": "दफा ६",
    "ruleRef": "नियम ८",
    "exceptionOrNote": "बजेट स्वीकृत भएको मितिले १५ दिनभित्र यस्तो योजना स्वीकृत गरिसक्नुपर्छ।"
  },
  {
    "id": "qa-a-5",
    "topicId": "t7",
    "topicNumber": 7,
    "question": "खरिदलाई टुक्र्याउन (Slicing/Splitting) मिल्छ कि मिल्दैन?",
    "answer": "प्रतिस्पर्धा सीमित गर्ने वा खुला बोलपत्रको विधि छल्ने उद्देश्यले खरिदलाई टुक्र्याउन (Slicing) ऐनको दफा ७ बमोजिम पूर्ण रूपमा निषेध गरिएको छ।",
    "keyMetric": "पूर्ण निषेध (Strictly Prohibited)",
    "actRef": "दफा ७",
    "ruleRef": "नियम ८(२), १७",
    "exceptionOrNote": "प्राविधिक वा व्यवस्थापकीय आधारमा प्याकेजिङ (Packaging) गर्न मिल्छ तर त्यो खुला प्रतिस्पर्धा बढाउन हुनुपर्छ।"
  },
  {
    "id": "qa-a-6",
    "topicId": "t11",
    "topicNumber": 11,
    "question": "सिलबन्दी दरभाउपत्र (Sealed Quotation) आह्वान गर्न सकिने अधिकतम आर्थिक सीमा कति हो?",
    "answer": "मालसामान वा निर्माण कार्यको हकमा रु २० (बीस) लाख रुपैयाँसम्म र परामर्श सेवाको हकमा रु ५ (पाँच) लाख रुपैयाँसम्म सिलबन्दी दरभाउपत्रबाट खरिद गर्न सकिन्छ।",
    "keyMetric": "मालसामान/निर्माण: रु २० लाख; परामर्श: रु ५ लाख",
    "actRef": "दफा ४०",
    "ruleRef": "नियम ८४",
    "exceptionOrNote": "सिलबन्दी दरभाउपत्रमा कम्तीमा ३ वटा रीतपूर्वकका दरभाउपत्र नपरेमा प्रक्रिया अघि बढाउन मिल्दैन।"
  },
  {
    "id": "qa-a-7",
    "topicId": "t11",
    "topicNumber": 11,
    "question": "सिलबन्दी दरभाउपत्रको सूचना कति दिनको म्याद दिई प्रकाशन गर्नुपर्छ?",
    "answer": "कम्तीमा १५ (पन्ध्र) दिनको म्याद दिई राष्ट्रिय वा स्थानीय दैनिक पत्रिका तथा निकायको सूचनापाटी/वेबसाइटमा सूचना प्रकाशन गर्नुपर्छ।",
    "keyMetric": "कम्तीमा १५ दिन",
    "actRef": "दफा ४०(२)",
    "ruleRef": "नियम ८४(२)",
    "exceptionOrNote": "पुनः दरभाउपत्र आह्वान गर्दा कम्तीमा ७ दिनको म्याद दिनुपर्छ।"
  },
  {
    "id": "qa-a-8",
    "topicId": "t12",
    "topicNumber": 12,
    "question": "सामान्य अवस्थामा सोझै खरिद (Direct Procurement) गर्न पाइने अधिकतम आर्थिक सीमा कति हो?",
    "answer": "एक आर्थिक वर्षमा एउटै व्यक्ति, फर्म वा कम्पनीबाट रु ५ (पाँच) लाख रुपैयाँसम्मको मालसामान, निर्माण वा सेवा सोझै खरिद गर्न सकिन्छ।",
    "keyMetric": "रु ५ लाख रुपैयाँसम्म",
    "actRef": "दफा ४१(१)(क)",
    "ruleRef": "नियम ८५(१)(क)",
    "exceptionOrNote": "विशेष परिस्थितिमा मन्त्रिपरिषद् वा अधिकारप्राप्त अधिकारीको निर्णयबाट सीमा फरक हुन सक्छ।"
  },
  {
    "id": "qa-a-9",
    "topicId": "t12",
    "topicNumber": 12,
    "question": "विशेष परिस्थिति (Special Circumstances) मा सोझै खरिद गर्न पाइने अधिकतम सीमा कति हो?",
    "answer": "विपद्, महामारी वा आपतकालीन अवस्थामा कार्यालय प्रमुखले रु १० लाख, विभागीय प्रमुखले रु २५ लाख र सोभन्दा माथि मन्त्रालयको सचिवको स्वीकृतिमा सोझै खरिद गर्न सकिन्छ।",
    "keyMetric": "१० लाख / २५ लाख / सचिव स्वीकृतिमा सोभन्दा माथि",
    "actRef": "दफा ४१(१)(घ), ६६",
    "ruleRef": "नियम ८५(४)",
    "exceptionOrNote": "यस्तो खरिद गरेपछि सार्वजनिक खरिद अनुगमन कार्यालय (PPMO) लाई तुरुन्त जानकारी गराउनुपर्छ।"
  },
  {
    "id": "qa-a-10",
    "topicId": "t13",
    "topicNumber": 13,
    "question": "उपभोक्ता समिति वा लाभग्राही समुदायमार्फत अधिकतम कति रकमसम्मको काम गराउन सकिन्छ?",
    "answer": "स्वीकृत लागत अनुमान रु १ (एक) करोड रुपैयाँसम्मको श्रममूलक भौतिक निर्माण कार्य उपभोक्ता समिति मार्फत गराउन सकिन्छ।",
    "keyMetric": "रु १ करोड रुपैयाँसम्म",
    "actRef": "दफा ४२",
    "ruleRef": "नियम ९७(१)",
    "exceptionOrNote": "उपभोक्ता समितिले हेभी मेसिनरी (डोजर, एक्साभेटर) प्रयोग गर्न वा ठेकेदारलाई पेटी ठेक्का दिन पूर्ण प्रतिबन्ध छ।"
  },
  {
    "id": "qa-a-11",
    "topicId": "t10",
    "topicNumber": 10,
    "question": "१६औँ संशोधन अनुसार राष्ट्रिय खुला बोलपत्र (NCB) मा स्वदेशी व्यवसायी बीच मात्र प्रतिस्पर्धा हुने सीमा कति हो?",
    "answer": "स्वीकृत लागत अनुमान रु २ करोडदेखि रु ५ (पाँच) अर्ब रुपैयाँसम्म भएका निर्माण कार्यमा नेपाली निर्माण व्यवसायीहरू बीच मात्र प्रतिस्पर्धा गराउनुपर्छ।",
    "keyMetric": "रु २ करोड देखि रु ५ अर्ब सम्म",
    "actRef": "दफा ८, १४",
    "ruleRef": "नियम ३१ङ(१)",
    "exceptionOrNote": "रु ५ अर्बभन्दा माथि मात्र अन्तर्राष्ट्रिय खुला बोलपत्र (ICB) आह्वान गर्न पाइन्छ।"
  },
  {
    "id": "qa-a-12",
    "topicId": "t20",
    "topicNumber": 20,
    "question": "पहिलो पटक राष्ट्रिय तथा अन्तर्राष्ट्रिय खुला बोलपत्र आह्वान गर्दा कति दिनको म्याद दिनुपर्छ?",
    "answer": "राष्ट्रिय खुला बोलपत्रको हकमा कम्तीमा ३० (तीस) दिन र अन्तर्राष्ट्रिय खुला बोलपत्रको हकमा कम्तीमा ४५ (पैँतालीस) दिनको म्याद दिनुपर्छ।",
    "keyMetric": "राष्ट्रिय: ३० दिन; अन्तर्राष्ट्रिय: ४५ दिन",
    "actRef": "दफा १४(४)",
    "ruleRef": "नियम ४४, ४५",
    "exceptionOrNote": "दोस्रो पटक आह्वान गर्दा राष्ट्रियमा १५ दिन र अन्तर्राष्ट्रियमा २१ दिनको म्याद दिन सकिन्छ।"
  },
  {
    "id": "qa-a-13",
    "topicId": "t21",
    "topicNumber": 21,
    "question": "बोलपत्र जमानत (Bid Security) बापत कति रकम माग्नुपर्छ र यसको ग्राह्य अवधि कति हुन्छ?",
    "answer": "लागत अनुमानको २% देखि ३% रकम जमानत माग्नुपर्छ; यसको ग्राह्य अवधि बोलपत्रको मान्यता अवधि (Bid Validity) भन्दा कम्तीमा ३० दिन बढी हुनुपर्छ।",
    "keyMetric": "२% देखि ३% (मान्यता अवधि + ३० दिन)",
    "actRef": "दफा १८",
    "ruleRef": "नियम ५२",
    "exceptionOrNote": "नगद वा 'क' वर्गको वाणिज्य बैंक/विकास बैंकले जारी गरेको बैंक ग्यारेन्टी मान्य हुन्छ।"
  },
  {
    "id": "qa-a-14",
    "topicId": "t21",
    "topicNumber": 21,
    "question": "कार्यसम्पादन जमानत (Performance Security) को सामान्य दर कति हो?",
    "answer": "कबोल रकम (कर बाहेक वा सहित SBD अनुसार) को ५ (पाँच) प्रतिशत रकम बराबर कार्यसम्पादन जमानत लिनुपर्छ।",
    "keyMetric": "कबोल रकमको ५ प्रतिशत",
    "actRef": "दफा २८",
    "ruleRef": "नियम ५३",
    "exceptionOrNote": "१५% भन्दा बढी घटेर कबोल परेमा थप कार्यसम्पादन जमानत (APS) समेत लिनुपर्छ।"
  },
  {
    "id": "qa-a-15",
    "topicId": "t21",
    "topicNumber": 21,
    "question": "थप कार्यसम्पादन जमानत (Additional Performance Security - APS) कुन अवस्थामा कति लिनुपर्छ?",
    "answer": "लागत अनुमान भन्दा १५% भन्दा बढी घटेर कबोल गरेमा: (लागत अनुमानको ८५% - कबोल रकम) को ५०% रकम सामान्य ५% जमानतमा थप गरी लिनुपर्छ।",
    "keyMetric": "५% + [(८५% लागत अनुमान - कबोल रकम) × ५०%]",
    "actRef": "दफा २८",
    "ruleRef": "नियम ५३(२), ६५च",
    "exceptionOrNote": "१६औँ संशोधन अनुसार ३०% भन्दा बढी घटेका बोलपत्र भने स्वतः मूल्याङ्कनबाटै हटाइन्छन्।"
  },
  {
    "id": "qa-a-16",
    "topicId": "t28",
    "topicNumber": 28,
    "question": "१६औँ संशोधन अनुसार लागत अनुमान भन्दा कति प्रतिशत बढी घटेको बोलपत्र स्वतः खारेज (Disqualified) हुन्छ?",
    "answer": "स्वीकृत लागत अनुमान भन्दा ३० (तीस) प्रतिशतभन्दा बढी घटेर कबोल गर्ने बोलपत्रदाता मूल्याङ्कन प्रक्रियाबाटै स्वतः हटाइन्छ (Disqualified)।",
    "keyMetric": "३० प्रतिशत भन्दा बढी घटेको (30% Cut-off)",
    "actRef": "दफा २५(७ख)",
    "ruleRef": "नियम ६५च(४क)",
    "exceptionOrNote": "यस व्यवस्थाले अस्वाभाविक न्यून बिडिङ (Abnormally Low Bidding) लाई पूर्ण नियन्त्रण गरेको छ।"
  },
  {
    "id": "qa-a-17",
    "topicId": "t28",
    "topicNumber": 28,
    "question": "औसत अङ्क विधि (Average Bidding Method) अनुसार कुन बोलपत्रदाता छनोट हुन्छ?",
    "answer": "३०% भन्दा बढी घटेकालाई हटाएपछि बाँकी रहेका सारभूत रूपमा प्रभावग्राही बोलपत्रहरूको औसत अङ्क (Average Price) निकालिन्छ र सो औसत अङ्कसँग सबैभन्दा नजिक भएको बोलपत्रदाता छनोट हुन्छ।",
    "keyMetric": "औसत अङ्कसँग निकटतम (Closest to Average)",
    "actRef": "दफा २५(५क), २५(७क)",
    "ruleRef": "नियम ३१ज, ६५च",
    "exceptionOrNote": "यदि दुई बोलपत्र बराबर दुरीमा भएमा कम कबोल गर्नेलाई प्राथमिकता दिइन्छ।"
  },
  {
    "id": "qa-a-18",
    "topicId": "t29",
    "topicNumber": 29,
    "question": "बोलपत्र स्वीकृत गर्ने आशयको सूचना (Letter of Intent - LOI) को म्याद कति दिन हुन्छ?",
    "answer": "बोलपत्र स्वीकृत गर्ने आशयको सूचना (LOI) राष्ट्रिय बोलपत्रमा कम्तीमा ७ (सात) दिन र अन्तर्राष्ट्रिय बोलपत्रमा कम्तीमा १५ (पन्ध्र) दिनको म्याद दिई जारी गर्नुपर्छ।",
    "keyMetric": "राष्ट्रिय: ७ दिन; अन्तर्राष्ट्रिय: १५ दिन",
    "actRef": "दफा २७(२)",
    "ruleRef": "नियम ६७",
    "exceptionOrNote": "यो ७ दिनको अवधि अन्य बोलपत्रदातालाई चित्त नबुझेमा कार्यालय प्रमुख समक्ष पुनरावलोकन निवेदन दिन दिइएको म्याद हो।"
  },
  {
    "id": "qa-a-19",
    "topicId": "t29",
    "topicNumber": 29,
    "question": "LOI को म्यादभित्र उजुरी नपरेमा सम्झौता गर्न कति दिनको म्याद दिई पत्र काट्नुपर्छ?",
    "answer": "सफल बोलपत्रदातालाई १५ (पन्ध्र) दिनको म्याद दिई कार्यसम्पादन जमानत दाखिला गरी खरिद सम्झौता गर्न आउन पत्र (Letter of Acceptance) दिनुपर्छ।",
    "keyMetric": "१५ दिनभित्र सम्झौता",
    "actRef": "दफा २७(३)",
    "ruleRef": "नियम ६८",
    "exceptionOrNote": "१५ दिनभित्र सम्झौता गर्न नआएमा बोलपत्र जमानत जफत गरी दोस्रो प्राथमिकता प्राप्त बोलपत्रदातालाई सम्झौता गर्न बोलाउन सकिन्छ।"
  },
  {
    "id": "qa-a-20",
    "topicId": "t32",
    "topicNumber": 32,
    "question": "निर्माण कार्यमा मोबिलाइजेसन पेश्की (Advance Payment) अधिकतम कति प्रतिशतसम्म दिन सकिन्छ?",
    "answer": "सम्झौता रकमको बढीमा १०% (दश प्रतिशत) सम्म, र विशेष अवस्थामा औचित्य पुष्टि गरी बढीमा २०% सम्म शतप्रतिशत बैंक ग्यारेन्टी लिई दिन सकिन्छ।",
    "keyMetric": "सामान्य १०%; अधिकतम २०% सम्म (१००% बैंक जमानतमा)",
    "actRef": "दफा ५२",
    "ruleRef": "नियम ५५",
    "exceptionOrNote": "पहिलो किस्ता सम्झौतापछि र दोस्रो किस्ता कार्यस्थलमा जनशक्ति तथा उपकरण परिचालन गरेपछि मात्र दिइन्छ।"
  },
  {
    "id": "qa-a-21",
    "topicId": "t33",
    "topicNumber": 33,
    "question": "रनिङ बिल भुक्तानी गर्दा धरौटी कट्टी (Retention Money) कति प्रतिशत गर्नुपर्छ?",
    "answer": "प्रत्येक रनिङ बिलको भुक्तानीयोग्य रकमबाट ५ (पाँच) प्रतिशत रकम धरौटी बापत कट्टी गर्नुपर्छ।",
    "keyMetric": "५ प्रतिशत",
    "actRef": "दफा ५२",
    "ruleRef": "नियम १२५, १२६",
    "exceptionOrNote": "त्रुटि सच्याउने अवधि (DLP) समाप्त भई अन्तिम परीक्षण प्रतिवेदन स्वीकृत भएपछि मात्र यो ५% रकम फिर्ता हुन्छ।"
  },
  {
    "id": "qa-a-22",
    "topicId": "t35",
    "topicNumber": 35,
    "question": "कार्यालय प्रमुखले अधिकतम कति प्रतिशतसम्म भेरिएसन आदेश (Variation Order) स्वीकृत गर्न सक्छन्?",
    "answer": "राजपत्राङ्कित प्रथम श्रेणीको कार्यालय प्रमुखले मूल सम्झौता मूल्यको अधिकतम १० (दश) प्रतिशतसम्म भेरिएसन आदेश स्वीकृत गर्न सक्छन्।",
    "keyMetric": "१० प्रतिशतसम्म",
    "actRef": "दफा ५४",
    "ruleRef": "नियम १११(१)(ख)",
    "exceptionOrNote": "५% सम्म शाखा प्रमुख/रा.प.अनं. प्रमुख, १५% सम्म विभागीय प्रमुख र २५% सम्म सचिव/मन्त्रालयबाट स्वीकृत हुनुपर्छ।"
  },
  {
    "id": "qa-a-23",
    "topicId": "t35",
    "topicNumber": 35,
    "question": "भेरिएसन आदेश जारी गर्दा अधिकतम कति प्रतिशतसम्मको कानूनी सीमा तोकिएको छ?",
    "answer": "सामान्य अवस्थामा १५% र विशेष/जटिल परिस्थितिमा मन्त्रिपरिषद्/सचिवस्तरबाट गरी अधिकतम २५ (पच्चीस) प्रतिशतभन्दा बढी भेरिएसन गर्न पाइँदैन।",
    "keyMetric": "सामान्य १५%; अधिकतम २५%",
    "actRef": "दफा ५४",
    "ruleRef": "नियम १११(३)",
    "exceptionOrNote": "२५% भन्दा बढी भेरिएसन गर्नुपर्ने अवस्था भए सम्झौता अन्त्य गरी नयाँ बोलपत्र आह्वान गर्नुपर्छ।"
  },
  {
    "id": "qa-a-24",
    "topicId": "t36",
    "topicNumber": 36,
    "question": "म्याद थप (Extension of Time) का लागि निर्माण व्यवसायीले कति दिनअगावै निवेदन दिनुपर्छ?",
    "answer": "सम्झौताको म्याद समाप्त हुनुभन्दा कम्तीमा २१ (एक्काइस) दिन अगावै कारण र प्रमाणसहित कार्यालय प्रमुख समक्ष निवेदन दिनुपर्छ।",
    "keyMetric": "म्याद सकिनुभन्दा कम्तीमा २१ दिन अगावै",
    "actRef": "दफा ४६, ५६",
    "ruleRef": "नियम १२०(१)",
    "exceptionOrNote": "म्याद गुज्रिएपछि दिइएको निवेदन स्वतः कानूनविपरीत मानिन्छ।"
  },
  {
    "id": "qa-a-25",
    "topicId": "t37",
    "topicNumber": 37,
    "question": "पूर्वनिर्धारित क्षतिपूर्ति (Liquidated Damages - LD) को दैनिक दर र अधिकतम सीमा कति हो?",
    "answer": "प्रतिदिन सम्झौता मूल्यको ०.०५ (शून्य दशमलव शून्य पाँच) प्रतिशतका दरले अधिकतम १० (दश) प्रतिशतसम्म लिक्विडेटेड ड्यामेज कट्टी गर्न सकिन्छ।",
    "keyMetric": "प्रतिदिन ०.०५%; अधिकतम १०% (२०० दिन)",
    "actRef": "दफा ५२",
    "ruleRef": "नियम १२१",
    "exceptionOrNote": "१०% पुगेपछि सार्वजनिक निकायले सोझै सम्झौता अन्त्य (Termination) गर्न सक्ने कानूनी अधिकार रहन्छ।"
  },
  {
    "id": "qa-a-26",
    "topicId": "t42",
    "topicNumber": 42,
    "question": "सार्वजनिक खरिद पुनरावलोकन समिति (PPRC) मा उजुरी गर्दा कति धरौटी राख्नुपर्छ?",
    "answer": "आफूले कबोल गरेको रकमको ०.१५ (शून्य दशमलव एक पाँच) प्रतिशत रकम बराबरको नगद धरौटी वा सो बराबरको बैंक जमानत राख्नुपर्छ।",
    "keyMetric": "कबोल रकमको ०.१५ प्रतिशत",
    "actRef": "दफा ४९",
    "ruleRef": "नियम १०३",
    "exceptionOrNote": "उजुरी झुट्टा ठहरिएमा सो धरौटी रकम जफत भई सरकारी राजस्वमा दाखिला हुन्छ।"
  },
  {
    "id": "qa-a-27",
    "topicId": "t42",
    "topicNumber": 42,
    "question": "पुनरावलोकन समिति (PPRC) ले उजुरी परेको कति दिनभित्र निर्णय दिइसक्नुपर्छ?",
    "answer": "सम्पूर्ण कागजात प्राप्त भएको मितिले ३० (तीस) दिनभित्र पुनरावलोकन समितिले कारणसहितको निर्णय दिइसक्नुपर्छ।",
    "keyMetric": "३० दिनभित्र",
    "actRef": "दफा ५०(१)",
    "ruleRef": "नियम १०६",
    "exceptionOrNote": "समितिको निर्णय अन्तिम हुन्छ र सोविरुद्ध चित्त नबुझे उच्च अदालतमा पुनरावेदन लाग्छ।"
  },
  {
    "id": "qa-a-28",
    "topicId": "t43",
    "topicNumber": 43,
    "question": "कालोसूची (Blacklisting) मा राख्ने अवधि कति वर्षसम्म हुन्छ?",
    "answer": "कसुरको गाम्भीर्यता हेरी १ (एक) वर्षदेखि बढीमा ३ (तीन) वर्षसम्म कालोसूचीमा राख्न सकिन्छ।",
    "keyMetric": "१ वर्षदेखि ३ वर्षसम्म",
    "actRef": "दफा ६३(१)",
    "ruleRef": "नियम १४१",
    "exceptionOrNote": "कालोसूचीमा परेको व्यक्ति वा कम्पनीले सो अवधिभर कुनै पनि सरकारी निकायको खरिदमा भाग लिन पाउँदैन।"
  },
  {
    "id": "qa-a-29",
    "topicId": "t47",
    "topicNumber": 47,
    "question": "खरिद सम्बन्धी अभिलेख तथा कागजात कति वर्षसम्म सुरक्षित राख्नुपर्छ?",
    "answer": "खरिद सम्झौता सम्पन्न भएको मितिले कम्तीमा ५ (पाँच) वर्षसम्म सम्पूर्ण खरिद कागजात सुरक्षित राख्नुपर्छ।",
    "keyMetric": "कम्तीमा ५ वर्षसम्म",
    "actRef": "दफा ६५",
    "ruleRef": "नियम १४७",
    "exceptionOrNote": "लेखापरीक्षण, अदालत वा पुनरावलोकन समितिमा विवाद विचाराधीन रहेका कागजात मुद्दा किनारा नभएसम्म धुल्याउन पाइँदैन।"
  },
  {
    "id": "qa-a-30",
    "topicId": "t34",
    "topicNumber": 34,
    "question": "मूल्य समायोजन (Price Adjustment) पाउन न्यूनतम कति अवधिको सम्झौता हुनुपर्छ?",
    "answer": "कम्तीमा १२ (बाह्र) महिनाभन्दा बढी कार्यसम्पादन अवधि भएको सम्झौतामा मात्र मूल्य समायोजन लागू हुन्छ।",
    "keyMetric": "१२ महिनाभन्दा बढी अवधि",
    "actRef": "दफा ५५",
    "ruleRef": "नियम ११८",
    "exceptionOrNote": "मूल्य वृद्धि १०% भन्दा बढी भएको अवस्थामा मात्र सूत्र अनुसार समायोजन रकम भुक्तानी गरिन्छ।"
  }
];

// -------------------------------------------------------------
// ३. तह २: छोटो प्रश्नोत्तर (Level B: Short Procedural & Explanatory Q&A)
// -------------------------------------------------------------
export const SHORT_QA: ShortQA[] = [
  {
    "id": "qa-b-1",
    "topicId": "t4",
    "topicNumber": 4,
    "question": "वार्षिक खरिद योजना (Annual Procurement Plan) को उद्देश्य र यसमा समावेश हुनुपर्ने मुख्य विवरणहरू के-के हुन्?",
    "purposeAndSignificance": "खरिद प्रक्रियालाई व्यवस्थित, अनुमानयोग्य र समयमै सम्पन्न गराउन वार्षिक बजेटसँग तादाम्यता मिलाई खरिद योजना तर्जुमा गरिन्छ। यसले अन्तिम समयमा हुने हतारको खरिद र बजेट फ्रिज हुने जोखिम न्यूनीकरण गर्दछ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ६ तथा सार्वजनिक खरिद नियमावली, २०६४ को नियम ८।",
    "keyPointsOrSteps": [
      "१. खरिद गरिने मालसामान, निर्माण कार्य वा सेवाको संक्षिप्त विवरण र प्याकेजिङ।",
      "२. अनुमानित लागत रकम र बजेट उपशीर्षक।",
      "३. अवलम्बन गरिने खरिद विधि (खुला बोलपत्र, दरभाउपत्र, सोझै खरिद आदि)।",
      "४. पूर्वयोग्यता वा बोलपत्र आह्वान गर्ने सम्भावित मिति।",
      "५. सम्झौता सम्पन्न गर्ने र कार्यान्वयन सुरु गर्ने कार्यतालिका।",
      "६. सम्झौता सम्पन्न हुने र अन्तिम भुक्तानी हुने अपेक्षित समयसीमा।"
    ],
    "responsibleAuthority": "खरिद इकाइले तयार गरी कार्यालय प्रमुखले बजेट स्वीकृत भएको १५ दिनभित्र स्वीकृत गर्नुपर्ने।",
    "impactOrCaution": "वार्षिक खरिद योजना स्वीकृत नगरी १० लाख रुपैयाँभन्दा माथिको खरिद प्रक्रिया अघि बढाएमा आर्थिक अनुशासनहीनता र बेरुजु ठहरिन्छ।"
  },
  {
    "id": "qa-b-2",
    "topicId": "t5",
    "topicNumber": 5,
    "question": "निर्माण कार्यको लागत अनुमान तयार गर्दा प्राविधिक कर्मचारीले पालना गर्नुपर्ने कानूनी आधार र प्रक्रियाहरू के-के हुन्?",
    "purposeAndSignificance": "लागत अनुमान खरिदको मेरुदण्ड हो। अवास्तविक लागत अनुमानले न्यून बिडिङ वा अत्यधिक महँगो कबोल निम्त्याउँछ। त्यसैले यथार्थपरक लागत अनुमान बनाउनु कानूनी अनिवार्यता हो।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ५ तथा सार्वजनिक खरिद नियमावली, २०६४ को नियम ९ र १०।",
    "keyPointsOrSteps": [
      "१. स्थलगत निरीक्षण, माटो परीक्षण, सर्भे तथा वातावरणीय अध्ययन प्रतिवेदन।",
      "२. विस्तृत इन्जिनियरिङ डिजाइन, ड्रइङ र प्राविधिक स्पेसिफिकेसन।",
      "३. सम्बन्धित निकायले स्वीकृत गरेको मानक नर्म्स (Standard Norms)।",
      "४. जिल्ला दररेट निर्धारण समितिले तोकेको चालु आर्थिक वर्षको जिल्ला दररेट।",
      "५. जिल्ला दररेटमा नभएका वस्तुको हकमा ३ वटा आधिकारिक स्रोतबाट बजार दररेट संकलन।",
      "६. परिमाणको लगत (Bill of Quantities - BOQ) र दर विश्लेषण (Rate Analysis)।",
      "७. मूल्य अभिवृद्धि कर (VAT १३%), कन्टिन्जेन्सी र रोयल्टी रकमको स्पष्ट समायोजन।"
    ],
    "responsibleAuthority": "सम्बन्धित प्राविधिक अधिकृतले तयार गरी जाँचकर्ता (Checker) बाट प्रमाणित गराई नियम १६ बमोजिमको अधिकारीबाट स्वीकृत गराउने।",
    "impactOrCaution": "साइटको अवस्था नहेरी टेबलमै बसेर बनाइएको लागत अनुमानका कारण पछि ठूलो परिमाणमा भेरिएसन आउन सक्छ, जसले अख्तियार दुरुपयोगको जोखिम निम्त्याउँछ।"
  },
  {
    "id": "qa-b-3",
    "topicId": "t11",
    "topicNumber": 11,
    "question": "सिलबन्दी दरभाउपत्र (Sealed Quotation) र खुला बोलपत्र (Open Bidding) बीचको कानूनी भिन्नता स्पष्ट गर्नुहोस्।",
    "purposeAndSignificance": "साना प्रकृतिका र तत्काल चाहिने खरिदलाई छिटो छरितो बनाउन सिलबन्दी दरभाउपत्रको व्यवस्था गरिएको हो, तर यसलाई खुला बोलपत्र छल्ने अस्त्रको रूपमा प्रयोग गर्न पाइँदैन।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा १४, ४० तथा नियमावलीको नियम ४४, ८४।",
    "keyPointsOrSteps": [
      "१. आर्थिक सीमा: दरभाउपत्र रु २० लाखसम्म (परामर्श रु ५ लाख सम्म); खुला बोलपत्र रु २० लाखभन्दा माथि जुनसुकै रकम।",
      "२. सूचनाको म्याद: दरभाउपत्रमा कम्तीमा १५ दिन (दोस्रो पटक ७ दिन); राष्ट्रिय खुला बोलपत्रमा कम्तीमा ३० दिन (दोस्रो पटक १५ दिन)।",
      "३. न्यूनतम प्रतिस्पर्धा सर्त: दरभाउपत्रमा कम्तीमा ३ वटा रीतपूर्वकका प्रस्ताव अनिवार्य; खुला बोलपत्रमा एउटा मात्र प्रभावग्राही भए पनि स्वीकृत गर्न सकिने।",
      "४. प्रकाशनको क्षेत्र: दरभाउपत्र स्थानीय/राष्ट्रिय पत्रिका वा सूचनापाटीमा; खुला बोलपत्र राष्ट्रिय दैनिक र अनिवार्य e-GP पोर्टलमा।",
      "५. बोलपत्र कागजात दस्तुर: दरभाउपत्रमा रु १,०००; खुला बोलपत्रमा रु ३,००० देखि २०,००० सम्म लागत अनुसार।"
    ],
    "responsibleAuthority": "कार्यालय प्रमुखबाट खरिद विधि छनोट र कागजात स्वीकृत हुनुपर्ने।",
    "impactOrCaution": "३ वटा दरभाउपत्र नपरी एउटा वा दुईवटा मात्र दरभाउपत्रका आधारमा सम्झौता गरेमा सो खरिद स्वतः गैरकानूनी र बेरुजु हुन्छ।"
  },
  {
    "id": "qa-b-4",
    "topicId": "t13",
    "topicNumber": 13,
    "question": "उपभोक्ता समितिमार्फत निर्माण कार्य गराउँदा कानूनले लगाएका कडा प्रतिबन्धहरू (Restrictions) के-के हुन्?",
    "purposeAndSignificance": "स्थानीय जनसहभागिता, अपनत्व र रोजगारी सिर्जना गर्ने उपभोक्ता समितिको पवित्र उद्देश्य भए पनि यसमा ठेकेदारी प्रथा र मेसिनरी विकृति मौलाएकाले कानूनले कडा सीमा तोकेको छ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ४२ तथा नियमावलीको नियम ९७।",
    "keyPointsOrSteps": [
      "१. लागत सीमा प्रतिबन्ध: स्वीकृत लागत अनुमान रु १ (एक) करोडभन्दा बढी भएको काम उपभोक्ता समितिलाई दिन पाइँदैन।",
      "२. हेभी मेसिनरी निषेध: डोजर, एक्साभेटर, ग्रेडर, लोडर जस्ता भारी उपकरण प्रयोग गर्न पूर्ण प्रतिबन्ध छ (श्रममूलक प्रविधि मात्र)।",
      "३. पेटी ठेक्का (Sub-contracting) निषेध: समितिले कुनै निर्माण व्यवसायी वा बिचौलियालाई काम जिम्मा दिन पाउँदैन।",
      "४. जटिल प्राविधिक कार्य निषेध: विशिष्ट प्राविधिक संरचना, जटिल पुल वा उच्च दक्षता चाहिने काम दिन पाइँदैन।",
      "५. पदाधिकारी लाभ निषेध: समितिका पदाधिकारीले कामबाट नाफा लिन वा ज्याला बाहेक ठेकेदारी कमिसन लिन पाउँदैनन्।",
      "६. सार्वजनिक परीक्षण अनिवार्यता: आयोजना सुरु हुनुअघि र सम्पन्न भएपछि सार्वजनिक सुनुवाइ र सामाजिक परीक्षण (Social Audit) अनिवार्य।"
    ],
    "responsibleAuthority": "स्थानीय तह वा सार्वजनिक निकायको प्रमुख र उपभोक्ता समिति गठन गर्ने आमभेला।",
    "impactOrCaution": "डोजर प्रयोग गरेको वा ठेकेदार लगाएको पाइएमा भुक्तानी रोकिन्छ र समितिका पदाधिकारी तथा भुक्तानी दिने कर्मचारीबाट रकम असुलउपर हुन्छ।"
  },
  {
    "id": "qa-b-5",
    "topicId": "t15",
    "topicNumber": 15,
    "question": "परामर्श सेवा खरिद गर्दा गुणस्तर तथा लागतमा आधारित छनोट (QCBS) विधिको मूल्याङ्कन प्रक्रिया कसरी सञ्चालन हुन्छ?",
    "purposeAndSignificance": "परामर्श सेवा बौद्धिक प्रकृतिको हुने भएकाले केवल सस्तो मूल्य मात्र हेरिँदैन, प्राविधिक गुणस्तर र आर्थिक प्रस्ताव दुवैलाई भार (Weightage) दिएर मूल्याङ्कन गरिन्छ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ३०, ३१, ३५ तथा नियमावलीको नियम ७४, ७५।",
    "keyPointsOrSteps": [
      "१. आशयपत्र (EOI) बाट ३ देखि ६ वटा उत्कृष्ट परामर्शदाताको संक्षिप्त सूची (Shortlist) तयार गर्ने।",
      "२. प्राविधिक र आर्थिक प्रस्ताव छुट्टाछुट्टै दुई खाममा (Two Envelope System) दाखिला गराउने।",
      "३. पहिले प्राविधिक प्रस्ताव मात्र खोल्ने र निर्धारित १०० पूर्णाङ्कमा न्यूनतम ७० वा ८० अङ्क (Cut-off) कटाउने।",
      "४. प्राविधिक रूपमा उत्तीर्ण परामर्शदाताहरूको मात्र सार्वजनिक रूपमा आर्थिक प्रस्ताव खोल्ने।",
      "५. सबैभन्दा कम आर्थिक प्रस्तावलाई १०० अङ्क दिई अन्यको समानुपातिक अङ्क (F = 100 x Fm / F) निकाल्ने।",
      "६. सामान्यतः प्राविधिकलाई ८०% भार र आर्थिकलाई २०% भार (८०:२०) दिई कुल प्राप्ताङ्क निकाल्ने।",
      "७. उच्चतम संयुक्त अङ्क प्राप्त गर्ने परामर्शदातासँग कार्यसर्त (TOR) र जनशक्तिमा वार्ता गरी सम्झौता गर्ने।"
    ],
    "responsibleAuthority": "परामर्श सेवा मूल्याङ्कन समिति र सार्वजनिक निकायको प्रमुख।",
    "impactOrCaution": "परामर्श सेवामा प्राविधिक प्रस्ताव उत्तीर्ण नभएको फर्मको आर्थिक खाम खोल्न पाइँदैन, त्यस्तो खाम नखोली फिर्ता गर्नुपर्छ।"
  },
  {
    "id": "qa-b-6",
    "topicId": "t24",
    "topicNumber": 24,
    "question": "बोलपत्र मूल्याङ्कनमा सामान्य त्रुटि (Minor Deviation) र सारभूत त्रुटि (Material Deviation) बीचको कानुनी भिन्नता के हो?",
    "purposeAndSignificance": "मूल्याङ्कन समितिले सानातिना प्राविधिक कमजोरीका नाममा प्रतिस्पर्धा सीमित गर्न वा गैरकानूनी रूपमा बोलपत्रदातालाई बाहिर निकाल्न पाउँदैन। त्यसैले यी दुई विचलनको सीमा स्पष्ट हुनुपर्छ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा २१, २३ तथा नियमावलीको नियम ६२, ६३।",
    "keyPointsOrSteps": [
      "१. सारभूत त्रुटि (Material Deviation): जसले कामको गुणस्तर, परिमाण, दायरा वा बोलपत्रदाताको कानुनी दायित्वमा तात्विक असर पार्छ; वा अन्य बोलपत्रदाताको प्रतिस्पर्धात्मक स्थितिमा अन्याय गर्छ। यस्तो त्रुटि भएमा बोलपत्र सिधै गैर-प्रभावग्राही (Non-responsive) भई अस्वीकृत हुन्छ।",
      "२. सामान्य त्रुटि (Minor Deviation): जसले कामको गुणस्तर वा दायरामा कुनै तात्विक फरक पार्दैन र अङ्कगणितीय रूपमा गणना गर्न सकिन्छ। यस्तो त्रुटिलाई सच्याउन सकिन्छ।",
      "३. सारभूत त्रुटिका उदाहरण: बोलपत्र फारममा हस्ताक्षर नहुनु, बिड बन्ड नपुग्नु वा म्याद कम हुनु, कर चुक्ता प्रमाणपत्र नहुनु, योग्यता मापदण्ड नपुग्नु।",
      "४. सामान्य त्रुटिका उदाहरण: दररेटमा एकाइ मूल्य (Unit Rate) मिलेको तर कुल गुणनमा सामान्य हिसाब बिग्रनु, प्रतिलिपिमा सामान्य भूल हुनु।",
      "५. मौद्रिक मूल्याङ्कन: सच्याउन मिल्ने सामान्य विचलनको रकम लागत अनुमानको १५% भन्दा बढी हुन पाइँदैन।"
    ],
    "responsibleAuthority": "मूल्याङ्कन समितिले कारण खुलाएर मुचुल्का तथा प्रतिवेदनमा स्पष्ट उल्लेख गर्नुपर्ने।",
    "impactOrCaution": "सामान्य त्रुटिलाई सारभूत भनी गैरकानूनी खारेज गरेमा बोलपत्रदाता पुनरावलोकन समितिमा गई निर्णय बदर गराउन सक्छ।"
  },
  {
    "id": "qa-b-7",
    "topicId": "t35",
    "topicNumber": 35,
    "question": "भेरिएसन आदेश (Variation Order) जारी गर्दा पालना गर्नुपर्ने कानूनी पूर्वसर्तहरू के-के हुन्?",
    "purposeAndSignificance": "भेरिएसन आदेशले सरकारी लागत र समय बढाउने भएकाले कानूनले यसलाई अपवादको रूपमा मात्र स्वीकार गरेको छ। यसको दुरुपयोग रोक्न कडा पूर्वसर्तहरू तोकिएका छन्।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ५४ तथा नियमावलीको नियम १११, ११२।",
    "keyPointsOrSteps": [
      "१. मूल कामको प्रकृति र उद्देश्यमा कुनै आधारभूत परिवर्तन नहुने हुनुपर्छ।",
      "२. डिजाइनमा नदेखिएका अप्रत्याशित भौतिक अवस्था (Unforeseen Conditions) उत्पन्न भएको हुनुपर्छ।",
      "३. काम रोकिँदा आयोजनामा ठूलो क्षति पुग्ने वा संरचना अधुरो रहने स्पष्ट औचित्य हुनुपर्छ।",
      "४. इन्जिनियर वा प्राविधिक कर्मचारीले विस्तृत प्राविधिक कारण र दर विश्लेषण सहित प्रतिवेदन पेस गर्नुपर्छ।",
      "५. नयाँ आइटम भए स्वीकृत नर्म्स र जिल्ला दररेटका आधारमा नयाँ दर निर्धारण गर्नुपर्छ।",
      "६. आवश्यक थप बजेट सुनिश्चितता हुनुपर्छ।",
      "७. कार्यसम्पादन जमानतको म्याद र रकम समानुपातिक रूपमा थप गर्नुपर्छ।",
      "८. तोकिएको प्रतिशत सीमा अनुसार अधिकारप्राप्त अधिकारीबाट पूर्वस्वीकृति लिनुपर्छ।"
    ],
    "responsibleAuthority": "शाखा प्रमुख (५%), कार्यालय प्रमुख (१०%), विभागीय प्रमुख (१५%), सचिव (२५%)।",
    "impactOrCaution": "स्वीकृति नलिई काम गराएर पछि कार्योत्तर भेरिएसन (Ex-post-facto variation) गरेमा महालेखाले असुलउपर र बेरुजु लेख्दछ।"
  },
  {
    "id": "qa-b-8",
    "topicId": "t42",
    "topicNumber": 42,
    "question": "बोलपत्रदाताले सार्वजनिक खरिद पुनरावलोकन समिति (PPRC) मा उजुरी गर्दा पूरा गर्नुपर्ने कार्यविधि के-के हुन्?",
    "purposeAndSignificance": "खरिद प्रक्रियामा सार्वजनिक निकायले पूर्वाग्रह राखी अन्यायपूर्ण निर्णय गरेमा बोलपत्रदाताको अधिकार संरक्षण गर्न एक स्वतन्त्र अर्धन्यायिक निकायको रूपमा पुनरावलोकन समितिको व्यवस्था गरिएको हो।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ४७, ४८, ४९, ५० तथा नियमावलीको नियम १००-१०८।",
    "keyPointsOrSteps": [
      "१. पहिलो तह: आशयको सूचना (LOI) जारी भएको ७ दिनभित्र पहिले कार्यालय प्रमुख समक्ष लिखित उजुरी दिनुपर्छ।",
      "२. कार्यालय प्रमुखको निर्णय: कार्यालय प्रमुखले उजुरी परेको ५ दिनभित्र निर्णय दिनुपर्छ वा निर्णय नदिएमा म्याद सकिन्छ।",
      "३. दोस्रो तह (PPRC): कार्यालय प्रमुखको निर्णय चित्त नबुझेमा वा निर्णय नदिएमा ७ दिनभित्र पुनरावलोकन समिति (केशरमहल) मा निवेदन दिनुपर्छ।",
      "४. धरौटी दाखिला: आफ्नो कबोल रकमको ०.१५% रकम बराबरको नगद भौचर वा बैंक जमानत अनिवार्य संलग्न गर्नुपर्छ।",
      "५. प्रमाण संलग्न: बोलपत्र कागजात, मूल्याङ्कनमा भएको कानुनी त्रुटिको विवरण र दाबी खुल्ने प्रमाण पेस गर्नुपर्छ।",
      "६. खरिद प्रक्रिया स्थगन: उजुरी दर्ता हुनासाथ समितिले सार्वजनिक निकायलाई खरिद प्रक्रिया रोक्न आदेश दिन्छ।",
      "७. फैसला: समितिले ३० दिनभित्र निर्णय दिन्छ; निर्णय उचित ठहरिए धरौटी फिर्ता हुन्छ, अन्यथा जफत हुन्छ।"
    ],
    "responsibleAuthority": "पुनरावलोकन समिति (सर्वोच्च अदालतका पूर्व न्यायाधीशको अध्यक्षतामा गठित)।",
    "impactOrCaution": "म्याद गुजारेर वा हुलाकबाट ढिला पुगेको निवेदन स्वतः दरपीठ हुन्छ; हदम्याद भित्रै आधिकारिक रूपमा दर्ता हुनु अनिवार्य छ।"
  },
  {
    "id": "qa-b-9",
    "topicId": "t43",
    "topicNumber": 43,
    "question": "निर्माण व्यवसायी वा आपूर्तिकर्तालाई कालोसूची (Blacklist) मा राख्न सकिने प्रमुख कानूनी आधारहरू के-के हुन्?",
    "purposeAndSignificance": "सार्वजनिक खरिद सम्झौता उल्लंघन गर्ने, गैरकानूनी मिलेमतो गर्ने वा सरकारी आयोजना अलपत्र पार्ने खराब व्यवसायीहरूलाई बजारबाट दण्डित गरी स्वच्छ प्रतिस्पर्धा कायम राख्न कालोसूचीको व्यवस्था गरिएको हो।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ६३ तथा नियमावलीको नियम १४१, १४२, १४३।",
    "keyPointsOrSteps": [
      "१. छनोट भई बोलपत्र स्वीकृतिको पत्र पाउँदा पनि तोकिएको म्यादभित्र सम्झौता गर्न नआएमा।",
      "२. सम्झौता गरिसकेपछि सम्झौताका सर्तको गम्भीर उल्लंघन गरी काम बीचैमा छाडेमा वा अलपत्र पारेमा।",
      "३. बोलपत्र दाखिला गर्दा झुट्टा, जाली वा किर्ते कागजात (Fake Experience/Bank Guarantee) पेस गरेको प्रमाणित भएमा।",
      "४. बोलपत्र प्रक्रियामा अन्य व्यवसायीहरूसँग गैरकानूनी कार्टेलिङ, मिलेमतो (Collusion) वा प्रभाव पार्ने कार्य गरेमा।",
      "५. भ्रष्टाचार, ठगी वा नैतिक पतन देखिने फौजदारी कसुरमा अदालतबाट दोषी ठहर भएमा।",
      "६. सम्झौता अन्त्य (Termination) भई सरकारी कोषमा ठूलो नोक्सानी पुर्‍याएमा।"
    ],
    "responsibleAuthority": "सम्बन्धित सार्वजनिक निकायले कारण र प्रमाणसहित सिफारिस गर्ने र सार्वजनिक खरिद अनुगमन कार्यालय (PPMO) ले निर्णय गर्ने।",
    "impactOrCaution": "कालोसूचीमा परेको अवधिभर (१ देखि ३ वर्ष) सम्बन्धित कम्पनी र त्यसका मुख्य सञ्चालकले नेपालभरिका कुनै पनि सरकारी निकायको खरिदमा भाग लिन पाउँदैनन्।"
  },
  {
    "id": "qa-b-10",
    "topicId": "t48",
    "topicNumber": 48,
    "question": "विद्युतीय खरिद प्रणाली (e-GP) को प्रयोग र यसले सार्वजनिक खरिदमा ल्याएका फाइदाहरू के-के हुन्?",
    "purposeAndSignificance": "भौतिक रूपमा बोलपत्र दर्ता गर्दा हुने बाहुबल, ठेकेदारबीचको झगडा, कागजात चोरी र मिलेमतोलाई शून्यमा झार्न पूर्ण डिजिटल e-GP प्रणाली लागू गरिएको हो।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ६० तथा नियमावलीको नियम १४०क-१४०घ।",
    "keyPointsOrSteps": [
      "१. सूचनाको सर्वसुलभ पहुँच: देश तथा विदेशका जोसुकै बोलपत्रदाताले bolpatra.gov.np बाट तत्काल सूचना र कागजात हेर्न पाउने।",
      "२. सुरक्षित र गोप्य दाखिला: डिजिटल सिग्नेचर र इन्क्रिप्सन (Encryption) प्रविधि मार्फत अन्तिम म्याद नसकिँदासम्म कसैले पनि दररेट हेर्न नसक्ने।",
      "३. भौतिक अवरोधको अन्त्य: कार्यालयको ढोकामा हुने गुण्डागर्दी, बोलपत्र खोस्ने वा रोक्ने प्रवृत्ति पूर्ण रूपमा समाप्त।",
      "४. पारदर्शी मूल्याङ्कन: बोलपत्र खोल्ने मुचुल्का, उपस्थित विवरण र कबोल अङ्क तत्काल प्रणालीमा अपलोड भई सबैले हेर्न मिल्ने।",
      "५. लागत र समयको बचत: कागजात छपाइ, ढुवानी र भौतिक उपस्थितिको झन्झट हटी प्रशासनिक खर्चमा भारी कटौती।"
    ],
    "responsibleAuthority": "सार्वजनिक खरिद अनुगमन कार्यालय (PPMO) को e-GP महाशाखा र प्रयोगकर्ता सार्वजनिक निकायहरू।",
    "impactOrCaution": "ऐनले तोकेको सीमाभन्दा माथिको बोलपत्र e-GP बाहिर कागजी रूपमा मात्र आह्वान गरेमा सो खरिद प्रक्रिया गैरकानूनी ठहरिन्छ।"
  }
];

// -------------------------------------------------------------
// ४. तह ३: लामो विश्लेषणात्मक प्रश्नोत्तर (Level C: Long 9-Step Lifecycle Q&A)
// -------------------------------------------------------------
export const LONG_QA: LongQA[] = [
  {
    "id": "qa-c-1",
    "topicId": "t1",
    "topicNumber": 1,
    "question": "सार्वजनिक खरिदको आवश्यकता पहिचानदेखि सम्झौता सम्पन्न भई अन्तिम भुक्तानी र सम्झौता फरफारक नहुँदासम्मको सम्पूर्ण कानूनी चक्र (Procurement Lifecycle) विस्तृत रूपमा व्याख्या गर्नुहोस्।",
    "introduction": "सार्वजनिक खरिद भन्नाले सार्वजनिक कोषको प्रयोग गरी मालसामान, निर्माण कार्य, परामर्श सेवा वा गैर-परामर्श सेवा प्राप्त गर्ने समग्र प्रक्रिया हो। यो प्रक्रिया कुनै एक दिनको घटना नभई आवश्यकता पहिचानदेखि अन्तिम फरफारकसम्म निरन्तर चल्ने बहु-चरणीय कानूनी चक्र हो। यसको मूल ध्येय सार्वजनिक स्रोतको अधिकतम सदुपयोग, स्वच्छ प्रतिस्पर्धा, गुणस्तरीय नतिजा र जवाफदेहिता सुनिश्चित गर्नु हो।",
    "legalGrounding": {
      "act": "सार्वजनिक खरिद ऐन, २०६३ का दफा ४, ५, ६, ७, ८, १२, १३, १४, १७, १९, २३, २५, २७, २८, ३९, ५२, ५५, ५६, ६५।",
      "rules": "सार्वजनिक खरिद नियमावली, २०६४ का नियम ३ देखि १६, १८, ३१, ४४, ५२, ५३, ५९ देखि ६८, ९९ देखि १२६।",
      "amendments": "१६औँ संशोधनका व्यवस्थाहरू (औसत मूल्य बिडिङ र ३०% कट-अफ)।"
    },
    "integratedProvisions": [
      "ऐनको दफा ४ र नियम ३ अनुसार आवश्यकता पहिचान र स्पेसिफिकेसन तर्जुमा।",
      "ऐनको दफा ५ र नियम ९-१६ अनुसार जिल्ला दररेट र नर्म्सका आधारमा लागत अनुमान र स्वीकृति।",
      "ऐनको दफा ६ र नियम ७-८ अनुसार खरिद गुरुयोजना र वार्षिक खरिद योजना स्वीकृति।",
      "ऐनको दफा ८, १४ र नियम १८, ४४ अनुसार बोलपत्र कागजात र ३० दिने सूचना प्रकाशन।",
      "ऐनको दफा १७, १९, २३ र नियम ५९-६५ अनुसार सार्वजनिक रूपमा बोलपत्र खोल्ने, प्राविधिक/आर्थिक मूल्याङ्कन।",
      "ऐनको दफा २५ र नियम ३१ज, ६५च अनुसार ३०% भन्दा बढी घटेका हटाई औसत मूल्यसँग निकटतम छनोट।",
      "ऐनको दफा २७ र नियम ६७ अनुसार ७ दिने LOI, १५ दिनभित्र कार्यसम्पादन जमानत लिई सम्झौता।",
      "ऐनको दफा ३९, ५२ र नियम ९९-१२६ अनुसार कार्य प्रारम्भ आदेश, कार्यतालिका, रनिङ बिल भुक्तानी, नापजाँच, गुणस्तर परीक्षण, म्याद थप, भेरिएसन, कार्य सम्पन्न प्रतिवेदन र अन्तिम भुक्तानी।"
    ],
    "workflowSteps": [
      {
        "stepNo": 1,
        "title": "तयारी चरण (Preparation Phase)",
        "detail": "आवश्यकता पहिचान, प्राविधिक स्पेसिफिकेसन/डिजाइन, लागत अनुमान तर्जुमा, स्वीकृति र वार्षिक खरिद योजना निर्माण।",
        "authority": "प्राविधिक अधिकृत, खरिद इकाइ, कार्यालय प्रमुख"
      },
      {
        "stepNo": 2,
        "title": "आह्वान चरण (Bidding Phase)",
        "detail": "PPMO को मानक SBD अनुसार कागजात तयार, स्वीकृत, ३० दिने राष्ट्रिय दैनिक र e-GP मा सूचना प्रकाशन, प्रि-बिड बैठक।",
        "authority": "खरिद इकाइ र कार्यालय प्रमुख"
      },
      {
        "stepNo": 3,
        "title": "दाखिला र खोल्ने (Submission & Opening)",
        "detail": "e-GP मार्फत निर्धारित मिति र समयसम्म बिड दाखिला, सोही दिन सार्वजनिक रूपमा खोल्ने र मुचुल्का तयार गर्ने।",
        "authority": "खरिद इकाइ र उपस्थित प्रतिनिधि"
      },
      {
        "stepNo": 4,
        "title": "परीक्षण र मूल्याङ्कन (Evaluation Phase)",
        "detail": "मूल्याङ्कन समितिद्वारा पूर्णता जाँच, योग्यता परीक्षण, प्राविधिक प्रभावग्राहिता, ३०% कट-अफ, औसत मूल्य हिसाब र छनोट सिफारिस।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 5,
        "title": "सम्झौता चरण (Award & Contracting)",
        "detail": "७ दिने आशयको सूचना (LOI), १५ दिनभित्र कार्यसम्पादन जमानत (५% + APS) लिई औपचारिक सम्झौता र कार्य प्रारम्भ आदेश।",
        "authority": "कार्यालय प्रमुख र सफल बोलपत्रदाता"
      },
      {
        "stepNo": 6,
        "title": "कार्यान्वयन र व्यवस्थापन (Contract Administration)",
        "detail": "कार्यतालिका अनुमोदन, साइट हस्तान्तरण, मोबिलाइजेसन पेश्की, नापजाँच (MB), रनिङ बिल भुक्तानी, ल्याब टेस्ट, भेरिएसन र म्याद थप व्यवस्थापन।",
        "authority": "आयोजना प्रबन्धक, लेखा शाखा र कार्यालय प्रमुख"
      },
      {
        "stepNo": 7,
        "title": "सम्पन्न र फरफारक (Completion & Closeout)",
        "detail": "भौतिक कार्य सम्पन्न, संयुक्त निरीक्षण, कार्य सम्पन्न प्रतिवेदन (Completion Report), अन्तिम बिल भुक्तानी, त्रुटि सच्याउने अवधि (DLP) पार भएपछि धरौटी (Retention Money) फिर्ता र अभिलेख संरक्षण।",
        "authority": "निरीक्षण समिति, कार्यालय प्रमुख र लेखा प्रमुख"
      }
    ],
    "responsibleAuthorities": [
      "कार्यालय प्रमुख: लागत अनुमान, बोलपत्र कागजात, बोलपत्र स्वीकृति र सम्झौता गर्ने मुख्य अधिकारी।",
      "मूल्याङ्कन समिति: कागजात जाँच्ने, अङ्कगणितीय त्रुटि सच्याउने र कारणसहित सिफारिस गर्ने अर्धन्यायिक समिति।",
      "प्राविधिक अधिकृत/इन्जिनियर: लागत अनुमान, नापजाँच, गुणस्तर परीक्षण र भेरिएसन सिफारिस गर्ने।",
      "लेखा प्रमुख: बजेट यकिन, धरौटी कट्टी, कर कट्टी र भुक्तानी नियन्त्रण गर्ने।"
    ],
    "limitsAndThresholds": [
      "वार्षिक खरिद योजना: रु १० लाख माथि अनिवार्य।",
      "खरिद गुरुयोजना: रु १० करोड माथि वा १ वर्षभन्दा बढी आयोजनामा अनिवार्य।",
      "बोलपत्र जमानत: लागत अनुमानको २% देखि ३%।",
      "कार्यसम्पादन जमानत: कबोल रकमको ५% (१५% भन्दा बढी घटेमा थप APS सहित)।",
      "बोलपत्र सूचना म्याद: राष्ट्रिय खुला बोलपत्रमा कम्तीमा ३० दिन।"
    ],
    "specialConditionsAndExceptions": [
      "काबू बाहिरको परिस्थिति भएमा म्याद सकिनुअगावै २१ दिन बाँकी छँदै म्याद थपको निवेदन दिनुपर्ने।",
      "अत्यवश्यक परिस्थितिमा भेरिएसन आदेश २५% सम्म अधिकारप्राप्त अधिकारीबाट स्वीकृत गराउन सकिने।",
      "सार्वजनिक हित वा बजेट अभाव भएमा कारण खोली दफा २६ अनुसार बोलपत्र प्रक्रिया रद्द गर्न सकिने।"
    ],
    "safeguardsAndAuditRisks": [
      "आवश्यकता नै नभएको सामान किन्ने वा टुक्र्याएर खरिद गर्ने काम पूर्णतः बेरुजु र अख्तियारको विषय बन्दछ।",
      "साइट क्लियर नहुँदै वा बजेट सुनिश्चित नहुँदै बोलपत्र आह्वान गर्दा ठेक्का अलपत्र पर्ने र क्षतिपूर्ति तिर्नुपर्ने जोखिम हुन्छ।",
      "नापजाँच नगरी वा ल्याब रिपोर्ट नहेरी रनिङ बिल भुक्तानी दिएमा संलग्न प्राविधिक र लेखा कर्मचारीबाट असुलउपर हुन्छ।"
    ],
    "conclusion": "सार्वजनिक खरिदको सम्पूर्ण चक्र ऐन र नियमावलीका परस्पर सम्बन्धित दफा र नियमहरूको कडीबद्ध शृङ्खला हो। यसको कुनै एक चरणमा भएको कानुनी त्रुटिले सिङ्गो खरिदलाई प्रभावित पार्दछ। तसर्थ, पूर्वतयारीदेखि फरफारकसम्मका प्रत्येक चरणमा कानूनी सीमा, समयसीमा र अधिकार क्षेत्रको पूर्ण परिपालना नै सफल खरिद व्यवस्थापनको आधार हो।"
  },
  {
    "id": "qa-c-2",
    "topicId": "t28",
    "topicNumber": 28,
    "question": "सार्वजनिक खरिद नियमावलीको १६औँ संशोधनले ल्याएको औसत मूल्य बोलपत्र छनोट विधि (Average Price Bidding System) र ३०% कट-अफ व्यवस्थाको विस्तृत कानुनी र गणितीय विश्लेषण गर्नुहोस्।",
    "introduction": "नेपालको निर्माण क्षेत्रमा विगत लामो समयदेखि न्यून बिडिङ (Abnormally Low Bidding) को गम्भीर विकृति थियो। ठेकेदारहरूले लागत अनुमान भन्दा ४०-५०% सम्म घटेर ठेक्का हात पार्ने, पेश्की रकम दुरुपयोग गर्ने र काम अलपत्र पार्ने प्रवृत्तिले विकास निर्माण ठप्प भएको थियो। यसै समस्याको ऐतिहासिक समाधानका रूपमा सार्वजनिक खरिद ऐनको दोस्रो संशोधन र नियमावलीको १६औँ संशोधन मार्फत ३०% भन्दा बढी घटेका बोलपत्रलाई स्वतः हटाउने र बाँकी प्रभावग्राही बोलपत्रहरूको औसत मूल्यसँग सबैभन्दा नजिक भएको बोलपत्र छनोट गर्ने विधि लागू गरिएको हो।",
    "legalGrounding": {
      "act": "सार्वजनिक खरिद ऐन, २०६३ को दफा २५ को उपदफा (५क), (७क), र (७ख)।",
      "rules": "सार्वजनिक खरिद नियमावली, २०६४ को नियम ३१ज र नियम ६५च (१६औँ संशोधनसहित)।",
      "amendments": "नेपाल राजपत्रमा प्रकाशित १६औँ संशोधन नियमावली र PPMO को निर्देशिका।"
    },
    "integratedProvisions": [
      "ऐनको दफा २५(७ख) अनुसार स्वीकृत लागत अनुमान भन्दा ३०% भन्दा बढी घटेको बोलपत्र मूल्याङ्कन प्रक्रियाबाटै स्वतः अयोग्य (Disqualified) हुने।",
      "ऐनको दफा २५(५क) र नियम ६५च अनुसार ३०% कट-अफ पार गरेका सारभूत रूपमा प्रभावग्राही (Substantially Responsive) बोलपत्रहरूको मात्र सूची तयार गर्ने।",
      "नियम ३१ज बमोजिम प्रभावग्राही बोलपत्रहरूको कबोल रकम जोडेर बोलपत्र संख्याले भाग गरी औसत अङ्क (Average Price) निर्धारण गर्ने।",
      "उक्त औसत अङ्कसँग निरपेक्ष भिन्नता (Absolute Difference) का आधारमा सबैभन्दा नजिक भएको बोलपत्रदातालाई न्यूनतम मूल्याङ्कित प्रभावग्राही बोलपत्रदाता मानी छनोट गर्ने।",
      "ऐनको दफा २८ र नियम ५३(२) अनुसार १५% देखि ३०% बीच घटेर छनोट हुने बोलपत्रदाताबाट थप कार्यसम्पादन जमानत (APS) लिने।"
    ],
    "workflowSteps": [
      {
        "stepNo": 1,
        "title": "कट-अफ सीमा गणना (30% Floor)",
        "detail": "स्वीकृत लागत अनुमान (भ्याट बाहेक) को ७०% रकम (Floor Price) हिसाब गर्ने। यस सीमाभन्दा तल कबोल गर्ने सबै बोलपत्रलाई तुरुन्त अयोग्य घोषणा गरी बाहिर निकाल्ने।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 2,
        "title": "प्रभावग्राहिता परीक्षण",
        "detail": "७०% वा सोभन्दा माथि रहेका बोलपत्रहरूको मात्र प्राविधिक स्पेसिफिकेसन, योग्यता र सामान्य त्रुटि सच्याई आर्थिक मूल्याङ्कन गर्ने।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 3,
        "title": "औसत अङ्क गणना (Average Price Calculation)",
        "detail": "सारभूत रूपमा प्रभावग्राही ठहरिएका सबै बोलपत्रहरूको कबोल रकमको योगफललाई प्रभावग्राही बोलपत्र संख्याले भाग गरी औसत रकम (A) निकाल्ने।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 4,
        "title": "दूरी विश्लेषण (Proximity to Average)",
        "detail": "प्रत्येक बोलपत्रदाताको कबोल रकम र औसत रकम बीचको फरक (|Bid - Average|) हिसाब गर्ने। जसको फरक सबैभन्दा कम छ, ऊ पहिलो प्राथमिकतामा पर्छ।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 5,
        "title": "बराबर दूरी भएमा निर्णय (Tie-Breaker)",
        "detail": "यदि दुई बोलपत्रदाता औसत मूल्यभन्दा ठ्याक्कै बराबर अन्तरमा (एउटा माथि र एउटा तल) परे भने कम कबोल गर्ने बोलपत्रदातालाई छनोट गर्ने।",
        "authority": "मूल्याङ्कन समिति"
      },
      {
        "stepNo": 6,
        "title": "जमानत निर्धारण र स्वीकृति सिफारिस",
        "detail": "छनोट भएको बोलपत्र १५% भन्दा बढी घटेको भए थप कार्यसम्पादन जमानत (APS) हिसाब गरी कार्यालय प्रमुख समक्ष स्वीकृतिको लागि सिफारिस गर्ने।",
        "authority": "मूल्याङ्कन समिति र कार्यालय प्रमुख"
      }
    ],
    "responsibleAuthorities": [
      "मूल्याङ्कन समिति: गणितीय सूत्र र कट-अफको सही प्रयोग गरी प्रतिवेदन पेस गर्ने।",
      "कार्यालय प्रमुख: मूल्याङ्कन समितिको प्रतिवेदन अनुसार आशयको सूचना जारी गर्ने र सम्झौता गर्ने।"
    ],
    "limitsAndThresholds": [
      "कट-अफ सीमा: स्वीकृत लागत अनुमानको ३०% भन्दा बढी घटेको (Floor = 70% of Estimate)।",
      "थप जमानत (APS): १५% भन्दा बढी घटेको हकमा (८५% लागत अनुमान - कबोल रकम) को ५०% थप जमानत।",
      "लागू हुने क्षेत्र: राष्ट्रिय खुला बोलपत्र (NCB) मार्फत हुने निर्माण कार्यहरूमा।"
    ],
    "specialConditionsAndExceptions": [
      "यदि ३०% कट-अफ भित्र एउटा मात्र बोलपत्र प्रभावग्राही रहेमा सोही बोलपत्रदाता नै स्वतः औसतसँग निकटतम भई छनोट हुन्छ।",
      "यदि कुनै पनि बोलपत्र ७०% भन्दा माथि परेनन् वा सबै बोलपत्र अयोग्य भएमा दफा २६ अनुसार बोलपत्र रद्द गरी पुनः आह्वान गर्नुपर्छ।"
    ],
    "safeguardsAndAuditRisks": [
      "३०% भन्दा बढी घटेको बोलपत्रलाई भूलवश वा मिलेमतोमा मूल्याङ्कनमा समावेश गरेमा सम्पूर्ण प्रक्रिया गैरकानूनी हुन्छ।",
      "असारभूत (Non-responsive) बोलपत्रलाई औसत मूल्य गणनामा समावेश गर्न पाइँदैन; केवल सारभूत रूपमा प्रभावग्राहीको मात्र औसत निकालिनुपर्छ।"
    ],
    "conclusion": "औसत मूल्य बोलपत्र छनोट विधिले निर्माण कार्यमा 'जतिसुकै घटेर हाल्ने' विकृत प्रतिस्पर्धालाई सदाका लागि रोकेको छ। यसले निर्माण व्यवसायीलाई यथार्थपरक र गुणस्तरीय काम गर्न सक्ने दररेट कबोल गर्न बाध्य बनाएको छ भने सार्वजनिक निकायलाई समयमै गुणस्तरीय पूर्वाधार प्राप्त हुने ग्यारेन्टी गरेको छ।"
  },
  {
    "id": "qa-c-3",
    "topicId": "t35",
    "topicNumber": 35,
    "question": "खरिद सम्झौता कार्यान्वयनमा भेरिएसन आदेश (Variation Order), म्याद थप (Extension of Time) र मूल्य समायोजन (Price Adjustment) बीचको अन्तरसम्बन्ध र कानूनी प्रक्रियाको विस्तृत विश्लेषण गर्नुहोस्।",
    "introduction": "निर्माण कार्य वा ठूला खरिद सम्झौता कार्यान्वयनको क्रममा स्थलगत परिस्थिति, डिजाइन परिवर्तन वा बजार मूल्यमा आउने उतारचढावका कारण सम्झौताका मूल सर्तहरू संशोधन गर्नुपर्ने हुन्छ। यसरी सम्झौता संशोधन गर्ने तीनवटा प्रमुख कानुनी औजारहरू भेरिएसन आदेश, म्याद थप र मूल्य समायोजन हुन्। यी तीनवटै व्यवस्था एकअर्कासँग अन्तरसम्बन्धित हुन्छन् र यिनको समुचित व्यवस्थापन बिना कुनै पनि ठूलो आयोजना सफल हुन सक्दैन।",
    "legalGrounding": {
      "act": "सार्वजनिक खरिद ऐन, २०६३ का दफा ४४ (सम्झौता संशोधन), दफा ४५ (मूल्य समायोजन), दफा ४६ र ५६ (म्याद थप), दफा ५४ (भेरिएसन आदेश)।",
      "rules": "सार्वजनिक खरिद नियमावली, २०६४ का नियम १११, ११२ (भेरिएसन), नियम ११८ (मूल्य समायोजन), नियम १२० (म्याद थप)।",
      "amendments": "१६औँ संशोधन अनुसार म्याद थप र भेरिएसनका कडा मापदण्डहरू।"
    },
    "integratedProvisions": [
      "भेरिएसन आदेश (दफा ५४, नियम १११): परिमाण थपघट, नयाँ आइटम सिर्जना वा डिजाइन संशोधनका कारण सम्झौता मूल्यमा हुने परिवर्तन।",
      "म्याद थप (दफा ५६, नियम १२०): भेरिएसन आदेशका कारण कामको परिमाण बढेमा वा काबू बाहिरको परिस्थिति परेमा स्वतः म्याद थपको आधार सिर्जना हुने।",
      "मूल्य समायोजन (दफा ५५, नियम ११८): १२ महिनाभन्दा बढी अवधिको सम्झौतामा श्रम, इन्धन र निर्माण सामग्रीको मूल्यवृद्धि समायोजन सूत्र अनुसार भुक्तानी हुने।",
      "अन्तरसम्बन्ध: यदि भेरिएसन भएर कामको परिमाण बढ्यो भने सो काम सम्पन्न गर्न म्याद थप आवश्यक हुन्छ; म्याद थप हुँदा सम्झौता अवधि लम्बिएर मूल्य समायोजनको दायित्वसमेत परिवर्तन हुन सक्छ।"
    ],
    "workflowSteps": [
      {
        "stepNo": 1,
        "title": "परिस्थिति पहिचान र प्राविधिक प्रतिवेदन",
        "detail": "साइट इन्जिनियरले कामको परिमाण थपघट, नयाँ काम वा अप्रत्याशित भौगर्भिक अवस्थाको विस्तृत प्राविधिक प्रतिवेदन (Justification Report) तयार गर्ने।",
        "authority": "प्राविधिक अधिकृत/इन्जिनियर"
      },
      {
        "stepNo": 2,
        "title": "भेरिएसन र दर विश्लेषण",
        "detail": "स्वीकृत नर्म्स र दररेटका आधारमा नयाँ दर निर्धारण र कुल भेरिएसन प्रतिशत हिसाब गर्ने।",
        "authority": "इन्जिनियर र जाँचकर्ता"
      },
      {
        "stepNo": 3,
        "title": "तहगत स्वीकृति",
        "detail": "५% सम्म शाखा प्रमुख, १०% सम्म कार्यालय प्रमुख, १५% सम्म विभागीय प्रमुख र २५% सम्म सचिव/मन्त्रालयबाट पूर्वस्वीकृति लिने।",
        "authority": "तोकिएको अधिकारप्राप्त अधिकारी"
      },
      {
        "stepNo": 4,
        "title": "म्याद थपको निवेदन र विश्लेषण",
        "detail": "म्याद सकिनुअगावै २१ दिन बाँकी छँदै ठेकेदारले संशोधित कार्यतालिका सहित निवेदन दिने; भेरिएसनको परिमाण र साइट अवरोधका दिन हिसाब गरी मनासिब म्याद थप गर्ने।",
        "authority": "कार्यालय प्रमुख र विभागीय प्रमुख"
      },
      {
        "stepNo": 5,
        "title": "जमानत अद्यावधिक",
        "detail": "सम्झौता रकम र म्याद बढेकाले सोही अनुपातमा कार्यसम्पादन जमानतको म्याद र रकम थप गर्न लगाउने।",
        "authority": "खरिद इकाइ र लेखा शाखा"
      },
      {
        "stepNo": 6,
        "title": "मूल्य समायोजन हिसाब",
        "detail": "विस्तारित अवधिमा राष्ट्रबैंकको मूल्य सूचकाङ्क (Price Index) का आधारमा सूत्र प्रयोग गरी रनिङ बिलमा मूल्य समायोजन भुक्तानी गर्ने वा कट्टी गर्ने।",
        "authority": "लेखा प्रमुख र कार्यालय प्रमुख"
      }
    ],
    "responsibleAuthorities": [
      "आयोजना प्रबन्धक/इन्जिनियर: प्राविधिक औचित्य पुष्टि र हिसाब तयार गर्ने।",
      "कार्यालय प्रमुख: १०% सम्म भेरिएसन र ६ महिनासम्म म्याद थप स्वीकृत गर्ने।",
      "विभागीय प्रमुख: १५% सम्म भेरिएसन र १ वर्षसम्म म्याद थप स्वीकृत गर्ने।",
      "मन्त्रालयको सचिव: २५% सम्म भेरिएसन र विशेष म्याद थप स्वीकृत गर्ने।"
    ],
    "limitsAndThresholds": [
      "भेरिएसन अधिकतम सीमा: मूल सम्झौताको २५% भन्दा बढी हुन नहुने।",
      "मूल्य समायोजन सीमा: सम्झौता मूल्यको २५% भन्दा बढी हुन नहुने; १०% भन्दा माथिको वृद्धिमा मात्र लागू हुने।",
      "म्याद थप निवेदन: म्याद समाप्त हुनुभन्दा कम्तीमा २१ दिन अगावै पेश हुनुपर्ने।"
    ],
    "specialConditionsAndExceptions": [
      "ठेकेदारको आफ्नै ढिलाइ, उपकरण वा जनशक्ति अभावका कारण काम रोकिएमा म्याद थप र मूल्य समायोजन पाइँदैन; उल्टै LD कट्टी हुन्छ।",
      "काबू बाहिरको परिस्थिति (दैवी प्रकोप, नाकाबन्दी, युद्ध) भएमा क्षतिपूर्ति बिना म्याद थप मात्र गरिन्छ।"
    ],
    "safeguardsAndAuditRisks": [
      "स्वीकृति नलिई काम गराएर पछि कार्योत्तर भेरिएसन (Ex-post-facto variation) गरेमा महालेखाले असुलउपर र बेरुजु लेख्दछ।",
      "म्याद गुज्रिएपछि निवेदन लिई म्याद थप गरेमा सो निर्णय गैरकानूनी ठहरिन्छ।"
    ],
    "conclusion": "भेरिएसन, म्याद थप र मूल्य समायोजन सम्झौता कार्यान्वयनका अनिवार्य औजार भए तापनि यिनको जथाभावी प्रयोगले आयोजनामा समय र लागतको अस्वाभाविक वृद्धि (Time & Cost Overrun) गराउँछ। त्यसैले पारदर्शी प्राविधिक औचित्य, अधिकारप्राप्त अधिकारीको पूर्वस्वीकृति र कडा वित्तीय अनुशासन कायम राखेर मात्र यी व्यवस्थाहरू लागू गर्नुपर्छ।"
  },
  {
    "id": "qa-c-4",
    "topicId": "t40",
    "topicNumber": 40,
    "question": "सार्वजनिक खरिद सम्झौता अन्त्य (Contract Termination) गर्न सकिने कानूनी आधार, अपनाउनुपर्ने चरणबद्ध कार्यविधि र त्यसपछिका कानूनी परिणामहरूको विस्तृत विश्लेषण गर्नुहोस्।",
    "introduction": "सार्वजनिक खरिद सम्झौता दुवै पक्षको आपसी विश्वास र कानुनी दायित्वमा आधारित हुन्छ। तर जब निर्माण व्यवसायी वा आपूर्तिकर्ताले चरम लापरबाही गर्छ, काम बीचैमा अलपत्र पार्छ वा सम्झौताका सर्तहरूको गम्भीर उल्लंघन गर्छ, तब सार्वजनिक हित र सरकारी कोषको संरक्षणका लागि अन्तिम अस्त्रको रूपमा सम्झौता अन्त्य (Termination) गर्नुपर्ने बाध्यात्मक अवस्था आउँछ।",
    "legalGrounding": {
      "act": "सार्वजनिक खरिद ऐन, २०६३ को दफा ५९ (सम्झौताको अन्त्य र क्षतिपूर्ति), दफा ६३ (कालोसूची)।",
      "rules": "सार्वजनिक खरिद नियमावली, २०६४ को नियम १२८ (सम्झौता अन्त्य गर्ने कार्यविधि), नियम १२९ (क्षतिपूर्ति असुल), नियम १४१ (कालोसूची सिफारिस)।",
      "amendments": "PPMO को मानक SBD का GCC Clause 59/60 का सर्तहरू।"
    },
    "integratedProvisions": [
      "ऐनको दफा ५९(१) अनुसार ठेकेदार टाट पल्टिएमा वा दामासाहीमा परेमा सम्झौता अन्त्य गर्न सकिने।",
      "ऐनको दफा ५९(२) अनुसार मनासिब कारण बिना तोकिएको समयमा काम सुरु नगरेमा वा प्रगति सन्तोषजनक नभई काम रोकेमा।",
      "पूर्वनिर्धारित क्षतिपूर्ति (LD) को अधिकतम सीमा १०% पुगिसक्दा पनि काम सम्पन्न गर्न नसकेमा।",
      "नियम १२८ अनुसार सम्झौता अन्त्य गर्नुअघि त्रुटि सच्याउन कम्तीमा १४ (चौध) दिनको लिखित पूर्वचेतावनी (Notice to Correct) दिनुपर्ने।",
      "ऐनको दफा ५९(३) अनुसार कार्यसम्पादन जमानत (Performance Security) स्वतः जफत हुने र बाँकी काम पूरा गर्दा लाग्ने थप खर्च (Risk & Cost) सोही ठेकेदारबाट असुलउपर गरिने।"
    ],
    "workflowSteps": [
      {
        "stepNo": 1,
        "title": "त्रुटि अभिलेखीकरण र चेतावनी पत्र",
        "detail": "इन्जिनियरले सम्झौता उल्लंघन, न्यून प्रगति र काम रोकेको विवरण खोली सम्झौता अनुसार काममा फर्कन पहिलो र दोस्रो कडा ताकेता पत्र पठाउने।",
        "authority": "आयोजना प्रबन्धक/इन्जिनियर"
      },
      {
        "stepNo": 2,
        "title": "१४ दिने अन्तिम पूर्वसूचना (Notice of Intention to Terminate)",
        "detail": "तोकिएको म्यादमा काम सुरु नगरे १४ दिनभित्र सम्झौता किन अन्त्य नगर्ने भनी स्पष्टीकरण सहितको अन्तिम कानुनी सूचना दिने।",
        "authority": "कार्यालय प्रमुख"
      },
      {
        "stepNo": 3,
        "title": "स्थलगत संयुक्त नापजाँच (Joint Measurement)",
        "detail": "हालसम्म सम्पन्न भएको कामको यकिन गर्न ठेकेदारको प्रतिनिधि बोलाई वा निज अनुपस्थित भए स्थानीय प्रतिनिधि राखी मुचुल्का तयार गर्ने।",
        "authority": "प्राविधिक टोली र स्थानीय प्रतिनिधि"
      },
      {
        "stepNo": 4,
        "title": "औपचारिक सम्झौता अन्त्य निर्णय",
        "detail": "कार्यालय प्रमुखले सम्झौता अन्त्य भएको औपचारिक पत्र जारी गर्ने, कार्यस्थल नियन्त्रणमा लिने र बाँकी काम सिलबन्दी गर्ने।",
        "authority": "कार्यालय प्रमुख"
      },
      {
        "stepNo": 5,
        "title": "जमानत जफत र बैंक दाबी",
        "detail": "सम्बन्धित बैंकलाई पत्राचार गरी कार्यसम्पादन जमानत (Performance Security) र असुल हुन बाँकी मोबिलाइजेसन पेश्की जमानत तुरुन्त नगदमा जफत गराउने।",
        "authority": "लेखा प्रमुख र कार्यालय प्रमुख"
      },
      {
        "stepNo": 6,
        "title": "बाँकी कामको लागत अनुमान र क्षतिपूर्ति निर्धारण",
        "detail": "बाँकी रहेको काम नयाँ बोलपत्रबाट गराउन लागत अनुमान तयार गर्ने र पुरानो ठेक्काभन्दा बढी लाग्ने रकम सोही ठेकेदारको बाँकी बिल वा जायजेथाबाट सरकारी बाँकी सरह असुलउपर गर्ने।",
        "authority": "प्राविधिक अधिकृत र कार्यालय प्रमुख"
      },
      {
        "stepNo": 7,
        "title": "कालोसूची सिफारिस",
        "detail": "ऐनको दफा ६३ बमोजिम ठेकेदारलाई १ देखि ३ वर्षसम्म कालोसूचीमा राख्न सम्पूर्ण प्रमाण सहित PPMO मा पठाउने।",
        "authority": "कार्यालय प्रमुख"
      }
    ],
    "responsibleAuthorities": [
      "कार्यालय प्रमुख: सम्झौता अन्त्य गर्ने, जमानत जफत गर्ने र कालोसूची सिफारिस गर्ने अख्तियारप्राप्त अधिकारी।",
      "विभागीय प्रमुख: ठूला राष्ट्रिय आयोजनामा सम्झौता अन्त्यको पूर्वसहमति दिने निकाय।",
      "PPMO: सिफारिस बमोजिम व्यवसायीलाई कालोसूचीमा राख्ने केन्द्रीय निकाय।"
    ],
    "limitsAndThresholds": [
      "पूर्वचेतावनी म्याद: कम्तीमा १४ दिन।",
      "पूर्वनिर्धारित क्षतिपूर्ति (LD) सीमा: १०% पुगेपछि सम्झौता अन्त्य अनिवार्य जस्तै हुने।",
      "जमानत जफत: कार्यसम्पादन जमानत (५% + APS) र बाँकी मोबिलाइजेसन पेश्की शतप्रतिशत।"
    ],
    "specialConditionsAndExceptions": [
      "सार्वजनिक निकायको आफ्नै सुविधाका लागि (Termination for Convenience) सम्झौता अन्त्य गरिएमा ठेकेदारको जमानत जफत हुँदैन, सम्पन्न भएको काम र साइट हटाउने खर्च भुक्तानी गरिन्छ।",
      "काबू बाहिरको परिस्थिति लगातार ९० दिनभन्दा बढी रहेमा दुवै पक्षको सहमतिमा बिना दण्ड सम्झौता अन्त्य गर्न सकिन्छ।"
    ],
    "safeguardsAndAuditRisks": [
      "१४ दिने कानुनी सूचना नदिई हतारमा सम्झौता अन्त्य गरेमा अदालत वा पुनरावलोकन समितिले निर्णय बदर गरी ठेकेदारलाई क्षतिपूर्ति भराउन सक्छ।",
      "संयुक्त नापजाँच नगरी काम रोकेमा पछि सम्पन्न कामको परिमाणमा विवाद भई कानुनी जटिलता आउँछ।"
    ],
    "conclusion": "सम्झौता अन्त्य सार्वजनिक खरिदको सबैभन्दा कठोर कानुनी कदम हो। यसले आयोजनाको समय र लागत बढाउने भए तापनि गैरजिम्मेवार र लापरवाह ठेकेदारलाई पाठ सिकाउन र सार्वजनिक स्रोतको रक्षा गर्न यो अपरिहार्य हुन्छ। तसर्थ, प्रक्रियागत त्रुटिरहित ढङ्गले ऐन र नियमावलीका प्रत्येक चरण पूरा गरेर मात्र सम्झौता अन्त्य कार्यान्वयन गर्नुपर्छ।"
  }
];

// -------------------------------------------------------------
// ५. तुलनात्मक विश्लेषण (Comparative Analysis Matrices)
// -------------------------------------------------------------
export const COMPARATIVE_ANALYSES: ComparativeAnalysis[] = [
  {
    "id": "comp-1",
    "title": "राष्ट्रिय खुला बोलपत्र (NCB) र अन्तर्राष्ट्रिय खुला बोलपत्र (ICB) बीचको तुलना",
    "description": "सार्वजनिक खरिदमा स्वदेशी व्यवसायीको क्षमता र अन्तर्राष्ट्रिय प्रतिस्पर्धाको सन्तुलन मिलाउन यी दुई विधिको प्रयोग गरिन्छ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ८, १४, १५ तथा नियमावलीको नियम १८, ३१, ३१ङ।",
    "parameters": [
      "प्रतिस्पर्धाको दायरा",
      "लागत अनुमानको सीमा",
      "सूचना प्रकाशनको माध्यम",
      "सूचनाको न्यूनतम म्याद",
      "मुद्रा भुक्तानी",
      "भाषा र सर्तहरू",
      "घरेलु प्राथमिकता (Domestic Preference)",
      "विवाद समाधान"
    ],
    "columns": [
      {
        "name": "राष्ट्रिय खुला बोलपत्र (NCB)",
        "values": [
          "नेपाली फर्म तथा निर्माण व्यवसायीहरू बीच मात्र प्रतिस्पर्धा।",
          "निर्माण कार्यको हकमा रु २ करोडदेखि रु ५ अर्ब सम्म अनिवार्य NCB।",
          "कम्तीमा एक राष्ट्रिय दैनिक पत्रिका र अनिवार्य e-GP पोर्टलमा।",
          "पहिलो पटक कम्तीमा ३० दिन; दोस्रो पटक कम्तीमा १५ दिन।",
          "नेपाली रुपैयाँ (NPR) मा मात्र कबोल र भुक्तानी।",
          "नेपाली भाषा वा अंग्रेजी भाषा (PPMO को मानक SBD अनुसार)।",
          "लागू नहुने (सबै स्वदेशी नै हुने भएकाले)।",
          "नेपाल मध्यस्थता ऐन, २०५८ बमोजिम काठमाडौं वा नेपालभित्र मध्यस्थता।"
        ]
      },
      {
        "name": "अन्तर्राष्ट्रिय खुला बोलपत्र (ICB)",
        "values": [
          "विश्वभरिका योग्य अन्तर्राष्ट्रिय तथा स्वदेशी बोलपत्रदाताहरू।",
          "रु ५ अर्बभन्दा बढी लागत अनुमान भएका निर्माण कार्य वा देशभित्र प्रतिस्पर्धा नहुने वस्तु।",
          "अन्तर्राष्ट्रिय ख्यातिप्राप्त पत्रिका वा वेबसाइट, राष्ट्रिय दैनिक र e-GP।",
          "पहिलो पटक कम्तीमा ४५ दिन; दोस्रो पटक कम्तीमा २१ दिन।",
          "परिवर्त्य विदेशी मुद्रा (USD, EUR, आदि) वा नेपाली रुपैयाँ।",
          "अनिवार्य रूपमा अंग्रेजी भाषा र Incoterms (CIF, CIP, FOB)।",
          "स्वदेशी उद्योग तथा निर्माण व्यवसायीलाई ७.५% देखि १५% सम्म डोमेस्टिक प्रिफरेन्स।",
          "UNCITRAL वा अन्तर्राष्ट्रिय मध्यस्थता संस्था (ICC/FIDIC सर्त)।"
        ]
      }
    ],
    "keyTakeaway": "१६औँ संशोधनले स्वदेशी निर्माण व्यवसायीको क्षमता विकासका लागि रु ५ अर्ब सम्मका आयोजनामा विदेशीलाई रोकेर स्वदेशी बीच मात्र प्रतिस्पर्धा (NCB) अनिवार्य गरेको छ।"
  },
  {
    "id": "comp-2",
    "title": "मालसामान, निर्माण कार्य र परामर्श सेवा खरिद बीचको तुलना",
    "description": "खरिदको प्रकृति अनुसार कानूनी प्रक्रिया, मूल्याङ्कनको आधार र सम्झौता व्यवस्थापनमा मौलिक भिन्नता हुन्छ।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा २, ८, ९, १०, २५, ३० तथा नियमावलीका सम्बन्धित परिच्छेदहरू।",
    "parameters": [
      "खरिदको मूल स्वरूप",
      "लागत अनुमानको आधार",
      "छनोटको मूल आधार",
      "वार्ता (Negotiation)",
      "जमानत (Securities)",
      "कार्यसम्पादन परीक्षण",
      "सञ्चालन तथा मर्मत"
    ],
    "columns": [
      {
        "name": "मालसामान खरिद (Goods)",
        "values": [
          "भौतिक वस्तु, उपकरण, फर्निचर, कम्प्युटर, कच्चा पदार्थ।",
          "बजार मूल्य, अघिल्लो वर्षको खरिद दर, उत्पादकको क्याटलग मूल्य।",
          "प्राविधिक स्पेसिफिकेसन पूरा गर्ने न्यूनतम मूल्याङ्कित बोलपत्र।",
          "खुला बोलपत्रमा मूल्य वार्ता गर्न पूर्ण निषेध।",
          "बोलपत्र जमानत (२-३%), कार्यसम्पादन जमानत (५%)।",
          "निरीक्षण समितिद्वारा स्पेसिफिकेसन जाँच र दाखिला प्रतिवेदन।",
          "वारेन्टी अवधि (१-३ वर्ष) र स्पेयर पार्ट्सको उपलब्धता।"
        ]
      },
      {
        "name": "निर्माण कार्य (Works)",
        "values": [
          "भवन, सडक, पुल, खानेपानी, सिँचाइ जस्ता भौतिक पूर्वाधार।",
          "जिल्ला दररेट, नर्म्स, ड्रइङ, डिजाइन र परिमाणको लगत (BOQ)।",
          "१६औँ संशोधन अनुसार ३०% कट-अफ पश्चात औसत मूल्यसँग निकटतम बोलपत्र।",
          "दररेट घटाउन वार्ता गर्न पूर्ण प्रतिबन्ध।",
          "बोलपत्र जमानत (२-३%), कार्यसम्पादन जमानत (५% + APS)।",
          "नापजाँच किताब (MB), गुणस्तर परीक्षण (Lab Report) र कार्य सम्पन्न प्रतिवेदन।",
          "त्रुटि सच्याउने अवधि (DLP: सामान्य १ वर्ष) र ५% रिटेन्सन मनी।"
        ]
      },
      {
        "name": "परामर्श सेवा (Consulting)",
        "values": [
          "अध्ययन, अनुसन्धान, सर्भे, डिजाइन, सुपरिवेक्षण जस्ता बौद्धिक सेवा।",
          "कार्यक्षेत्रगत सर्त (TOR), जनशक्ति-महिना (Person-Months) र सरकारी दररेट।",
          "गुणस्तर तथा लागत (QCBS - ८०:२०), गुणस्तर (QBS) वा न्यूनतम लागत (LCS)।",
          "कार्यसर्त (TOR) र जनशक्तिको दररेटमा कानुनी वार्ता गर्न पाइने।",
          "सामान्यतः प्रस्ताव जमानत नमाग्ने; सम्झौतापछि कार्यसम्पादन जमानत (५%)।",
          "अन्तरिम प्रतिवेदन, ड्राफ्ट रिपोर्ट र अन्तिम प्रतिवेदनको स्वीकृति।",
          "व्यावसायिक दायित्व र बौद्धिक सम्पत्ति अधिकार (Copyright)।"
        ]
      }
    ],
    "keyTakeaway": "परामर्श सेवा बौद्धिक प्रकृतिको भएकाले मूल्य वार्ता गर्न पाइन्छ, तर मालसामान र निर्माणको खुला बोलपत्रमा वार्ता गर्नु गम्भीर कानुनी अनियमितता मानिन्छ।"
  },
  {
    "id": "comp-3",
    "title": "खुला बोलपत्र, सिलबन्दी दरभाउपत्र र सोझै खरिद बीचको तुलना",
    "description": "सार्वजनिक खरिदमा अवलम्बन गरिने तीन प्रमुख प्रतिस्पर्धी तथा गैर-प्रतिस्पर्धी विधिको तुलनात्मक विश्लेषण।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ८, ४०, ४१ तथा नियमावलीको नियम १८, ८४, ८५।",
    "parameters": [
      "आर्थिक सीमा",
      "प्रतिस्पर्धाको स्तर",
      "सूचनाको न्यूनतम म्याद",
      "प्रकाशनको माध्यम",
      "कागजात दस्तुर",
      "स्वीकृतिको मापदण्ड",
      "अपवाद र जोखिम"
    ],
    "columns": [
      {
        "name": "खुला बोलपत्र (Open Tender)",
        "values": [
          "रु २० लाखभन्दा माथि जुनसुकै रकम (असीमित)।",
          "पूर्ण खुला राष्ट्रिय तथा अन्तर्राष्ट्रिय प्रतिस्पर्धा।",
          "पहिलो पटक ३० दिन (ICB मा ४५ दिन)।",
          "राष्ट्रिय दैनिक पत्रिका र अनिवार्य e-GP पोर्टल।",
          "रु ३,००० देखि रु २०,००० सम्म लागत अनुसार।",
          "सारभूत रूपमा प्रभावग्राही र १६औँ संशोधन बमोजिम औसतसँग निकटतम।",
          "लामो समय लाग्ने भए पनि सबैभन्दा पारदर्शी र कानुनी रूपमा सुरक्षित।"
        ]
      },
      {
        "name": "सिलबन्दी दरभाउपत्र (Sealed Quotation)",
        "values": [
          "मालसामान/निर्माण: रु २० लाखसम्म; परामर्श: रु ५ लाखसम्म।",
          "दर्ता भएका इच्छुक फर्महरू बीच मध्यमस्तरको प्रतिस्पर्धा।",
          "पहिलो पटक कम्तीमा १५ दिन (दोस्रो पटक ७ दिन)।",
          "स्थानीय/राष्ट्रिय दैनिक वा निकायको वेबसाइट/सूचनापाटी।",
          "रु १,००० (एक हजार रुपैयाँ मात्र)।",
          "कम्तीमा ३ वटा रीतपूर्वकका दरभाउपत्रमध्ये न्यूनतम कबोल गर्ने।",
          "३ वटा दरभाउपत्र नपरेमा प्रक्रिया स्वतः रद्द हुने।"
        ]
      },
      {
        "name": "सोझै खरिद (Direct Procurement)",
        "values": [
          "सामान्य अवस्थामा रु ५ लाखसम्म; विशेष परिस्थितिमा रु २५ लाखसम्म।",
          "प्रतिस्पर्धा नहुने (एकल स्रोत - Single Source)।",
          "कुनै सार्वजनिक सूचना नचाहिने (सीधै कोटेशन माग)।",
          "कुनै सार्वजनिक माध्यम आवश्यक नपर्ने।",
          "कुनै दस्तुर नलाग्ने।",
          "यथार्थपरक दररेट र औचित्य पुष्टि गरी अधिकारप्राप्त अधिकारीको निर्णय।",
          "टुक्र्याएर खरिद गरेको वा मिलेमतो गरेको ठहरिने उच्च बेरुजु जोखिम।"
        ]
      }
    ],
    "keyTakeaway": "सोझै खरिद अपवाद मात्र हो, सामान्य अवस्थामा खुला प्रतिस्पर्धा नै मूल कानूनको आत्मा हो।"
  },
  {
    "id": "comp-4",
    "title": "बोलपत्र जमानत (Bid Security) र कार्यसम्पादन जमानत (Performance Security) बीचको तुलना",
    "description": "खरिद प्रक्रियामा बोलपत्रदातालाई आफ्नो प्रस्तावप्रति जिम्मेवार बनाउन र सम्झौता कार्यान्वयन सुनिश्चित गर्न मागिने दुई प्रमुख वित्तीय सुरक्षण।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा १८, २८ तथा नियमावलीको नियम ५२, ५३।",
    "parameters": [
      "उद्देश्य",
      "रकमको अनुपात",
      "ग्राह्य अवधि (Validity Period)",
      "जारी गर्ने निकाय",
      "जफत हुने अवस्था",
      "फिर्ता हुने समय",
      "थप जमानतको प्रावधान"
    ],
    "columns": [
      {
        "name": "बोलपत्र जमानत (Bid Security)",
        "values": [
          "बोलपत्रदाताले म्यादभित्र प्रस्ताव फिर्ता नलिओस् र छनोट भएमा सम्झौता गर्न आओस् भनी लिइने।",
          "लागत अनुमानको २% देखि ३% रकम बराबर।",
          "बोलपत्रको ग्राह्य अवधिभन्दा कम्तीमा ३० दिन बढी (९०+३० = १२० दिन वा १२०+३० = १५० दिन)।",
          "'क' वर्गको वाणिज्य बैंक वा विकास बैंकको बैंक ग्यारेन्टी वा नगद धरौटी।",
          "म्यादभित्र बिड फिर्ता लिएमा, गैरकानूनी मिलेमतो गरेमा वा सम्झौता गर्न नआएमा।",
          "सफल बोलपत्रदाताले सम्झौता गरेपछि र अन्य असफल बोलपत्रदातालाई निर्णय भएलगत्तै।",
          "बोलपत्रको म्याद थप भएमा सोही बमोजिम जमानतको म्याद थप गर्नुपर्ने।"
        ]
      },
      {
        "name": "कार्यसम्पादन जमानत (Performance Security)",
        "values": [
          "ठेक्का सम्झौता अनुसार काम गुणस्तरीय रूपमा तोकिएको समयभित्र सम्पन्न गराउन लिइने।",
          "कबोल रकमको ५% (१५% भन्दा बढी घटेमा थप APS सहित)।",
          "सम्झौताको कार्य सम्पन्न हुने मिति र त्रुटि सच्याउने अवधि (DLP) भन्दा १ महिना बढी।",
          "'क' वर्गको वाणिज्य बैंक वा विकास बैंकको विनासर्त (Unconditional) बैंक ग्यारेन्टी।",
          "सम्झौता उल्लंघन गरेमा, काम बीचैमा अलपत्र पारेमा वा सम्झौता अन्त्य (Termination) भएमा।",
          "काम सम्पन्न भई त्रुटि सच्याउने अवधि (DLP) पार भई अन्तिम परीक्षण प्रतिवेदन स्वीकृत भएपछि।",
          "भेरिएसन भएर सम्झौता रकम बढेमा वा म्याद थप भएमा सोही अनुपातमा थप जमानत अनिवार्य।"
        ]
      }
    ],
    "keyTakeaway": "बोलपत्र जमानतले सम्झौताको ढोकासम्म पुर्‍याउँछ भने कार्यसम्पादन जमानतले आयोजना सम्पन्न नभएसम्म सरकारी हितको रक्षा गर्छ।"
  },
  {
    "id": "comp-5",
    "title": "साविकको मूल्याङ्कन व्यवस्था र १६औँ संशोधनको औसत अङ्क छनोट व्यवस्थाको तुलना",
    "description": "सार्वजनिक खरिद नियमावलीको १६औँ संशोधनले निर्माण कार्यको ठेक्का छनोट विधिमा ल्याएको ऐतिहासिक रूपान्तरण।",
    "legalBasis": "सार्वजनिक खरिद ऐनको दफा २५(५क), २५(७क), २५(७ख) र नियमावलीको नियम ३१ज, ६५च।",
    "parameters": [
      "मूल्याङ्कनको मूल सिद्धान्त",
      "अत्यधिक न्यून बिडिङ नियन्त्रण",
      "न्यूनतम कट-अफ सीमा",
      "छनोट हुने आधार",
      "थप कार्यसम्पादन जमानत (APS)",
      "विकास निर्माणमा प्रभाव",
      "मिलेमतो नियन्त्रण"
    ],
    "columns": [
      {
        "name": "साविकको व्यवस्था (Pre-16th Amendment)",
        "values": [
          "न्यूनतम मूल्याङ्कित सारभूत रूपमा प्रभावग्राही (Lowest Evaluated Substantially Responsive)।",
          "कुनै फ्लोर मूल्य थिएन; जतिसुकै घटे पनि थप जमानत लिएर ठेक्का दिनुपर्ने बाध्यता।",
          "कुनै कट-अफ सीमा थिएन (४०-५०% घटे पनि स्वीकृत हुने)।",
          "सबैभन्दा कम रकम कबोल गर्ने नै स्वतः छनोट हुने।",
          "१५% भन्दा बढी घटेमा ५०% थप जमानत लिइने तर काम सम्पन्न नहुने जोखिम उच्च।",
          "आयोजना अलपत्र पर्ने, पेश्की लिएर भाग्ने र रुग्ण ठेक्काको संख्या अत्यधिक।",
          "कम मूल्य कबोल गर्ने एउटै समूहले धेरै ठेक्का ओगट्ने प्रवृत्ति।"
        ]
      },
      {
        "name": "१६औँ संशोधनको संशोधित व्यवस्था",
        "values": [
          "औसत मूल्यसँग निकटतम सारभूत रूपमा प्रभावग्राही (Closest to Average Price Bidding)।",
          "लागत अनुमानभन्दा ३०% भन्दा बढी घटेका बोलपत्र मूल्याङ्कनबाटै स्वतः बाहिर (Floor = 70%)।",
          "३०% भन्दा बढी घटेकालाई पूर्ण निषेध (Disqualification)।",
          "प्रभावग्राही बोलपत्रहरूको औसत मूल्य निकालिने र सो औसतसँग सबैभन्दा नजिक भएको छनोट हुने।",
          "१५% देखि ३०% बीच घटेकालाई मात्र नियम ५३(२) बमोजिम थप जमानत (APS) लिइने।",
          "यथार्थपरक दरमा ठेक्का सम्झौता भई समयमै गुणस्तरीय पूर्वाधार निर्माण हुने ग्यारेन्टी।",
          "कार्टेलिङ र अन्धाधुन्ध न्यून बिडिङ गर्ने विकृति सदाका लागि अन्त्य।"
        ]
      }
    ],
    "keyTakeaway": "१६औँ संशोधनले 'सस्तो नै उत्तम' भन्ने पुरानो भ्रम चिरेर 'यथार्थपरक र गुणस्तरीय नै उत्तम' भन्ने नवीन सिद्धान्त स्थापित गरेको छ।"
  },
  {
    "id": "comp-6",
    "title": "अमानतबाट गरिने काम (Force Account) र उपभोक्ता समिति बीचको तुलना",
    "description": "सार्वजनिक निकाय आफैँले काम गर्ने र स्थानीय समुदायलाई जिम्मा दिने दुई वैकल्पिक विधिको कानूनी सीमा।",
    "legalBasis": "सार्वजनिक खरिद ऐन, २०६३ को दफा ४२, ४३ तथा नियमावलीको नियम ९७, ९८।",
    "parameters": [
      "कार्यान्वयनकर्ता",
      "आर्थिक सीमा",
      "मेसिनरी प्रयोग",
      "पूर्वस्वीकृति",
      "जनसहभागिता",
      "लेखापरीक्षण र जोखिम"
    ],
    "columns": [
      {
        "name": "अमानतबाट गरिने काम (Force Account)",
        "values": [
          "सार्वजनिक निकाय आफैँले आफ्ना कर्मचारी र उपकरण प्रयोग गरी।",
          "तोकिएको निश्चित सीमाभित्र (विभागीय प्रमुखको स्वीकृतिमा)।",
          "निकायसँग उपलब्ध आफ्नै उपकरण र मेसिन प्रयोग गर्न पाइने।",
          "विभागीय प्रमुखको पूर्वस्वीकृति अनिवार्य।",
          "जनसहभागिता नहुने (विभागीय प्रत्यक्ष नियन्त्रण)।",
          "सरकारी कर्मचारी प्रत्यक्ष जिम्मेवार हुने र मस्टरोल/बिलको कडा लेखापरीक्षण।"
        ]
      },
      {
        "name": "उपभोक्ता समिति (Users Committee)",
        "values": [
          "आयोजनाबाट प्रत्यक्ष लाभ पाउने स्थानीय बासिन्दाहरूको समिति।",
          "स्वीकृत लागत अनुमान रु १ (एक) करोडसम्म।",
          "हेभी मेसिनरी (डोजर, एक्साभेटर) प्रयोग गर्न पूर्ण निषेध।",
          "स्थानीय तह वा सम्बन्धित निकायको निर्णयबाट गठन।",
          "अनिवार्य जनसहभागिता (श्रमदान वा लागत साझेदारी)।",
          "सामाजिक परीक्षण (Social Audit) अनिवार्य; ठेकेदार लगाएमा रकम असुलउपर।"
        ]
      }
    ],
    "keyTakeaway": "अमानत विभागीय क्षमता प्रदर्शन गर्ने विधि हो भने उपभोक्ता समिति स्थानीय जनतामा अपनत्व र रोजगारी सिर्जना गर्ने विधि हो।"
  }
];

// -------------------------------------------------------------
// ६. कानूनी तथ्य तथा संख्यात्मक सारणीहरू (Master Fact Tables)
// -------------------------------------------------------------
export const MASTER_TIMELINES_TABLE: MasterFactRow[] = [
  {
    "id": "time-1",
    "topic": "खुला बोलपत्र सूचना",
    "matter": "राष्ट्रिय खुला बोलपत्र आह्वानको पहिलो पटकको सूचना म्याद",
    "limitOrValue": "कम्तीमा ३० दिन",
    "legalRef": "ऐन दफा १४(४)(क)",
    "remarks": "दैनिक राष्ट्रिय पत्रिका र e-GP मा"
  },
  {
    "id": "time-2",
    "topic": "खुला बोलपत्र सूचना",
    "matter": "अन्तर्राष्ट्रिय खुला बोलपत्र (ICB) को पहिलो पटकको सूचना म्याद",
    "limitOrValue": "कम्तीमा ४५ दिन",
    "legalRef": "ऐन दफा १४(४)(ख)",
    "remarks": "अन्तर्राष्ट्रिय र राष्ट्रिय माध्यममा"
  },
  {
    "id": "time-3",
    "topic": "पुनः बोलपत्र सूचना",
    "matter": "दोस्रो पटक राष्ट्रिय खुला बोलपत्र आह्वानको म्याद",
    "limitOrValue": "कम्तीमा १५ दिन",
    "legalRef": "ऐन दफा १४(५)",
    "remarks": "सर्तहरू संशोधन नगरी"
  },
  {
    "id": "time-4",
    "topic": "पुनः बोलपत्र सूचना",
    "matter": "दोस्रो पटक अन्तर्राष्ट्रिय खुला बोलपत्र आह्वानको म्याद",
    "limitOrValue": "कम्तीमा २१ दिन",
    "legalRef": "ऐन दफा १४(५)",
    "remarks": "सर्तहरू संशोधन नगरी"
  },
  {
    "id": "time-5",
    "topic": "दरभाउपत्र",
    "matter": "सिलबन्दी दरभाउपत्रको पहिलो पटकको सूचना म्याद",
    "limitOrValue": "कम्तीमा १५ दिन",
    "legalRef": "नियम ८४(२)",
    "remarks": "स्थानीय वा राष्ट्रिय पत्रिकामा"
  },
  {
    "id": "time-6",
    "topic": "दरभाउपत्र",
    "matter": "सिलबन्दी दरभाउपत्र दोस्रो पटक आह्वान गर्दाको म्याद",
    "limitOrValue": "कम्तीमा ७ दिन",
    "legalRef": "नियम ८४(३)",
    "remarks": "पर्याप्त दरभाउपत्र नपरेमा"
  },
  {
    "id": "time-7",
    "topic": "आशयको सूचना (LOI)",
    "matter": "राष्ट्रिय बोलपत्रमा सम्झौता गर्ने आशयको सूचना (LOI) को म्याद",
    "limitOrValue": "७ दिन",
    "legalRef": "ऐन दफा २७(२)",
    "remarks": "उजुरी दिन पाउने अवधि"
  },
  {
    "id": "time-8",
    "topic": "आशयको सूचना (LOI)",
    "matter": "अन्तर्राष्ट्रिय बोलपत्रमा सम्झौता गर्ने आशयको सूचना (LOI) को म्याद",
    "limitOrValue": "१५ दिन",
    "legalRef": "ऐन दफा २७(२)",
    "remarks": "उजुरी दिन पाउने अवधि"
  },
  {
    "id": "time-9",
    "topic": "सम्झौता म्याद",
    "matter": "LOI म्याद सकिएपछि सम्झौता गर्न आउन दिइने म्याद",
    "limitOrValue": "१५ दिन",
    "legalRef": "ऐन दफा २७(३)",
    "remarks": "कार्यसम्पादन जमानत सहित"
  },
  {
    "id": "time-10",
    "topic": "म्याद थप निवेदन",
    "matter": "म्याद थपका लागि निर्माण व्यवसायीले निवेदन दिनुपर्ने समय",
    "limitOrValue": "म्याद सकिनुभन्दा कम्तीमा २१ दिन अगावै",
    "legalRef": "नियम १२०(१)",
    "remarks": "कारण र प्रमाणसहित"
  },
  {
    "id": "time-11",
    "topic": "कार्यालय प्रमुख उजुरी",
    "matter": "कार्यालय प्रमुखले पुनरावलोकन उजुरीमा निर्णय दिनुपर्ने म्याद",
    "limitOrValue": "उजुरी परेको ५ दिनभित्र",
    "legalRef": "ऐन दफा ४७(५)",
    "remarks": "लिखित निर्णय दिनुपर्ने"
  },
  {
    "id": "time-12",
    "topic": "PPRC उजुरी",
    "matter": "पुनरावलोकन समिति (PPRC) मा उजुरी दर्ता गर्ने हदम्याद",
    "limitOrValue": "कार्यालय प्रमुखको निर्णय भएको ७ दिनभित्र",
    "legalRef": "ऐन दफा ४९(१)",
    "remarks": "निर्णय नदिएमा पनि ७ दिनभित्र"
  },
  {
    "id": "time-13",
    "topic": "PPRC फैसला",
    "matter": "पुनरावलोकन समितिले सम्पूर्ण कागजात प्राप्त भएपछि निर्णय दिनुपर्ने म्याद",
    "limitOrValue": "३० दिनभित्र",
    "legalRef": "ऐन दफा ५०(१)",
    "remarks": "कारणसहितको फैसला"
  },
  {
    "id": "time-14",
    "topic": "सम्झौता अन्त्य",
    "matter": "सम्झौता अन्त्य गर्नुअघि दिनुपर्ने पूर्वचेतावनी (Notice to Correct)",
    "limitOrValue": "कम्तीमा १४ दिन",
    "legalRef": "नियम १२८",
    "remarks": "त्रुटि नसच्याएमा अन्त्य हुने"
  },
  {
    "id": "time-15",
    "topic": "अभिलेख संरक्षण",
    "matter": "खरिद सम्बन्धी सम्पूर्ण कागजात सुरक्षित राख्नुपर्ने न्यूनतम अवधि",
    "limitOrValue": "कम्तीमा ५ वर्षसम्म",
    "legalRef": "ऐन दफा ६५",
    "remarks": "सम्झौता सम्पन्न भएको मितिले"
  }
];

export const MASTER_FINANCIAL_TABLE: MasterFactRow[] = [
  {
    "id": "fin-1",
    "topic": "सोझै खरिद (Direct)",
    "matter": "सामान्य अवस्थामा एक वर्षमा एउटै व्यक्ति/फर्मबाट सोझै खरिद गर्न पाइने सीमा",
    "limitOrValue": "रु ५,००,००० (पाँच लाख रुपैयाँसम्म)",
    "legalRef": "नियम ८५(१)(क)",
    "remarks": "मालसामान, निर्माण वा सेवा"
  },
  {
    "id": "fin-2",
    "topic": "सोझै खरिद (विशेष)",
    "matter": "विशेष परिस्थितिमा कार्यालय प्रमुखले गर्न पाउने सोझै खरिद",
    "limitOrValue": "रु १०,००,००० (दश लाख रुपैयाँसम्म)",
    "legalRef": "नियम ८५(४)(क)",
    "remarks": "विपद् वा आपतकालीन अवस्थामा"
  },
  {
    "id": "fin-3",
    "topic": "सोझै खरिद (विभागीय)",
    "matter": "विशेष परिस्थितिमा विभागीय प्रमुखले गर्न पाउने सोझै खरिद",
    "limitOrValue": "रु २५,००,००० (पच्चीस लाख रुपैयाँसम्म)",
    "legalRef": "नियम ८५(४)(ख)",
    "remarks": "औचित्य पुष्टि गरी"
  },
  {
    "id": "fin-4",
    "topic": "दरभाउपत्र (Quotations)",
    "matter": "मालसामान वा निर्माण कार्य सिलबन्दी दरभाउपत्रबाट खरिद गर्ने अधिकतम सीमा",
    "limitOrValue": "रु २०,००,००० (बीस लाख रुपैयाँसम्म)",
    "legalRef": "नियम ८४(१)",
    "remarks": "कम्तीमा ३ वटा दरभाउपत्र अनिवार्य"
  },
  {
    "id": "fin-5",
    "topic": "दरभाउपत्र (परामर्श)",
    "matter": "परामर्श सेवा सिलबन्दी दरभाउपत्रबाट खरिद गर्ने अधिकतम सीमा",
    "limitOrValue": "रु ५,००,००० (पाँच लाख रुपैयाँसम्म)",
    "legalRef": "नियम ८४(१)",
    "remarks": "कम्तीमा ३ वटा प्रस्ताव अनिवार्य"
  },
  {
    "id": "fin-6",
    "topic": "उपभोक्ता समिति",
    "matter": "उपभोक्ता समिति वा लाभग्राही समुदायमार्फत निर्माण गराउन पाइने सीमा",
    "limitOrValue": "रु १,००,००,००० (एक करोड रुपैयाँसम्म)",
    "legalRef": "नियम ९७(१)",
    "remarks": "हेभी मेसिनरी पूर्ण निषेध"
  },
  {
    "id": "fin-7",
    "topic": "वार्षिक खरिद योजना",
    "matter": "वार्षिक खरिद योजना (Annual Plan) बनाउनु अनिवार्य हुने खरिद रकम सीमा",
    "limitOrValue": "रु १०,००,००० (दश लाख रुपैयाँभन्दा बढी)",
    "legalRef": "नियम ८(१)",
    "remarks": "बजेट स्वीकृतिको १५ दिनभित्र"
  },
  {
    "id": "fin-8",
    "topic": "खरिद गुरुयोजना",
    "matter": "खरिद गुरुयोजना (Master Plan) बनाउनु अनिवार्य हुने आयोजना सीमा",
    "limitOrValue": "रु १०,००,००,००० (दश करोड रुपैयाँभन्दा बढी)",
    "legalRef": "नियम ७(१)",
    "remarks": "वा १ वर्षभन्दा बढी अवधिको आयोजना"
  },
  {
    "id": "fin-9",
    "topic": "स्वदेशी बोलपत्र (NCB)",
    "matter": "१६औँ संशोधन अनुसार स्वदेशी व्यवसायी बीच मात्र प्रतिस्पर्धा हुने निर्माण सीमा",
    "limitOrValue": "रु २ करोडदेखि रु ५ अर्ब सम्म",
    "legalRef": "नियम ३१ङ(१)",
    "remarks": "नेपाली व्यवसायी मात्र सहभागी"
  },
  {
    "id": "fin-10",
    "topic": "अन्तर्राष्ट्रिय बोलपत्र (ICB)",
    "matter": "निर्माण कार्यमा अन्तर्राष्ट्रिय खुला बोलपत्र आह्वान गर्नुपर्ने न्यूनतम सीमा",
    "limitOrValue": "रु ५,००,००,००,००० (पाँच अर्ब रुपैयाँभन्दा बढी)",
    "legalRef": "नियम ३१ङ",
    "remarks": "वा सहायता सम्झौताको सर्त अनुसार"
  }
];

export const MASTER_PERCENTAGES_TABLE: MasterFactRow[] = [
  {
    "id": "pct-1",
    "topic": "स्वदेशी मालसामान",
    "matter": "स्वदेशी मालसामान मानिनका लागि आवश्यक न्यूनतम मूल्य अभिवृद्धि",
    "limitOrValue": "३०% (तीस प्रतिशत)",
    "legalRef": "दफा २(न१)",
    "remarks": "नेपालमै उत्पादित वा भ्यालु एडेड"
  },
  {
    "id": "pct-2",
    "topic": "घरेलु प्राथमिकता",
    "matter": "अन्तर्राष्ट्रिय बोलपत्र (ICB) मा स्वदेशी उत्पादकलाई दिन सकिने प्राथमिकता",
    "limitOrValue": "७.५% देखि १५% सम्म",
    "legalRef": "नियम १८(ख)",
    "remarks": "Domestic Preference"
  },
  {
    "id": "pct-3",
    "topic": "बोलपत्र जमानत (Bid Bond)",
    "matter": "लागत अनुमानको आधारमा मागिने बोलपत्र जमानतको अनुपात",
    "limitOrValue": "२% देखि ३% सम्म",
    "legalRef": "नियम ५२(१)",
    "remarks": "मान्यता अवधि + ३० दिन ग्राह्य"
  },
  {
    "id": "pct-4",
    "topic": "कार्यसम्पादन जमानत",
    "matter": "कबोल रकमको आधारमा लिइने सामान्य कार्यसम्पादन जमानतको दर",
    "limitOrValue": "५% (पाँच प्रतिशत)",
    "legalRef": "नियम ५३(१)",
    "remarks": "DLP अवधि + १ महिना ग्राह्य"
  },
  {
    "id": "pct-5",
    "topic": "न्यून बिडिङ कट-अफ",
    "matter": "१६औँ संशोधन अनुसार मूल्याङ्कनबाटै स्वतः बाहिरिने अत्यधिक न्यून कबोल सीमा",
    "limitOrValue": "लागत अनुमान भन्दा ३०% भन्दा बढी घटेको",
    "legalRef": "दफा २५(७ख), नियम ६५च",
    "remarks": "Floor Price = ७०% of Estimate"
  },
  {
    "id": "pct-6",
    "topic": "थप जमानत (APS)",
    "matter": "लागत अनुमानभन्दा १५% भन्दा बढी घटेकोमा लाग्ने थप जमानत सूत्र",
    "limitOrValue": "५% + [(८५% लागत अनुमान - कबोल) × ५०%]",
    "legalRef": "नियम ५३(२)",
    "remarks": "१५% देखि ३०% बीचको कबोलमा"
  },
  {
    "id": "pct-7",
    "topic": "अग्रिम भुक्तानी (पेश्की)",
    "matter": "निर्माण कार्यमा बैंक ग्यारेन्टी लिई दिन सकिने मोबिलाइजेसन पेश्की",
    "limitOrValue": "१०% (विशेष अवस्थामा अधिकतम २०%)",
    "legalRef": "नियम ५५",
    "remarks": "१००% बैंक जमानतमा समानुपातिक कट्टी"
  },
  {
    "id": "pct-8",
    "topic": "रिटेन्सन मनी (धरौटी)",
    "matter": "प्रत्येक रनिङ बिल भुक्तानीबाट कट्टी गरिने धरौटी रकमको दर",
    "limitOrValue": "५% (पाँच प्रतिशत)",
    "legalRef": "नियम १२५",
    "remarks": "DLP सकिएपछि मात्र फिर्ता"
  },
  {
    "id": "pct-9",
    "topic": "पूर्वनिर्धारित क्षतिपूर्ति (LD)",
    "matter": "ढिलाइ भए बापत प्रतिदिन कट्टी गरिने लिक्विडेटेड ड्यामेज दर",
    "limitOrValue": "प्रतिदिन ०.०५% (अधिकतम १०% सम्म)",
    "legalRef": "नियम १२१",
    "remarks": "सम्झौता रकमको आधारमा (२०० दिन)"
  },
  {
    "id": "pct-10",
    "topic": "भेरिएसन आदेश सीमा",
    "matter": "सम्झौता कार्यान्वयनमा गर्न सकिने अधिकतम भेरिएसन आदेश सीमा",
    "limitOrValue": "सामान्य १५%; विशेष अवस्थामा अधिकतम २५%",
    "legalRef": "नियम १११",
    "remarks": "२५% माथि सम्झौता अन्त्य गर्नुपर्ने"
  },
  {
    "id": "pct-11",
    "topic": "मूल्य समायोजन थ्रेसहोल्ड",
    "matter": "मूल्य समायोजन दाबी गर्न मूल्य वृद्धि हुनुपर्ने न्यूनतम सीमा",
    "limitOrValue": "१०% भन्दा बढी वृद्धि (अधिकतम २५% सम्म)",
    "legalRef": "नियम ११८",
    "remarks": "१२ महिनाभन्दा लामो सम्झौतामा"
  },
  {
    "id": "pct-12",
    "topic": "PPRC पुनरावलोकन धरौटी",
    "matter": "सार्वजनिक खरिद पुनरावलोकन समितिमा उजुरी दिँदा राख्नुपर्ने नगद धरौटी",
    "limitOrValue": "कबोल रकमको ०.१५% (शून्य दशमलव एक पाँच)",
    "legalRef": "नियम १०३",
    "remarks": "झुट्टा ठहरिए जफत हुने"
  }
];

export const MASTER_AUTHORITIES_TABLE: MasterFactRow[] = [
  {
    "id": "auth-1",
    "topic": "लागत अनुमान स्वीकृति",
    "matter": "राजपत्राङ्कित अनंकित वा शाखा प्रमुखले स्वीकृत गर्न पाउने सीमा",
    "limitOrValue": "रु १० लाखसम्म",
    "legalRef": "नियम १६(१)(क)",
    "remarks": "आफ्नै कार्यालयको"
  },
  {
    "id": "auth-2",
    "topic": "लागत अनुमान स्वीकृति",
    "matter": "राजपत्राङ्कित प्रथम/द्वितीय श्रेणीको कार्यालय प्रमुखले स्वीकृत गर्न पाउने",
    "limitOrValue": "रु ५ करोडसम्म",
    "legalRef": "नियम १६(१)(ख)",
    "remarks": "विभागीय प्रमुख नभएको अवस्थामा"
  },
  {
    "id": "auth-3",
    "topic": "लागत अनुमान स्वीकृति",
    "matter": "विभागीय प्रमुख (महानिर्देशक/कार्यकारी निर्देशक) ले स्वीकृत गर्न पाउने",
    "limitOrValue": "रु १० करोडसम्म",
    "legalRef": "नियम १६(१)(ग)",
    "remarks": "मातहतका कार्यालयहरूको"
  },
  {
    "id": "auth-4",
    "topic": "लागत अनुमान स्वीकृति",
    "matter": "मन्त्रालयका सचिव वा संवैधानिक निकायका विशिष्ट श्रेणीले स्वीकृत गर्ने",
    "limitOrValue": "रु १० करोडभन्दा माथि जुनसुकै रकम",
    "legalRef": "नियम १६(१)(घ)",
    "remarks": "उच्चतम वित्तीय अधिकार"
  },
  {
    "id": "auth-5",
    "topic": "भेरिएसन आदेश स्वीकृति",
    "matter": "कार्यालय प्रमुखले स्वीकृत गर्न पाउने भेरिएसन आदेश सीमा",
    "limitOrValue": "मूल सम्झौताको १०% सम्म",
    "legalRef": "नियम १११(१)(ख)",
    "remarks": "प्राविधिक औचित्य सहित"
  },
  {
    "id": "auth-6",
    "topic": "भेरिएसन आदेश स्वीकृति",
    "matter": "विभागीय प्रमुखले स्वीकृत गर्न पाउने भेरिएसन आदेश सीमा",
    "limitOrValue": "मूल सम्झौताको १५% सम्म",
    "legalRef": "नियम १११(१)(ग)",
    "remarks": "प्राविधिक औचित्य सहित"
  },
  {
    "id": "auth-7",
    "topic": "भेरिएसन आदेश स्वीकृति",
    "matter": "मन्त्रालयका सचिवस्तरबाट स्वीकृत गर्नुपर्ने भेरिएसन आदेश सीमा",
    "limitOrValue": "१५% भन्दा माथि २५% सम्म",
    "legalRef": "नियम १११(१)(घ)",
    "remarks": "कडा सर्त र थप बजेटमा"
  },
  {
    "id": "auth-8",
    "topic": "म्याद थप स्वीकृति",
    "matter": "६ महिनासम्मको म्याद थप स्वीकृत गर्ने अधिकारी",
    "limitOrValue": "कार्यालय प्रमुख",
    "legalRef": "नियम १२०",
    "remarks": "मनासिब कारण प्रमाणित भएमा"
  },
  {
    "id": "auth-9",
    "topic": "म्याद थप स्वीकृति",
    "matter": "६ महिनादेखि १ वर्षसम्मको म्याद थप स्वीकृत गर्ने अधिकारी",
    "limitOrValue": "विभागीय प्रमुख",
    "legalRef": "नियम १२०",
    "remarks": "मनासिब कारण प्रमाणित भएमा"
  },
  {
    "id": "auth-10",
    "topic": "म्याद थप स्वीकृति",
    "matter": "१ वर्षभन्दा बढी वा जटिल आयोजनाको म्याद थप स्वीकृत गर्ने",
    "limitOrValue": "मन्त्रालयको सचिव",
    "legalRef": "नियम १२०",
    "remarks": "मन्त्रिपरिषद्/सचिवस्तर निर्णय"
  },
  {
    "id": "auth-11",
    "topic": "कालोसूची निर्णय",
    "matter": "निर्माण व्यवसायी वा आपूर्तिकर्तालाई कालोसूचीमा राख्ने निर्णय गर्ने निकाय",
    "limitOrValue": "सार्वजनिक खरिद अनुगमन कार्यालय (PPMO)",
    "legalRef": "ऐन दफा ६३",
    "remarks": "निकायको सिफारिसमा १-३ वर्ष"
  },
  {
    "id": "auth-12",
    "topic": "पुनरावलोकन निर्णय",
    "matter": "खरिद निर्णयविरुद्धको उजुरीमा अन्तिम अर्धन्यायिक निर्णय दिने निकाय",
    "limitOrValue": "सार्वजनिक खरिद पुनरावलोकन समिति (PPRC)",
    "legalRef": "ऐन दफा ५०",
    "remarks": "केशरमहल, काठमाडौं"
  }
];

// Re-export existing procurement dilemmas for seamless backwards compatibility & Case Studies integration
export { PROCUREMENT_DILEMMAS, type ProcurementDilemma } from './procurementDilemmasData';
