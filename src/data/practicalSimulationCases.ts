import {
  SimulationAnswerKey,
  SimulationCaseVersion,
  SimulationCriterion,
  SimulationLegalReference,
  SimulationMockDocument,
  SimulationTargetAudience,
} from '../types/simulation';

interface LocalLegalReferenceDefinition {
  id: string;
  lawName: string;
  clause: string;
  summary: string;
}

interface LocalPrecedentDefinition {
  id: string;
  collection: 'PPMO राय' | 'PPRC निर्णय';
  clause: string;
  summary: string;
  sourceVersion: string;
}

const createLocalLegalReferences = (
  definitions: LocalLegalReferenceDefinition[],
): SimulationLegalReference[] => definitions.map((reference) => ({
  ...reference,
  officialUrl: 'https://ppmo.gov.np/',
  sourceVersion: 'सार्वजनिक खरिद ऐन तथा नियमावली संग्रह',
  lastCheckedAt: null,
  verificationNote: 'यहाँ उद्धरण गरिएको पाठ अभ्यासका लागि मात्र हो; कानूनमा भएका संशोधन र एकीकृत कानुनी पाठ आधिकारिक स्रोतबाट पुष्टि गर्नुहोस्।',
  appTab: 'law-corpus',
}));

const createLocalPrecedentReferences = (
  definitions: LocalPrecedentDefinition[],
): SimulationLegalReference[] => definitions.map((reference) => ({
  id: reference.id,
  lawName: reference.collection,
  clause: reference.clause,
  summary: reference.summary,
  officialUrl: 'https://ppmo.gov.np/',
  sourceVersion: reference.sourceVersion.replace(/^[a-zA-Z0-9_]+\.ts\s*·\s*/, `${reference.collection} संग्रह · `),
  lastCheckedAt: null,
  verificationNote: 'यो PPMO राय र PPRC निर्णय संग्रहमा रहेको विगतको राय/निर्णयको अभ्यास-सार हो; हाल लागू कानूनको स्वतन्त्र पुष्टि होइन। पूरा निर्णय र वर्तमान कानुनी पाठ जाँच्नुहोस्।',
  appTab: 'ppmo-pprc',
}));

export const SIMULATION_LEGAL_REFERENCES: SimulationLegalReference[] = [
  {
    id: 'act-section-5',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा ५ — लागत अनुमान',
    summary: 'खरिदको लागत अनुमान तयार गर्ने विषय। यहाँको अभ्यासले दफा/नियमको सार मात्र देखाउँछ; कार्यालयको निर्णयअघि लागू एकीकृत पाठ हेर्नुहोस्।',
    officialUrl: 'https://lawcommission.gov.np/content/12891/12891-public-procurement-act-2063/',
    sourceVersion: 'उपलब्ध ऐनको पाठ; हाल लागू भएको संशोधन पुनः जाँच आवश्यक',
    lastCheckedAt: null,
    verificationNote: 'नेपाल कानून आयोगको आधिकारिक पृष्ठबाट यस सत्रमा पाठ प्राप्त हुन सकेन; कानुनी निष्कर्षका रूपमा प्रयोग नगर्नुहोस्।',
  },
  {
    id: 'act-section-8',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा ८ — खरिद विधि छनोट',
    summary: 'खरिदको प्रकृति, अवस्था र लागू मूल्य-सीमाका आधारमा विधि छनोट गर्नुपर्ने आधार। अभ्यासमा कुनै खरिद सीमा hard-code गरिएको छैन।',
    officialUrl: 'https://ppmo.gov.np/content/13336/public-procurement--second-amendment--act--2083/',
    sourceVersion: 'PPMO को ऐन संशोधन सूची',
    lastCheckedAt: null,
    verificationNote: 'PPMO लिंकको पाठ यस सत्रमा प्राप्त हुन सकेन; दफा र हाल प्रावधानको आधिकारिक पुष्टि गर्नुहोस्।',
  },
  {
    id: 'act-section-9',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा ९ — खुला बोलपत्र',
    summary: 'ऐनमा अन्यथा व्यवस्था नभएसम्म खुला प्रतिस्पर्धालाई प्राथमिकता दिने सामान्य आधार। लागू हुने अपवाद र संशोधन जाँच्नुहोस्।',
    officialUrl: 'https://ppmo.gov.np/content/13336/public-procurement--second-amendment--act--2083/',
    sourceVersion: 'PPMO को ऐन संशोधन सूची',
    lastCheckedAt: null,
    verificationNote: 'कानुनी व्याख्या होइन; लागू एकीकृत ऐन र खरिद कागजातसँग मिलाएर जाँच्नुहोस्।',
  },
  {
    id: 'act-section-23',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा २३ — बोलपत्र परीक्षण',
    summary: 'योग्यता, आवश्यक कागजात, जमानत र बोलपत्रका शर्त परीक्षण गर्ने आधार।',
    officialUrl: 'https://lawcommission.gov.np/content/12891/12891-public-procurement-act-2063/',
    sourceVersion: 'स्थानीय ऐन पाठ; हाल लागू संशोधन पुनः जाँच आवश्यक',
    lastCheckedAt: null,
    verificationNote: 'अभ्यासको परिदृश्यमा बोलपत्र कागजातका काल्पनिक मापदण्ड प्रयोग गरिएका छन्; वास्तविक कारबाहीमा स्वीकृत कागजात र हाल लागू हुने कानून हेर्नुहोस्।',
  },
  {
    id: 'act-section-25',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा २५ — बोलपत्र मूल्याङ्कन',
    summary: 'प्रभावग्राही बोलपत्रको मूल्याङ्कन गर्ने आधार। न्यून कबोल मात्रका आधारमा छनोट हुँदैन।',
    officialUrl: 'https://lawcommission.gov.np/content/12891/12891-public-procurement-act-2063/',
    sourceVersion: 'खरिद ऐनको प्रावधान; हाल लागू संशोधन पुनः जाँच आवश्यक',
    lastCheckedAt: null,
    verificationNote: 'अभ्यासमा मूल्याङ्कनका मापदण्ड काल्पनिक बोलपत्र कागजातमै दिइएका छन्; वास्तविक नतिजा कागजात र हाल लागू हुने कानूनले निर्धारण गर्छ।',
  },
  {
    id: 'act-section-54',
    lawName: 'सार्वजनिक खरिद ऐन, २०६३',
    clause: 'दफा ५४ — भेरिएसन आदेश',
    summary: 'पूर्वानुमान गर्न नसकिएको परिस्थिति र अधिकारप्राप्त अधिकारीको प्रक्रियाअनुसार भेरिएसन आदेश सम्बन्धी आधार।',
    officialUrl: 'https://lawcommission.gov.np/content/12891/12891-public-procurement-act-2063/',
    sourceVersion: 'खरिद ऐनको प्रावधान; हाल लागू हुने कानूनी व्यवस्था पुनः जाँच आवश्यक',
    lastCheckedAt: null,
    verificationNote: 'हाल लागू अधिकार-सीमा र संशोधन आधिकारिक पाठबाट पुष्टि गर्नुपर्नेछ; अभ्यासले प्रतिशत-सीमा निर्धारण गर्दैन।',
  },
  {
    id: 'rules-7-8',
    lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
    clause: 'नियम ७ र ८ — गुरुयोजना तथा वार्षिक खरिद योजना',
    summary: 'खरिद गुरुयोजना र वार्षिक खरिद योजनामा खरिद प्रकार, प्याकेज, समयतालिका, विधि र सम्झौता प्रकार जस्ता विवरण समेट्ने आधार।',
    officialUrl: 'https://ppmo.gov.np/content/13339/public-procurement--fifteenth-amendment--rules--2083/',
    sourceVersion: 'PPMO सूचीमा सार्वजनिक खरिद (पन्ध्रौँ संशोधन) नियमावली, २०८३ (३० असार, २०८३)',
    lastCheckedAt: '2026-11-21',
    verificationNote: 'PPMO पृष्ठको शीर्षक/मिति जाँचिएको; यसले प्रत्येक उपनियमको हाल कायम रहेको प्रावधानको प्रत्याभूति गर्दैन।',
  },
  {
    id: 'rules-8-9',
    lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
    clause: 'नियम ८ र ९ — वार्षिक योजना तथा लागत अनुमान',
    summary: 'वार्षिक खरिद योजना र लागत अनुमान तयार गर्दा विचार गर्नुपर्ने विवरणको अभ्यास-सन्दर्भ।',
    officialUrl: 'https://ppmo.gov.np/content/13339/public-procurement--fifteenth-amendment--rules--2083/',
    sourceVersion: 'PPMO सूचीमा सार्वजनिक खरिद (पन्ध्रौँ संशोधन) नियमावली, २०८३ (३० असार, २०८३)',
    lastCheckedAt: '2026-11-21',
    verificationNote: 'PPMO पृष्ठको शीर्षक/मिति जाँचिएको; उपनियमको हाल लागू हुने प्रावधान सुनिश्चित गर्नुहोस्।',
  },
  {
    id: 'rules-64-66',
    lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
    clause: 'नियम ६४–६६ — मूल्याङ्कन तथा प्रतिवेदन',
    summary: 'बोलपत्र मूल्याङ्कनका प्रकाशित आधार र मूल्याङ्कन प्रतिवेदनमा समेटिने विवरणको अभ्यास-सन्दर्भ।',
    officialUrl: 'https://ppmo.gov.np/content/13339/public-procurement--fifteenth-amendment--rules--2083/',
    sourceVersion: 'PPMO सूचीमा सार्वजनिक खरिद (पन्ध्रौँ संशोधन) नियमावली, २०८३ (३० असार, २०८३)',
    lastCheckedAt: '2026-11-21',
    verificationNote: 'PPMO पृष्ठको शीर्षक/मिति जाँचिएको; मूल्याङ्कनअघि हाल लागू कानूनी प्रावधान र बोलपत्र कागजात जाँच्नुहोस्।',
  },
  {
    id: 'rules-118',
    lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
    clause: 'नियम ११८ — भेरिएसन सम्बन्धी कार्यविधि',
    summary: 'निर्माण कार्यको भेरिएसनका लागि कारण, प्राविधिक पुष्ट्याइँ र अधिकारसम्बन्धी विवरण राख्ने अभ्यास-सन्दर्भ।',
    officialUrl: 'https://ppmo.gov.np/content/13339/public-procurement--fifteenth-amendment--rules--2083/',
    sourceVersion: 'PPMO सूचीमा सार्वजनिक खरिद (पन्ध्रौँ संशोधन) नियमावली, २०८३ (३० असार, २०८३)',
    lastCheckedAt: '2026-11-21',
    verificationNote: 'PPMO पृष्ठको शीर्षक/मिति जाँचिएको; हाल लागू प्रक्रिया र अधिकार-सीमा आधिकारिक पाठबाट पुष्टि गर्नुहोस्।',
  },
  {
    id: 'ppmo-opinion-10',
    lawName: 'PPMO राय परामर्श संग्रह',
    clause: 'राय नं. १० — योजना र काम टुक्र्याउने विषय',
    summary: 'विगतको PPMO राय परामर्श: कुल लागत अनुमान र स्वीकृत कार्यक्रमको आधारमा खरिद प्रक्रिया अघि बढाउने; तर सीमा छल्न वा उपभोक्ता समितिकै लागि भनी काम टुक्रा-टुक्रा (Fragmentation) गर्न नपाइने सिद्धान्त; हाल लागू नियमावली संशोधन र सीमा जाँच्नुहोस्।',
    officialUrl: 'https://ppmo.gov.np/',
    sourceVersion: 'PPMO राय संग्रह · राय १० · मिति २०६५.११.९',
    lastCheckedAt: null,
    verificationNote: 'स्थानीय राय र नजिर संग्रहको अभ्यास-सन्दर्भ मात्र; हाल लागू कानूनी ऐन/नियम र स्वीकृत खरिद कागजात हेरेर आधिकारिक निर्णय गर्नुहोस्।',
    appTab: 'ppmo-pprc',
  },
  {
    id: 'pprc-decision-3',
    lawName: 'PPRC पुनरावलोकन निर्णय संग्रह',
    clause: 'निर्णय नं. ३ — मूल्याङ्कन प्रमाण र पुनर्मूल्याङ्कन',
    summary: 'PPRC निर्णय संग्रहमा विगतको निर्णयमा पेश गरिएको आय विवरणको प्रमाणलाई नहेरी प्राविधिक प्रस्ताव असफल ठहर गरिएको विषयमा पुनर्मूल्याङ्कन आदेश भएको छ। वास्तविक परीक्षणमा हाल लागू कागजात र कानून नै निर्णायक हुन्छन्।',
    officialUrl: 'https://ppmo.gov.np/',
    sourceVersion: 'PPRC पुनरावलोकन निर्णय संग्रह · निर्णय ३ · मिति २०७५ असार ६',
    lastCheckedAt: null,
    verificationNote: 'यो विगतको निर्णयको सार हो; नियम संशोधन हुन सक्छ। वर्तमान कानुनी प्रभावका रूपमा नलिई स्थानीय संग्रहमा पूरा निर्णय हेर्नुहोस्।',
    appTab: 'ppmo-pprc',
  },
  ...createLocalLegalReferences([
    {
      id: 'act-section-4a',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा ४क — खरिदपूर्व तयारी',
      summary: 'बजेट, साइट, स्वीकृति तथा आवश्यक पूर्वतयारी पूरा भएपछि मात्र खरिद कारबाही अघि बढाउने सन्दर्भ।',
    },
    {
      id: 'act-section-26',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा २६ — बोलपत्र अस्वीकृत वा कारबाही रद्द',
      summary: 'बोलपत्र अस्वीकृति वा प्रक्रिया रद्द गर्दा कानुनी आधार, मूल्याङ्कन अभिलेख र अधिकारप्राप्त निर्णय आवश्यक हुने सन्दर्भ।',
    },
    {
      id: 'act-section-37',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा ३६–३७ — परामर्श सेवा मूल्याङ्कन/वार्ता',
      summary: 'परामर्श सेवाको प्रकाशित मूल्याङ्कन विधि, क्रम र वार्ता प्रक्रिया मिलाएर लागू गर्ने अभ्यास-सन्दर्भ।',
    },
    {
      id: 'act-section-47-51',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा ४७–५१ — पुनरावलोकन प्रक्रिया',
      summary: 'उजुरी, पुनरावलोकन, निर्णय कार्यान्वयन र खरिद कार्य रोक्का सम्बन्धी लागू व्यवस्था जाँच्ने सन्दर्भ; यहाँ कुनै म्याद/सीमा hard-code गरिएको छैन।',
    },
    {
      id: 'act-section-53-55',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा ५३–५५ — सम्झौता, संशोधन र मूल्य समायोजन',
      summary: 'सम्झौता कागजात, संशोधनको आधार र मूल्य समायोजनसम्बन्धी व्यवस्था सँगसँगै परीक्षण गर्ने सन्दर्भ।',
    },
    {
      id: 'act-section-59-63',
      lawName: 'सार्वजनिक खरिद ऐन, २०६३',
      clause: 'दफा ५९–६३ — सम्झौता अन्त्य र कालोसूची',
      summary: 'सम्झौता अन्त्य वा कालोसूची सिफारिसमा प्रमाण, सुनुवाइ र वैधानिक प्रक्रियाको भूमिका बुझ्ने सन्दर्भ।',
    },
    {
      id: 'rules-6-10',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ६–१० — स्थल, योजना र लागत अनुमान',
      summary: 'साइट/पूर्वतयारी, खरिद योजना र लागत अनुमानको सम्बन्ध बुझ्ने अभ्यास-सन्दर्भ।',
    },
    {
      id: 'rules-28-35',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम २८–३५ — संयुक्त उपक्रम/पूर्वयोग्यता',
      summary: 'JV का भूमिका/योग्यता र पूर्वयोग्यतापछि प्रकाशित प्रतिस्पर्धी चरण कायम राख्ने अभ्यास-सन्दर्भ।',
    },
    {
      id: 'rules-40-66',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ४०–६६ — बोलपत्र दाखिला, परीक्षण र मूल्याङ्कन',
      summary: 'बोलपत्रसाथ पेश गर्नुपर्ने प्रमाण, परीक्षण र मूल्याङ्कन गर्दा कागजातका प्रकाशित शर्त मिलाएर हेर्ने सन्दर्भ।',
    },
    {
      id: 'rules-49-59',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ४९–५९ — सूचना, स्पष्टीकरण र बोलपत्र खोल्ने',
      summary: 'सूचना/संशोधन, स्पष्टीकरण र खोल्ने चरणमा समान व्यवहार तथा समयक्रम कायम गर्ने अभ्यास-सन्दर्भ।',
    },
    {
      id: 'rules-88',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ८८ — खाद्य/रासन खरिद',
      summary: 'रासन वा विशेष वस्तुको खरिदमा लागू व्यवसायिक योग्यता र लागत अनुमानको हालको नियम पुष्टि गर्ने सन्दर्भ।',
    },
    {
      id: 'rules-110-119',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ११०–११९ — सम्झौता, जमानत र मूल्य समायोजन',
      summary: 'कार्यक्षम्पादन जमानत, सम्झौता कार्यान्वयन र मूल्य समायोजनसम्बन्धी प्रक्रिया जाँच्ने सन्दर्भ।',
    },
    {
      id: 'rules-63',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ६३ — एक मात्र बोलपत्र स्वीकृत गर्ने कार्यविधि',
      summary: 'एक मात्र बोलपत्र दर्ता भएमा वा अन्य अयोग्य भई एउटा मात्र सारभूत रूपमा प्रभावग्राही भएमा, प्रकाशित शर्त पूरा भएको र दर उचित भएको यकिन गरी अधिकारप्राप्त अधिकारीले स्वीकृत गर्न सक्ने व्यवस्था।',
    },
    {
      id: 'rules-65-4',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ६५(४) — लागत अनुमानभन्दा बढी कबोल परेको अवस्था',
      summary: 'न्यूनतम मूल्याङ्कित सारभूत रूपमा प्रभावग्राही बोलपत्र लागत अनुमानभन्दा बढी भएमा बजेट उपलब्धता, औचित्य र अधिकारप्राप्त अधिकारीको निर्णयबाट मात्र स्वीकृत वा रद्द गर्न सकिने; हचुवा वार्ता निषेध।',
    },
    {
      id: 'rules-97',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ९७ — उपभोक्ता समितिबाट निर्माण कार्य गराउने विधि',
      summary: 'उपभोक्ता समितिबाट कार्य गराउँदा श्रममूलक कार्य हुनुपर्ने, हेभी मेसिनरी प्रयोग निषेध र ठेकेदारलाई काम दिन नपाइने कानुनी सीमा।',
    },
    {
      id: 'rules-120',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम १२० — म्याद थप तथा हर्जाना (Liquidated Damages)',
      summary: 'सार्वजनिक निकायको ढिलाइ वा क्षतिपूर्ति घटनामा हर्जानाबिना म्याद थप; निर्माण व्यवसायीको ढिलाइमा नियमानुसार हर्जाना कट्टा गरी म्याद थप गर्ने व्यवस्था।',
    },
    {
      id: 'rules-64-6',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम ६४(६) — समान कबोल (Tie) परेको अवस्था',
      summary: 'दुई वा बढी बोलपत्रदाताको कबोल रकम बराबर भएमा कार्यक्षमता, कार्य अनुभव वा नियमानुसार तोकिएको पारदर्शी प्रक्रियाबाट छनोट गर्ने आधार।',
    },
    {
      id: 'rules-145',
      lawName: 'सार्वजनिक खरिद नियमावली, २०६४',
      clause: 'नियम १४५ — पेश्की भुक्तानी, बैंक जमानत र असुली',
      summary: 'मोबिलाइजेसन पेश्की सम्झौता र कार्यतालिकाअनुसार परिचालन हुनुपर्ने; दुरुपयोग वा ढिलाइ भए बैंक जमानत जफत गरी प्रचलित ब्याजसहित असुल गर्ने कार्यविधि।',
    },
  ]),
  ...createLocalPrecedentReferences([
    {
      id: 'ppmo-opinion-6',
      collection: 'PPMO राय',
      clause: 'राय नं. ६ — बोलपत्र अस्वीकृति/रद्दको कारण',
      summary: 'समितिको तालिका मात्र होइन, विश्लेषणसहितको प्रतिवेदन र अधिकारप्राप्त निकायको कारणयुक्त निर्णय आवश्यक हुने विगतको अभ्यास-सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ६ · २०६५.८.२२',
    },
    {
      id: 'ppmo-opinion-9',
      collection: 'PPMO राय',
      clause: 'राय नं. ९ — JV साझेदारको भूमिका/योग्यता',
      summary: 'प्रकाशित बोलपत्र कागजातले JV साझेदारको हिस्सा र योग्यता कसरी तोकेको छ भन्ने आधारमा प्रत्येक साझेदारको विवरण जाँच्ने विगतको अभ्यास-सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ९ · २०६५.१०.२४',
    },
    {
      id: 'ppmo-opinion-11',
      collection: 'PPMO राय',
      clause: 'राय नं. ११ — साइट उपलब्धता र ढिलाइ',
      summary: 'खरिद अघि साइट उपलब्धता र कार्यान्वयनमा बाधा कसको कारणले भयो भन्ने तथ्य अभिलेख गर्ने विगतको अभ्यास-सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ११ · २०६६.२.२५',
    },
    {
      id: 'ppmo-opinion-12',
      collection: 'PPMO राय',
      clause: 'राय नं. १२ — BOQ मा खरिद निकायको छुट',
      summary: 'BOQ मा खरिद निकायबाट परिमाण वा विवरण छुट भएको अवस्थामा अप्रकाशित दर वा एकतर्फी औसत दर नथपी, प्रकाशित कागजात र हाल लागू नियमावलीअनुसार समान कानुनी समाधान गर्ने अभ्यास-सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय १२ · २०६६.३.१०',
    },
    {
      id: 'ppmo-opinion-15',
      collection: 'PPMO राय',
      clause: 'राय नं. १५ — झुट्टा कर/योग्यता कागजात',
      summary: 'प्रमाण झुट्टा वा बंग्याइएको भन्ने शङ्कामा अनुमानका आधारमा होइन, आधिकारिक प्रमाणीकरण र लागू प्रक्रिया पछ्याउने सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय १५ · २०६६.५.२३',
    },
    {
      id: 'ppmo-opinion-19',
      collection: 'PPMO राय',
      clause: 'राय नं. १९ — परामर्श सेवामा वार्ता',
      summary: 'पहिलो-ranked प्रस्तावदातासँग वार्ता निष्कर्षमा नपुगेको अवस्थामा प्रकाशित विधि र लागू ऐनअनुसार अर्को चरणमा जाने सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय १९ · २०६७.३.३१',
    },
    {
      id: 'ppmo-opinion-185',
      collection: 'PPMO राय',
      clause: 'राय नं. १८५ — म्यादपछि छुटेको कागजात',
      summary: 'बोलपत्रसाथ अनिवार्य भनिएको कागजात र स्पष्टीकरणबाट पुष्टि गर्न मिल्ने विषय छुट्याएर, म्यादपछि नयाँ कागजात स्वीकार्ने/नस्वीकार्ने निर्णय गर्ने सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart4.ts · राय १८५ · २०६७.९.१६',
    },
    {
      id: 'ppmo-opinion-186',
      collection: 'PPMO राय',
      clause: 'राय नं. १८६ — पूर्वयोग्यतापछिको प्रतिस्पर्धा',
      summary: 'पूर्वयोग्यतामा छानिनु अन्तिम खरिद स्वीकृति होइन; त्यसपछि तोकिएको प्रतिस्पर्धी चरण पूरा गर्नुपर्ने विगतको सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart4.ts · राय १८६ · २०६७.९.१९',
    },
    {
      id: 'ppmo-opinion-192',
      collection: 'PPMO राय',
      clause: 'राय नं. १९२ — बोलपत्रपछि पेश गरिने कागजात',
      summary: 'बोलपत्रको अभिन्न आवश्यक कागजात र स्पष्टीकरणको सीमाबीच भेद गर्ने विगतको सन्दर्भ; हाल लागू नियम र कागजात हेर्नुहोस्।',
      sourceVersion: 'ppmoOpsPart4.ts · राय १९२ · २०६७.११.२३',
    },
    {
      id: 'ppmo-opinion-193',
      collection: 'PPMO राय',
      clause: 'राय नं. १९३ — बोलपत्र जमानतको अवधि',
      summary: 'जमानतको रकम/अवधि र बोलपत्रको वैधता प्रकाशित शर्तसँग मेल खान्छ कि जाँच्ने विगतको सन्दर्भ; यहाँ कुनै अवधि तोकिएको छैन।',
      sourceVersion: 'ppmoOpsPart4.ts · राय १९३ · २०६७.१२.१',
    },
    {
      id: 'ppmo-opinion-199',
      collection: 'PPMO राय',
      clause: 'राय नं. १९९ — असन्तुलित दर र Line of Credit',
      summary: 'असन्तुलित BOQ दर वा Line of Credit परीक्षण गर्दा तथ्य, लागू मूल्याङ्कन शर्त र आधिकारिक प्रमाण हेर्ने सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart4.ts · राय १९९ · २०६७.१२.११',
    },
    {
      id: 'pprc-decision-2',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. २ — खरिद प्रकारअनुसार नमूना कागजात',
      summary: 'खरिद वस्तु/प्रकृतिसँग नमिल्ने नमूना कागजात अपनाएको विगतको निर्णय; सही वर्तमान SBD/कागजात प्रयोग गर्नुहोस्।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय २ · २०७५ जेठ ८',
    },
    {
      id: 'pprc-decision-5',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. ५ — e-bid र दुई खाम प्रक्रिया',
      summary: 'प्रकाशित कागजातमा छुट्याइएको प्राविधिक/आर्थिक चरण उल्लङ्घन गर्दा प्रक्रिया बदर भएको विगतको निर्णय; तत्कालीन सीमा हाल लागू छ भनी नमान्नुहोस्।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय ५ · २०७५ असार १०',
    },
    {
      id: 'pprc-decision-6',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. ६ — पहिले निकायसमक्ष पुनरावलोकन',
      summary: 'विगतको निर्णयले प्रारम्भिक पुनरावलोकन निकायको चरण र स्वीकृत योजना/बजेटको महत्व औँल्याएको छ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय ६',
    },
    {
      id: 'pprc-decision-7',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. ७ — कारणबिना खरिद रद्द',
      summary: 'मूल्याङ्कनपछि सारभूत रूपमा प्रभावग्राही ठहर भइसकेको खरिद रद्द गर्दा स्पष्ट कानुनी आधार र अभिलेख चाहिने विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय ७',
    },
    {
      id: 'pprc-decision-18',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. १८ — विश्लेषण र प्रमाण प्रमाणीकरण',
      summary: 'तालिकामात्रको मूल्याङ्कन र बाह्य प्रमाणको आधिकारिकता नजाँची निर्णय गर्दा पुनर्मूल्याङ्कन आदेश भएको विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय १८',
    },
    {
      id: 'pprc-decision-24',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. २४ — उपकरणको specification/CMC र लागत',
      summary: 'अस्पष्ट CMC शर्त, अपूर्ण लागत अनुमान र मूल्याङ्कनमा एकनास व्यवहार नहुँदा खरिद बदर भएको विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय २४',
    },
    {
      id: 'pprc-decision-27',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. २७ — समान प्रकृतिको अनुभव',
      summary: 'बोलपत्रले मागेको समान आकार/प्रकृतिको अनुभवलाई प्रमाण र प्रकाशित परिभाषाअनुसार जाँच्नुपर्ने विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय २७',
    },
    {
      id: 'pprc-decision-29',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. २९ — प्राविधिक specification र लागत अनुमान',
      summary: 'प्राविधिक आवश्यकतासँग नमिल्ने बोलपत्र र लागत अनुमानको आधार अपूर्ण हुँदा निर्णय बदर भएको विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय २९',
    },
    {
      id: 'pprc-decision-38',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. ३८ — रासन आपूर्तिको इजाजत',
      summary: 'सम्बन्धित व्यवसायिक इजाजत र नियमसम्मत लागत अनुमान परीक्षण गर्नुपर्ने विगतको सन्दर्भ।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय ३८',
    },
    {
      id: 'pprc-decision-40',
      collection: 'PPRC निर्णय',
      clause: 'निर्णय नं. ४० — लागत अनुमान र रद्द निर्णय',
      summary: 'लागत अनुमान/स्वीकृति नभएको र कानुनी आधारबिना खरिद रद्द गरिएको विगतको निर्णय; स्वीकृत लागत अनुमान पूर्वशर्त हो।',
      sourceVersion: 'pprcDecisionsPart1.ts · निर्णय ४०',
    },
    {
      id: 'ppmo-opinion-5',
      collection: 'PPMO राय',
      clause: 'राय नं. ५ — CTP र लम्पसम ठेक्कामा मूल्य समायोजन',
      summary: 'Construction Turnkey Package (CTP) वा निश्चित एकमुष्ठ बजेटको आधारमा गरिएको सम्झौतामा ऐनको दफा ५५(२) बमोजिम मूल्य समायोजन आकर्षित नहुने।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ५ · २०६५.७.१७',
    },
    {
      id: 'ppmo-opinion-8',
      collection: 'PPMO राय',
      clause: 'राय नं. ८ — विदेशी बैंक जमानतमा काउन्टर ग्यारेन्टी',
      summary: 'विदेशी बैंकबाट जारी गरिएको कार्य सम्पादन वा बोलपत्र जमानतमा नेपालमा स्थापना भएको वाणिज्य बैंकले प्रति-प्रत्याभूति (Counter Guarantee) गरेको हुनुपर्ने।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ८ · २०६५.१०.१३',
    },
    {
      id: 'ppmo-opinion-48',
      collection: 'PPMO राय',
      clause: 'राय नं. ४८ — ब्रान्ड नतोकी स्पेसिफिकेशन तयार गर्ने',
      summary: 'प्रारम्भमा नै दफा ४ बमोजिम ब्रान्ड नतोकी विवरण तयार नभएको भए नयाँ खरिद कारबाही प्रारम्भ गर्नुपर्ने ऐतिहासिक अभ्यास-सन्दर्भ।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ४८ · २०६६.१०.२१',
    },
    {
      id: 'ppmo-opinion-49',
      collection: 'PPMO राय',
      clause: 'राय नं. ४९ — सानातिना फरक (Minor Deviations) र ग्राह्यता',
      summary: 'बोलपत्र सम्बन्धी कागजातको आवश्यकता र गम्भीर असर नपर्ने सार्वजनिक निकायलाई स्वीकार्य सानातिना फरक समावेश गरी बोलपत्र प्रभावग्राही मान्न सकिने।',
      sourceVersion: 'ppmoOpsPart1.ts · राय ४९ · २०६७.१.२७',
    },
  ]),
];

const CORE_SIMULATION_CASES: SimulationCaseVersion[] = [
  {
    caseKey: 'annual-procurement-plan',
    version: 1,
    status: 'published',
    content: {
      title: 'वार्षिक खरिद योजना तयार गर्ने',
      category: 'योजना तथा तयारी',
      difficulty: 'सरल',
      estimatedMinutes: 10,
      targetAudience: 'सार्वजनिक निकाय',
      scenario: 'कुनै एक नगरपालिकाले आगामी आर्थिक वर्षमा स्वास्थ्य चौकीका उपकरण, विद्यालय मर्मत र कार्यालयका नियमित सेवा खरिद गर्ने तयारी गर्दैछ। बजेट शीर्षक र आवश्यकताको प्रारम्भिक विवरण आएको छ, तर खरिद प्याकेज, समयतालिका र विधि अझै स्वीकृत छैनन्।',
      objectives: [
        'खरिद आवश्यकतालाई बजेट र समयसँग जोड्ने',
        'योजना र प्याकेजको औचित्य अभिलेख गर्ने',
        'प्रकाशन/कारबाही अघि स्वीकृत प्रक्रिया पहिचान गर्ने',
      ],
      priorKnowledge: ['खरिद योजना र बजेटको सामान्य परिचय'],
      legalReferenceIds: ['rules-7-8', 'ppmo-opinion-10'],
      mockDocuments: [
        {
          id: 'doc-app-draft',
          title: 'प्रारम्भिक वार्षिक खरिद योजना (मस्यौदा)',
          documentType: 'office-memo',
          issuer: 'काल्पनिक नगर कार्यपालिकाको कार्यालय, प्रशासन तथा खरिद एकाइ',
          date: '२०८१/०४/०५',
          referenceNo: 'खरिद/योजना-०८१/८२-१२',
          content: `खरिद शीर्षक १: प्राथमिक स्वास्थ्य केन्द्रका लागि भिडियो एक्सरे तथा ल्याब सामग्री
- अनुमानित लागत: रु. ४५,००,०००/-
- बजेट उपशीर्षक: ३११२२
- प्रस्तावित विधि: खुला बोलपत्र (e-GP II मार्फत)
- सम्झौता अवधि: ९० दिन

खरिद शीर्षक २: नगरस्तरीय आधारभूत विद्यालय भवन मर्मत तथा रङ्गरोगन
- अनुमानित लागत: रु. ३०,००,०००/-
- बजेट उपशीर्षक: ३१११३
- प्रस्तावित कार्यविधि: रु. १५,००,०००/- का दरले २ वटा प्याकेज बनाई सिलबन्दी दरभाउपत्रबाट गर्ने टिप्पणी।
- कैफियत: समय बचत गर्न विभाजन गर्ने भनी टिप्पणी उठाइएको। (ध्यानाकर्षण: ऐन दफा ५४ र नियम ८ को सीमा छल्ने मनसाय देखिन सक्ने)।

खरिद शीर्षक ३: कार्यालय सुरक्षा तथा सरसफाइ सेवा
- अनुमानित लागत: रु. २४,००,०००/-
- बजेट उपशीर्षक: २२७११
- प्रस्तावित विधि: सिलबन्दी दरभाउपत्र।`,
          notes: [
            'विद्यालय मर्मतको रु. ३० लाखलाई दुई टुक्रा गरी रु. १५/१५ लाखको सिलबन्दी दरभाउपत्र बनाउने प्रस्तावमा कानुनी जोखिम छ।',
            'सार्वजनिक खरिद नियमावलीको नियम ८ अनुसार वार्षिक योजनामा सबै खरिद प्याकेज र विधिको स्पष्ट औचित्य हुनुपर्छ।',
          ],
        },
      ],
      steps: [
        {
          id: 'plan-action',
          title: 'पहिलो निर्णय',
          criterion: 'decision',
          points: 40,
          prompt: 'खरिद एकाइले अब कुन कदम चाल्नु उपयुक्त हुन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['rules-7-8', 'ppmo-opinion-10'],
          options: [
            { id: 'approve-plan', label: 'आवश्यकता, बजेट, प्याकेज, समयतालिका र प्रस्तावित विधि मिलाएर वार्षिक योजना तयार गरी अधिकारप्राप्त अधिकारीसमक्ष स्वीकृतिका लागि पेश गर्ने।' },
            { id: 'publish-first', label: 'सबै शीर्षकको सूचना पहिले प्रकाशित गर्ने र योजना पछि मिलाउने।' },
            { id: 'split-all', label: 'विधि सरल बनाउन एउटै आवश्यकता साना खरिदमा टुक्र्याउने।' },
          ],
        },
        {
          id: 'plan-law',
          title: 'कानुनी आधार',
          criterion: 'legal-basis',
          points: 25,
          prompt: 'वार्षिक खरिद योजना सम्बन्धी कुन सन्दर्भ सबैभन्दा सान्दर्भिक छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['rules-7-8', 'ppmo-opinion-10'],
          options: [
            { id: 'rule-8', label: 'नियमावलीको नियम ८; गुरुयोजना आवश्यक हुने अवस्थामा नियम ७ लाई पनि आधार मान्ने।' },
            { id: 'only-act-54', label: 'भेरिएसन आदेश सम्बन्धी ऐनको दफा ५४ मात्र।' },
            { id: 'no-reference', label: 'योजना बनाउँदा कुनै स्वीकृत कानुनी/संस्थागत सन्दर्भ आवश्यक हुँदैन।' },
          ],
        },
        {
          id: 'plan-fields',
          title: 'योजनामा समेट्ने विवरण',
          criterion: 'process',
          points: 20,
          prompt: 'योजनालाई कार्यान्वयनयोग्य बनाउन कुन विवरण राख्ने?',
          questionType: 'single-choice',
          legalReferenceIds: ['rules-7-8', 'ppmo-opinion-10'],
          options: [
            { id: 'complete-fields', label: 'खरिदको प्रकार, सम्भावित प्याकेज, समयतालिका, विधि र सम्झौताको किसिम; आवश्यकतासँग मिल्ने बजेट/तयारी विवरणसहित।' },
            { id: 'partial-fields', label: 'खरिदको प्रकार, प्याकेज र समयतालिका राख्ने, तर विधि/सम्झौताको किसिम वा बजेट मिलान अझै अपूरो रहने।' },
            { id: 'title-only', label: 'खरिदको छोटो नाम मात्र।' },
            { id: 'supplier-first', label: 'पहिले नै छानिएको आपूर्तिकर्ताको नाम र मूल्य मात्र।' },
          ],
        },
        {
          id: 'plan-risk',
          title: 'जोखिम र औचित्य',
          criterion: 'reasoning',
          points: 15,
          prompt: 'प्याकेज बनाउँदा कुन जोखिम नियन्त्रण गर्नुपर्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['rules-7-8', 'ppmo-opinion-10'],
          options: [
            { id: 'avoid-fragmentation', label: 'प्याकेजको औचित्य र प्रतिस्पर्धा अभिलेख गर्ने; विधि/सीमा छल्न खरिद टुक्र्याउने वा अनावश्यक रूपमा जोड्ने काम नगर्ने।' },
            { id: 'hide-packages', label: 'प्रतिस्पर्धा घटे पनि खरिद टुक्र्याएको अभिलेख नराख्ने।' },
            { id: 'same-date', label: 'सबै खरिदको आवश्यकता फरक भए पनि एउटै प्याकेज बनाउने।' },
          ],
        },
      ],
    },
    answerKey: {
      'plan-action': { type: 'single-choice', correctOptionId: 'approve-plan', optionScores: { 'approve-plan': 100, 'publish-first': 0, 'split-all': 0 }, explanation: 'खरिद आवश्यकता, बजेट, समय र प्रक्रियाको मेल योजना स्वीकृतिमा देखिनुपर्छ।' },
      'plan-law': { type: 'single-choice', correctOptionId: 'rule-8', optionScores: { 'rule-8': 100, 'only-act-54': 0, 'no-reference': 0 }, explanation: 'वार्षिक खरिद योजनाको अभ्यास नियम ८ सँग सम्बन्धित छ; गुरुयोजना लागू हुने अवस्थामा नियम ७ समेत जाँचिन्छ।' },
      'plan-fields': { type: 'single-choice', correctOptionId: 'complete-fields', optionScores: { 'complete-fields': 100, 'partial-fields': 50, 'title-only': 0, 'supplier-first': 0 }, explanation: 'योजना कार्यतालिका, प्याकेज, विधि र सम्झौता प्रकारसहित कार्यान्वयनयोग्य हुनुपर्छ।' },
      'plan-risk': { type: 'single-choice', correctOptionId: 'avoid-fragmentation', optionScores: { 'avoid-fragmentation': 100, 'hide-packages': 0, 'same-date': 0 }, explanation: 'प्याकेजिङको निर्णय पारदर्शी र प्रतिस्पर्धामैत्री हुनुपर्छ; कानुनी सीमा छल्ने उद्देश्यले विभाजन गर्नु हुँदैन।' },
    },
  },
  {
    caseKey: 'procurement-method-selection',
    version: 1,
    status: 'published',
    content: {
      title: 'खरिद विधि छनोट',
      category: 'खरिद विधि',
      difficulty: 'मध्यम',
      estimatedMinutes: 12,
      targetAudience: 'सार्वजनिक निकाय',
      scenario: 'कुनै एक स्वास्थ्य कार्यालयले उपकरण खरिद गर्नुपर्नेछ। माग र बजेट स्रोत उपलब्ध छन्, बजारमा एकभन्दा बढी सम्भावित आपूर्तिकर्ता छन्, तर हाल लागू मूल्य-सीमा र खरिदसँग सम्बन्धित विशेष सर्तको अद्यावधिक प्रति निर्णय फाइलमा छैन। आपत्कालीन अवस्था पनि अभिलेखित छैन।',
      objectives: [
        'विधि छनोटमा खरिदको प्रकृति र प्रमाण प्रयोग गर्ने',
        'हाल लागू सीमा र अपवाद पुष्टि नगरी निष्कर्ष ननिकाल्ने',
        'खुला प्रतिस्पर्धा र अभिलेखको महत्व बुझ्ने',
      ],
      priorKnowledge: ['विभिन्न खरिद विधिको परिचय'],
      legalReferenceIds: ['act-section-8', 'act-section-9'],
      mockDocuments: [
        {
          id: 'doc-method-request',
          title: 'स्वास्थ्य उपकरण माग फाराम तथा बजार अध्ययन प्रतिवेदन',
          documentType: 'office-memo',
          issuer: 'स्वास्थ्य सेवा शाखा, जिल्ला जनस्वास्थ्य कार्यालय',
          date: '२०८१/०२/१०',
          referenceNo: 'माग/उपकरण-०८०/८१-८९',
          content: `माग भएको सामग्री: डिफेब्रिलेटर तथा अत्याधुनिक इसीजी मेसिन (५ थान)
अनुमानित कुल लागत: रु. ३५,००,०००/- (रु. ३५ लाख)
बजेट स्रोत: प्रदेश स्वास्थ्य आपूर्ति शीर्षक ३११२२ (बजेट सुनिश्चित)

बजार सर्वेक्षण विश्लेषण:
१. काठमाडौँ तथा मुख्य सहरहरूमा आधिकारिक उपकरण आयातकर्ता ५ भन्दा बढी फर्महरू नियमित सञ्चालनमा रहेका।
२. सामग्रीको गुणस्तर, ब्रान्ड स्पेसिफिकेसन तथा वारेन्टीका आधारमा खुला बजारमा पर्याप्त प्रतिस्पर्धा सम्भव।
३. शाखा प्रमुखको टिप्पणी: "खरिद तत्काल आवश्यक भएकोले खुला बोलपत्रमा समय लाग्ने हुँदा सोझै खरिद (Direct Procurement) गर्न सिफारिस।"`,
          notes: [
            'सार्वजनिक खरिद ऐनको दफा ९ अनुसार अन्यथा व्यवस्था नभएसम्म खुला प्रतिस्पर्धा नै पहिलो अनिवार्य विधि हो।',
            'बजारमा ५ भन्दा बढी आपूर्तिकर्ता हुँदाहुँदै समयको कारण देखाई विना कानुनी अपवाद सोझै खरिद रोज्नु कानुनी त्रुटि हो।',
          ],
        },
      ],
      steps: [
        {
          id: 'method-action',
          title: 'निर्णय',
          criterion: 'decision',
          points: 40,
          prompt: 'दिइएका तथ्यमा अहिले सबैभन्दा सुरक्षित निर्णय के हो?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-8', 'act-section-9'],
          options: [
            { id: 'verify-before-select', label: 'स्वीकृत लागत अनुमान, एकीकृत खरिदको प्रकृति र हाल लागू विधि/सीमा आधिकारिक स्रोतबाट पुष्टि गरी कारण अभिलेख गरेर मात्र विधि स्वीकृत गर्ने।' },
            { id: 'direct-for-speed', label: 'छिटो चाहिएको भन्दै प्रमाणबिना सोझै खरिद रोज्ने।' },
            { id: 'split-to-limit', label: 'लागू सीमा थाहा नभएकाले विधि मिलाउन खरिदलाई साना भागमा बाँड्ने।' },
          ],
        },
        {
          id: 'method-law',
          title: 'कानुनी आधार',
          criterion: 'legal-basis',
          points: 25,
          prompt: 'विधि छनोट जाँच्दा कुन कानुनी सन्दर्भ जोडिन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-8', 'act-section-9'],
          options: [
            { id: 'act-8-9', label: 'ऐनको दफा ८ को विधि छनोट र दफा ९ को खुला प्रतिस्पर्धाको सामान्य आधार; सम्बन्धित नियम/संशोधन पनि पुष्टि गर्ने।' },
            { id: 'act-54-only', label: 'ऐनको दफा ५४ मात्र, किनकि यो सबै विधि छनोटको आधार हो।' },
            { id: 'threshold-memory', label: 'पुरानो तालिममा सुनेको मूल्य-सीमा मात्र।' },
          ],
        },
        {
          id: 'method-evidence',
          title: 'आवश्यक प्रमाण',
          criterion: 'process',
          points: 20,
          prompt: 'निर्णयलाई प्रमाणित गर्न कुन कागजात पहिले जाँच्नुहुन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-8'],
          options: [
            { id: 'evidence-set', label: 'स्वीकृत माग/स्पेसिफिकेशन, लागत अनुमान, बजेट, बजार उपलब्धता, एकीकृत आवश्यकताको परिमाण र आधिकारिक हाल लागू विधि-सीमा।' },
            { id: 'supplier-call', label: 'एउटै आपूर्तिकर्ताबाट मौखिक रूपमा भनिएको मूल्य।' },
            { id: 'old-limit', label: 'पुरानो सीमा तालिका; संशोधन जाँच आवश्यक छैन।' },
          ],
        },
        {
          id: 'method-risk',
          title: 'जोखिम नियन्त्रण',
          criterion: 'reasoning',
          points: 15,
          prompt: 'केसमा कुन जोखिम स्पष्ट रूपमा नियन्त्रण गर्नुपर्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-9'],
          options: [
            { id: 'no-evasion', label: 'विधि वा सीमा छल्न माग/खरिद विभाजन नगर्ने; अपवाद दाबी भए त्यसको कानुनी शर्त र प्रमाण सुरक्षित गर्ने।' },
            { id: 'urgency-assume', label: 'आवश्यकता छिटो छ भन्ने आधारमा आपत्कालीन अपवाद स्वतः लागू मान्ने।' },
            { id: 'decision-later', label: 'विधि र कारण सम्झौता भएपछि अभिलेख गर्ने।' },
          ],
        },
      ],
    },
    answerKey: {
      'method-action': { type: 'single-choice', correctOptionId: 'verify-before-select', optionScores: { 'verify-before-select': 100, 'direct-for-speed': 0, 'split-to-limit': 0 }, explanation: 'लागू सीमा र विशेष अवस्था पुष्टि नगरी विधि/अपवाद निर्धारण गर्नु हुँदैन।' },
      'method-law': { type: 'single-choice', correctOptionId: 'act-8-9', optionScores: { 'act-8-9': 100, 'act-54-only': 0, 'threshold-memory': 0 }, explanation: 'दफा ८ र ९ ले विधि छनोट तथा खुला प्रतिस्पर्धासँग सम्बन्धित आधार दिन्छन्; हाल लागू नियम र संशोधन छुट्टै पुष्टि गर्नुपर्छ।' },
      'method-evidence': { type: 'single-choice', correctOptionId: 'evidence-set', optionScores: { 'evidence-set': 100, 'supplier-call': 0, 'old-limit': 0 }, explanation: 'निर्णयमा स्वीकृत लागत अनुमान, माग, बजेट, बजार र अद्यावधिक आधिकारिक कानुनी पाठ आवश्यक हुन्छ।' },
      'method-risk': { type: 'single-choice', correctOptionId: 'no-evasion', optionScores: { 'no-evasion': 100, 'urgency-assume': 0, 'decision-later': 0 }, explanation: 'अपवाद वा विधि परिवर्तन वस्तुगत तथ्य र लागू कानुनी शर्तले समर्थन गर्नुपर्छ।' },
    },
  },
  {
    caseKey: 'boq-cost-estimate',
    version: 1,
    status: 'published',
    content: {
      title: 'लागत अनुमान तथा BOQ जाँच',
      category: 'लागत अनुमान',
      difficulty: 'मध्यम',
      estimatedMinutes: 12,
      scenario: 'यो काल्पनिक गणना अभ्यास हो, वास्तविक कर/दर निर्धारण होइन। वस्तु A: १२ थान × रु १,२५०; वस्तु B: ३ थान × रु ४,८००; प्याकिङ/ढुवानी रु ६००। यस उदाहरणका लागि मात्र करयोग्य रकममा १३% कर लागू भएको मान्नुहोस्।',
      objectives: [
        'मात्रा र एकाइ दरबाट line amount निकाल्ने',
        'अन्य लागत र अभ्यासका लागि दिइएको कर मान्यता समेट्ने',
        'लागत अनुमान र बजेट/स्वीकृत विवरणबीचको जाँच बुझ्ने',
      ],
      priorKnowledge: ['गुणन, जोड र प्रतिशतको आधारभूत गणना'],
      legalReferenceIds: ['act-section-5', 'rules-8-9'],
      steps: [
        {
          id: 'boq-grand-total',
          title: 'कुल रकम गणना',
          criterion: 'decision',
          points: 40,
          prompt: 'दिइएको अभ्यास-मान्यताअनुसार सबै वस्तु, प्याकिङ/ढुवानी र करसहितको कुल कति हुन्छ?',
          questionType: 'number',
          numberUnit: 'रुपैयाँ',
          legalReferenceIds: ['act-section-5', 'rules-8-9'],
        },
        {
          id: 'boq-law',
          title: 'लागत अनुमानको आधार',
          criterion: 'legal-basis',
          points: 25,
          prompt: 'लागत अनुमान र त्यसका आधारबारे कुन सन्दर्भ उपयुक्त छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-5', 'rules-8-9'],
          options: [
            { id: 'estimate-source', label: 'ऐनको दफा ५ र नियमावलीको लागत अनुमानसम्बन्धी नियम ९; विवरण/बजार दर र हाल लागू पाठसँग मिलान।' },
            { id: 'variation-only', label: 'ऐनको दफा ५४ मात्र।' },
            { id: 'tax-assumption-law', label: 'अभ्यासमा दिइएको कर प्रतिशतलाई सबै वास्तविक खरिदमा लागू हुने कानुन मान्ने।' },
          ],
        },
        {
          id: 'boq-check',
          title: 'BOQ त्रुटि जाँच',
          criterion: 'process',
          points: 20,
          prompt: 'कुललाई स्वीकृत गर्नुअघि कुन जाँच सही हुन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-5', 'rules-8-9'],
          options: [
            { id: 'recalculate', label: 'हरेक quantity × rate, line total, subtotal, थप लागत र करयोग्य आधार छुट्टाछुट्टै पुनर्गणना गरी बजेट र स्वीकृत विवरणसँग तुलना गर्ने।' },
            { id: 'copy-total', label: 'तालिकाको grand total मात्र प्रतिलिपि गर्ने।' },
            { id: 'ignore-transport', label: 'ढुवानी/अन्य लागतलाई जाँचबिना हटाउने।' },
          ],
        },
        {
          id: 'boq-assumption',
          title: 'मान्यता स्पष्ट गर्ने',
          criterion: 'reasoning',
          points: 15,
          prompt: 'अभ्यासको कर दरलाई वास्तविक लागत अनुमानमा प्रयोग गर्नेबारे सही निष्कर्ष कुन हो?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-5'],
          options: [
            { id: 'scenario-only', label: 'यो केवल अभ्यासमा दिइएको मान्यता हो; वास्तविक कर, दर र लागतको आधार हाल लागू आधिकारिक स्रोतबाट पुष्टि गरी अभिलेख गर्ने।' },
            { id: 'always-thirteen', label: 'प्रत्येक खरिदमा १३% नै लागू हुन्छ भनेर स्रोत जाँच नगर्ने।' },
            { id: 'tax-exclude', label: 'कर वा अन्य लागतबारे कुनै टिप्पणी वा जाँच आवश्यक हुँदैन।' },
          ],
        },
      ],
    },
    answerKey: {
      'boq-grand-total': { type: 'number', expectedValue: 33900, tolerance: 0, explanation: 'A: 12×1,250 = 15,000; B: 3×4,800 = 14,400; अन्य लागत 600 जोड्दा 30,000; अभ्यासको 13% = 3,900; जम्मा रु 33,900।' },
      'boq-law': { type: 'single-choice', correctOptionId: 'estimate-source', optionScores: { 'estimate-source': 100, 'variation-only': 0, 'tax-assumption-law': 0 }, explanation: 'लागत अनुमानसम्बन्धी ऐन/नियमावलीको सन्दर्भ प्रयोग गर्नुहोस्; अभ्यासको कर दरलाई कानुनको सार्वभौम नियम नमान्नुहोस्।' },
      'boq-check': { type: 'single-choice', correctOptionId: 'recalculate', optionScores: { recalculate: 100, 'copy-total': 0, 'ignore-transport': 0 }, explanation: 'BOQ का प्रत्येक line र जोड चरण पुनर्गणना गरेर आधार/बजेटसँग मिलाउनुहोस्।' },
      'boq-assumption': { type: 'single-choice', correctOptionId: 'scenario-only', optionScores: { 'scenario-only': 100, 'always-thirteen': 0, 'tax-exclude': 0 }, explanation: 'कर दर scenario-only assumption हो; वास्तविक गणनामा आधिकारिक हाल लागू दर पुष्टि गर्नुपर्छ।' },
    },
  },
  {
    caseKey: 'bid-evaluation',
    version: 1,
    status: 'published',
    content: {
      title: 'बोलपत्र मूल्याङ्कन',
      category: 'मूल्याङ्कन',
      difficulty: 'उन्नत',
      estimatedMinutes: 15,
      targetAudience: 'सार्वजनिक निकाय',
      scenario: 'कुनै एक काल्पनिक खरिद प्रक्रियामा बोलपत्र कागजातले न्यूनतम प्राविधिक मापदण्ड र बोलपत्र जमानतको अनिवार्य शर्त तोकेको छ। मूल्याङ्कन अभिलेखमा: A — रु १२.४ लाख, सबै प्रकाशित मापदण्ड पूरा; B — रु ११.६ लाख, न्यूनतम प्राविधिक मापदण्ड पूरा गर्दैन; C — रु १२.७ लाख, सबै प्रकाशित मापदण्ड पूरा। यी तथ्य अभ्यासका लागि स्पष्ट रूपमा दिइएका हुन्।',
      objectives: [
        'नाममात्रको न्यूनतम मूल्य र मूल्याङ्कित उत्तरदायित्व छुट्याउने',
        'प्रकाशित मापदण्डअनुसार प्रमाण समीक्षा गर्ने',
        'कारणसहित मूल्याङ्कन प्रतिवेदन तयार गर्ने',
      ],
      priorKnowledge: ['बोलपत्र कागजात, योग्यता र मूल्याङ्कन मापदण्ड'],
      legalReferenceIds: ['act-section-23', 'act-section-25', 'rules-64-66', 'pprc-decision-3'],
      mockDocuments: [
        {
          id: 'doc-bid-bond',
          title: 'बोलपत्र जमानत (Bid Bond / Bank Guarantee Letter)',
          documentType: 'bid-bond',
          issuer: 'एभरेष्ट बैंक लिमिटेड, शाखा कार्यालय: नयाँ बानेश्वर, काठमाडौँ',
          date: '२०८१/०२/२८',
          referenceNo: 'EBL/BG/2081-82/045',
          content: `बोलपत्र आह्वान गर्ने निकाय: काल्पनिक सडक डिभिजन कार्यालय, काठमाडौँ
बोलपत्र ठेक्का नं.: RDO/KTM/NCB/W-03/080-81
कामको विवरण: चक्रपथ लिंक सडक कालोपत्रे निर्माण कार्य

हामी यसै ग्यारेन्टी पत्रद्वारा हिमालयन बिल्डर्स एण्ड कन्सट्रक्सन प्रा.लि. को तर्फबाट रु. ३,५०,०००/- (अक्षरेरु तीन लाख पचास हजार मात्र) को बोलपत्र जमानत जारी गर्दछौँ।

१. बोलपत्र दाखिला गर्ने अन्तिम मिति: २०८१/०३/०५
२. बोलपत्रको मान्यता अवधि: ९० दिन (२०८१/०६/०२ सम्म)
३. यस बैंक जमानतको अवधि: २०८१/०६/२० सम्म मात्र (जम्मा १०५ दिन)।
४. यदि बोलपत्रदाताले बोलपत्र फिर्ता लिएमा वा सम्झौता गर्न नआएमा कार्यालयको मागबमोजिम उक्त रकम बिना सर्त भुक्तानी गरिनेछ।`,
          notes: [
            'नियम ४२(३) अनुसार बोलपत्र जमानतको अवधि बोलपत्रको मान्यता अवधि (९० दिन) भन्दा कम्तीमा ३० दिन बढी (अर्थात् ९० + ३० = १२० दिन) हुनुपर्दछ।',
            'यहाँ बैंक जमानत १०५ दिनको मात्र जारी भएको हुँदा यो अनिवार्य सर्त पूरा नगरेकाले सारभूत रूपमा अप्रभावग्राही (Non-responsive) ठहरिन सक्छ।',
          ],
        },
      ],
      steps: [
        {
          id: 'bid-decision',
          title: 'सिफारिस',
          criterion: 'decision',
          points: 40,
          prompt: 'दिइएका अभ्यास तथ्यअनुसार कुन बोलपत्रलाई मूल्याङ्कनको अर्को चरणका लागि सिफारिस गर्ने?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-23', 'act-section-25', 'pprc-decision-3'],
          options: [
            { id: 'recommend-a', label: 'B को न्यून कबोल मात्र नहेरी प्रकाशित मापदण्ड लागू गर्ने; B को स्पष्ट असफलता कारणसहित अभिलेख गरी उत्तरदायी A र C मध्ये नियमानुसार न्यून मूल्याङ्कित बोलपत्र जाँच्ने।' },
            { id: 'recommend-b', label: 'B सबैभन्दा सस्तो भएकाले अन्य कुनै मापदण्ड नहेरी स्वीकृत गर्ने।' },
            { id: 'reject-all', label: 'कुनै अभिलेख नगरी सबै बोलपत्र रद्द गर्ने।' },
          ],
        },
        {
          id: 'bid-law',
          title: 'कानुनी आधार',
          criterion: 'legal-basis',
          points: 25,
          prompt: 'बोलपत्र परीक्षण र मूल्याङ्कनका लागि कुन कानुनी आधार लिनुपर्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-23', 'act-section-25', 'rules-64-66', 'pprc-decision-3'],
          options: [
            { id: 'bid-refs', label: 'ऐनका दफा २३/२५ र मूल्याङ्कन प्रतिवेदनसम्बन्धी नियम ६४–६६ को स्थानीय पाठ; साथै बोलपत्र कागजात र लागू संशोधन।' },
            { id: 'lowest-only', label: 'सबैभन्दा कम मूल्यको सिद्धान्त मात्र।' },
            { id: 'unwritten', label: 'समितिको अनलिखित अभ्यास।' },
          ],
        },
        {
          id: 'bid-record',
          title: 'प्रमाण र अभिलेख',
          criterion: 'process',
          points: 20,
          prompt: 'मूल्याङ्कन प्रतिवेदनमा के राख्नु आवश्यक छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['rules-64-66', 'pprc-decision-3'],
          options: [
            { id: 'record-reasons', label: 'प्रत्येक मापदण्डविरुद्धको प्रमाण, अंक/मूल्याङ्कन, असफलताको विशिष्ट कारण, गणना र सिफारिसको आधार।' },
            { id: 'record-winner', label: 'छानिएको फर्मको नाम मात्र।' },
            { id: 'record-price', label: 'कबोल रकम मात्र; प्राविधिक परीक्षण आवश्यक छैन।' },
          ],
        },
        {
          id: 'bid-risk',
          title: 'पूर्वाग्रह नियन्त्रण',
          criterion: 'reasoning',
          points: 15,
          prompt: 'कुन मूल्याङ्कन व्यवहारले निष्पक्षता कायम गर्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-23', 'act-section-25', 'pprc-decision-3'],
          options: [
            { id: 'same-criteria', label: 'सबै बोलपत्रदातालाई उही प्रकाशित मापदण्ड लागू गर्ने र वास्तविक कारण/गणना कागजातमा देखाउने।' },
            { id: 'change-criteria', label: 'बोलपत्र खोलेपछि मनपर्ने नतिजाका लागि नयाँ मापदण्ड थप्ने।' },
            { id: 'lowest-automatic', label: 'कागजात र उत्तरदायित्व नजाँची lowest bidder लाई स्वतः योग्य ठान्ने।' },
          ],
        },
      ],
    },
    answerKey: {
      'bid-decision': { type: 'single-choice', correctOptionId: 'recommend-a', optionScores: { 'recommend-a': 100, 'recommend-b': 0, 'reject-all': 0 }, explanation: 'न्यून कबोल मात्र पर्याप्त हुँदैन; काल्पनिक तथ्यमा B प्रकाशित न्यूनतम मापदण्डमा असफल छ। A र C को उत्तरदायित्व/मूल्याङ्कन स्वीकृत कागजातअनुसार अभिलेख गर्नुपर्छ।' },
      'bid-law': { type: 'single-choice', correctOptionId: 'bid-refs', optionScores: { 'bid-refs': 100, 'lowest-only': 0, unwritten: 0 }, explanation: 'दफा २३/२५ र नियम ६४–६६ लाई उपलब्ध स्थानीय स्रोतमा सम्बन्धित सन्दर्भका रूपमा राखिएको छ; हाल लागू एकीकृत पाठसँग पुनः पुष्टि गर्नुहोस्।' },
      'bid-record': { type: 'single-choice', correctOptionId: 'record-reasons', optionScores: { 'record-reasons': 100, 'record-winner': 0, 'record-price': 0 }, explanation: 'निर्णय पुनरावलोकनयोग्य बनाउन प्रत्येक मापदण्ड, प्रमाण, गणना र कारण रेकर्ड गर्नुपर्छ।' },
      'bid-risk': { type: 'single-choice', correctOptionId: 'same-criteria', optionScores: { 'same-criteria': 100, 'change-criteria': 0, 'lowest-automatic': 0 }, explanation: 'परीक्षणमा प्रकाशित मापदण्ड समान रूपमा लागू गर्नुपर्छ; बोलपत्र खोलेपछि नयाँ मापदण्ड बनाउन हुँदैन।' },
    },
  },
  {
    caseKey: 'contract-management',
    version: 1,
    status: 'published',
    content: {
      title: 'सम्झौता व्यवस्थापन र समस्या समाधान',
      category: 'सम्झौता व्यवस्थापन',
      difficulty: 'उन्नत',
      estimatedMinutes: 15,
      scenario: 'कुनै एक काल्पनिक निर्माण कार्यमा साइटको एउटा भाग समयमै उपलब्ध नभएको अभिलेख छ। निर्माण व्यवसायीले म्याद थप मागेको छ र भूमिगत सेवा लाइन भेटिएपछि थप कामको प्रस्ताव गरेको छ। प्राविधिक प्रतिवेदन, critical-path प्रभाव, थप लागत र अधिकारप्राप्त अधिकारीको पूर्व निर्णय अझै संलग्न छैन।',
      objectives: [
        'म्याद थप र भेरिएसनलाई छुट्टाछुट्टै परीक्षण गर्ने',
        'तथ्य, प्राविधिक कारण, लागत र अधिकार अभिलेख गर्ने',
        'पूर्व स्वीकृति र हाल लागू सीमा नपुष्टि हुँदासम्म निष्कर्ष ननिकाल्ने',
      ],
      priorKnowledge: ['खरिद सम्झौता र कार्यान्वयन अभिलेख'],
      legalReferenceIds: ['act-section-54', 'rules-118'],
      steps: [
        {
          id: 'contract-action',
          title: 'पहिलो निर्णय',
          criterion: 'decision',
          points: 40,
          prompt: 'कुन प्रक्रिया अघि बढाउनु उपयुक्त हुन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-54', 'rules-118'],
          options: [
            { id: 'assess-separately', label: 'तथ्य अपूरा भएकाले अन्तिम निर्णय रोक्ने; साइट उपलब्धताको प्रमाण, critical path, थप कामको प्राविधिक कारण/लागत र अधिकार छुट्टाछुट्टै जाँचेर सक्षम अधिकारीसमक्ष पेश गर्ने।' },
            { id: 'approve-backdate', label: 'काम पूरा भएपछि पनि भेरिएसनलाई पछिल्लो मिति राखेर स्वीकृत गर्ने।' },
            { id: 'automatic-extension', label: 'साइट ढिलाइ उल्लेख भएकाले कारण/प्रभाव नजाँची स्वतः सबै म्याद थप्ने।' },
          ],
        },
        {
          id: 'contract-law',
          title: 'कानुनी आधार',
          criterion: 'legal-basis',
          points: 25,
          prompt: 'भेरिएसनको प्रक्रिया जाँच्न कुन सन्दर्भ उपयुक्त हुन्छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-54', 'rules-118'],
          options: [
            { id: 'variation-refs', label: 'ऐनको दफा ५४ र नियमावलीको नियम ११८ को स्थानीय पाठ; हाल लागू संशोधन, सीमा र अधिकार आधिकारिक स्रोतबाट पुष्टि गर्ने।' },
            { id: 'rule-8-only', label: 'वार्षिक खरिद योजना सम्बन्धी नियम ८ मात्र।' },
            { id: 'no-review', label: 'अनुमानित लागतभन्दा काम फरक भए अधिकार/प्रक्रिया जाँच्नुपर्दैन।' },
          ],
        },
        {
          id: 'contract-records',
          title: 'आवश्यक अभिलेख',
          criterion: 'process',
          points: 20,
          prompt: 'छुटेको निर्णय फाइल पूरा गर्न कुन प्रमाण सङ्कलन गर्ने?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-54', 'rules-118'],
          options: [
            { id: 'technical-records', label: 'साइट हस्तान्तरण/बाधा अभिलेख, मिति र critical-path विश्लेषण, प्राविधिक प्रतिवेदन, मात्रा/लागत प्रभाव, उपलब्ध बजेट र अधिकारप्राप्त अधिकारीको कारणसहितको निर्णय।' },
            { id: 'verbal-only', label: 'निर्माण व्यवसायीको मौखिक अनुरोध मात्र।' },
            { id: 'backdated-note', label: 'कारण नखुलाई पछिल्लो मितिमा पुरानो निर्णय लेख्ने।' },
          ],
        },
        {
          id: 'contract-reasoning',
          title: 'जोखिम मूल्याङ्कन',
          criterion: 'reasoning',
          points: 15,
          prompt: 'जोखिम र उपचारसम्बन्धी कुन निष्कर्ष उपयुक्त छ?',
          questionType: 'single-choice',
          legalReferenceIds: ['act-section-54', 'rules-118'],
          options: [
            { id: 'causation', label: 'ढिलाइको कारण र असर छुट्टाछुट्टै प्रमाणित गरी मात्र म्याद/क्षतिपूर्तिको निर्णय गर्ने; भेरिएसनलाई पूर्वस्वीकृति र अधिकार-सीमासँग मिलाउने।' },
            { id: 'penalty-always', label: 'सबै ढिलाइमा कारण नहेरी क्षतिपूर्ति काट्ने।' },
            { id: 'variation-any', label: 'भूमिगत सेवा लाइन भेटिएकाले जति पनि थप काम स्वतः स्वीकृत गर्ने।' },
          ],
        },
      ],
    },
    answerKey: {
      'contract-action': { type: 'single-choice', correctOptionId: 'assess-separately', optionScores: { 'assess-separately': 100, 'approve-backdate': 0, 'automatic-extension': 0 }, explanation: 'थप काम र म्याद थप दुवैलाई प्रमाणसहित छुट्टै विश्लेषण गर्नुपर्छ; अहिलेका तथ्यबाट अन्तिम निर्णय गर्न पर्याप्त आधार छैन।' },
      'contract-law': { type: 'single-choice', correctOptionId: 'variation-refs', optionScores: { 'variation-refs': 100, 'rule-8-only': 0, 'no-review': 0 }, explanation: 'स्थानीय स्रोतमा भेरिएसनका लागि दफा ५४/नियम ११८ सन्दर्भित छन्; संशोधन र अधिकार-सीमा काम अघि पुष्टि गर्नुपर्छ।' },
      'contract-records': { type: 'single-choice', correctOptionId: 'technical-records', optionScores: { 'technical-records': 100, 'verbal-only': 0, 'backdated-note': 0 }, explanation: 'साइट, समय, प्राविधिक कारण, परिमाण, लागत र अधिकारको प्रमाण निर्णय फाइलमा हुनुपर्छ।' },
      'contract-reasoning': { type: 'single-choice', correctOptionId: 'causation', optionScores: { causation: 100, 'penalty-always': 0, 'variation-any': 0 }, explanation: 'कारण, critical path प्रभाव, सम्झौता र लागू कानूनका आधार जाँचेपछि मात्रै म्याद/क्षतिपूर्ति वा भेरिएसनको निष्कर्ष निकाल्नुहोस्।' },
    },
  },
];

type ScoredOptionDraft = [id: string, label: string, score: number];

interface ScenarioQuestionDraft {
  id: string;
  title: string;
  criterion: SimulationCriterion;
  prompt: string;
  explanation: string;
  options: ScoredOptionDraft[];
}

interface ScenarioCaseDraft {
  caseKey: string;
  title: string;
  category: string;
  difficulty: SimulationCaseVersion['content']['difficulty'];
  estimatedMinutes: number;
  scenario: string;
  objectives: string[];
  priorKnowledge: string[];
  legalReferenceIds: string[];
  targetAudience?: SimulationTargetAudience;
  mockDocuments?: SimulationMockDocument[];
  questions: ScenarioQuestionDraft[];
}

const createScenarioCase = (draft: ScenarioCaseDraft): SimulationCaseVersion => {
  const expectedCriteria: SimulationCriterion[] = ['decision', 'legal-basis', 'process', 'reasoning'];
  const pointsByCriterion: Record<SimulationCriterion, number> = {
    decision: 40,
    'legal-basis': 25,
    process: 20,
    reasoning: 15,
  };
  const actualCriteria = new Set(draft.questions.map((question) => question.criterion));
  if (draft.questions.length !== expectedCriteria.length
    || expectedCriteria.some((criterion) => !actualCriteria.has(criterion))) {
    throw new Error(`Simulation case ${draft.caseKey} must cover all four scoring criteria.`);
  }

  const answerKey: SimulationAnswerKey = {};
  const steps = draft.questions.map((question) => {
    const correctOptions = question.options.filter((option) => option[2] === 100);
    if (correctOptions.length !== 1) {
      throw new Error(`Simulation question ${question.id} must have exactly one fully correct option.`);
    }

    const optionScores: Record<string, number> = {};
    for (const [optionId, , score] of question.options) {
      optionScores[optionId] = score;
    }
    answerKey[question.id] = {
      type: 'single-choice',
      correctOptionId: correctOptions[0][0],
      optionScores,
      explanation: question.explanation,
    };

    return {
      id: question.id,
      title: question.title,
      criterion: question.criterion,
      points: pointsByCriterion[question.criterion],
      prompt: question.prompt,
      questionType: 'single-choice' as const,
      legalReferenceIds: draft.legalReferenceIds,
      options: question.options.map(([id, label]) => ({ id, label })),
    };
  });

  return {
    caseKey: draft.caseKey,
    version: 1,
    status: 'published',
    content: {
      title: draft.title,
      category: draft.category,
      difficulty: draft.difficulty,
      estimatedMinutes: draft.estimatedMinutes,
      scenario: draft.scenario,
      objectives: draft.objectives,
      priorKnowledge: draft.priorKnowledge,
      steps,
      legalReferenceIds: draft.legalReferenceIds,
      targetAudience: draft.targetAudience ?? 'दुवै',
      mockDocuments: draft.mockDocuments,
    },
    answerKey,
  };
};

const ADDITIONAL_SIMULATION_CASES: SimulationCaseVersion[] = [
  createScenarioCase({
    caseKey: 'procurement-readiness-site-budget',
    title: 'खरिदपूर्व तयारी र साइट उपलब्धता',
    category: 'योजना तथा तयारी',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'स्थानीय तहले स्वास्थ्य चौकीको भवन र उपकरण एउटै आर्थिक वर्षमा खरिद गर्ने योजना बनाएको छ। उपकरणको बजेट छ, तर भवनको जग्गा हस्तान्तरण, डिजाइन स्वीकृति र समग्र खरिद तालिका अझै टुंगिएको छैन।',
    objectives: ['खरिद अघि पूरा गर्नुपर्ने तयारी पहिचान गर्ने', 'बजेट र साइट उपलब्धताको प्रमाण मिलाउने', 'बाधा र जिम्मेवारी अभिलेख गर्ने'],
    priorKnowledge: ['खरिद योजना र खरिदपूर्व तयारी'],
    legalReferenceIds: ['act-section-4a', 'rules-6-10', 'pprc-decision-6', 'ppmo-opinion-11'],
    questions: [
      { id: 'readiness-decision', title: 'अहिलेको निर्णय', criterion: 'decision', prompt: 'खरिद एकाइले अब के गर्नुपर्छ?', explanation: 'खरिदको आवश्यकता, स्वीकृत बजेट र कार्यान्वयनपूर्व तयारी मिलाएर मात्र उपयुक्त चरणमा अघि बढ्नुहोस्।', options: [['hold-and-verify', 'जग्गा/साइट, डिजाइन, बजेट र निर्भरता जाँचेर अभिलेख पूरा गर्ने; तयार भएको स्पष्ट प्याकेज मात्र स्वीकृत तालिकाअनुसार अघि बढाउने।', 100], ['publish-anyway', 'बजेट भएको भन्दै सबै कामको सूचना तुरुन्त प्रकाशित गर्ने।', 0], ['cancel-all', 'तयारी अपूरो भएकाले कुनै जाँच नगरी सबै खरिद स्थायी रूपमा रद्द गर्ने।', 25]] },
      { id: 'readiness-law', title: 'कानुनी आधार', criterion: 'legal-basis', prompt: 'कुन सन्दर्भ यस अवस्थासँग सबैभन्दा सान्दर्भिक छ?', explanation: 'दफा ४क र नियम ६–१० सम्बन्धी स्थानीय पाठलाई हाल लागू संशोधनसँग मिलाएर पुष्टि गर्नुहोस्; PPRC/PPMO सामग्री विगतको अभ्यास हो।', options: [['prep-rules', 'खरिदपूर्व तयारी, खरिद योजना र स्वीकृत लागत/बजेटका लागू व्यवस्था; PPRC निर्णय ६ र PPMO राय ११ लाई विगतको सन्दर्भ मात्र।', 100], ['award-rules', 'करार अन्त्य र कालोसूचीसम्बन्धी व्यवस्था मात्र।', 0], ['old-advice-only', 'पुरानो PPMO रायलाई वर्तमान कानूनको विकल्प मान्ने।', 0]] },
      { id: 'readiness-record', title: 'अभिलेख', criterion: 'process', prompt: 'कुन प्रमाण फाइलमा राख्ने?', explanation: 'पूर्वतयारीको वास्तविक अवस्था र जिम्मेवार निकाय प्रमाणित हुने कागजात राख्नुहोस्।', options: [['site-budget-record', 'जग्गा/साइट हस्तान्तरण, डिजाइन/स्वीकृति, बजेट उपलब्धता, निर्भरता र संशोधित कार्यतालिकाको प्रमाण।', 100], ['verbal-ready', 'निर्माण शाखाको मौखिक जानकारी मात्र।', 0], ['hide-gaps', 'स्वीकृति नभएको अवस्थालाई फाइलमा नलेखी प्रकाशन गर्ने।', 0]] },
      { id: 'readiness-risk', title: 'जोखिम', criterion: 'reasoning', prompt: 'सबैभन्दा उपयुक्त जोखिम नियन्त्रण कुन हो?', explanation: 'कामको तयारी, परस्पर निर्भरता र बजारमा सूचना दिने समय यथार्थपरक राख्दा प्रतिस्पर्धा र कार्यान्वयन दुवै सुरक्षित हुन्छन्।', options: [['stage-and-coordinate', 'निर्भरता छुट्याएर तयार प्याकेजलाई मात्र अघि बढाउने र साइट/बजेटको बाँकी जोखिमको जिम्मेवारीसहित समयतालिका मिलाउने।', 100], ['ignore-dependency', 'निर्माण र उपकरण खरिदको निर्भरता मूल्याङ्कन नगर्ने।', 0], ['split-to-avoid', 'विधि वा सीमा छल्न काम टुक्र्याउने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'cancellation-grounds-and-record',
    title: 'खरिद रद्द गर्ने वैधानिक आधार',
    category: 'मूल्याङ्कन तथा निर्णय',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'बोलपत्र मूल्याङ्कनपछि दुई प्रस्ताव सारभूत रूपमा प्रभावग्राही देखिएका छन्। कार्यालय प्रमुखले अनुमानभन्दा मूल्य बढी भएको भन्दै तत्काल रद्द गर्न भनेका छन्, तर लागत अनुमान र बजेट पुनः परीक्षणको अभिलेख छैन।',
    objectives: ['रद्द गर्ने आधार प्रमाणित गर्ने', 'प्रतिस्पर्धा र औचित्य परीक्षण गर्ने', 'कारणयुक्त निर्णय अभिलेख गर्ने'],
    priorKnowledge: ['बोलपत्र मूल्याङ्कन र अधिकारप्राप्त अधिकारीको भूमिका'],
    legalReferenceIds: ['act-section-26', 'ppmo-opinion-6', 'pprc-decision-7', 'pprc-decision-40'],
    questions: [
      { id: 'cancel-action', title: 'पहिलो निर्णय', criterion: 'decision', prompt: 'कार्यालय प्रमुखको निर्देशनपछि के गर्नु उचित हुन्छ?', explanation: 'मूल्यभन्दा बढी भएको भन्ने सामान्य भनाइ मात्र रद्दको पर्याप्त आधार हुँदैन; दफा २६ को लागू अवस्था र सक्षम निर्णय जाँच्नुपर्छ।', options: [['test-statutory-ground', 'लागत अनुमान, स्वीकृत बजेट, मूल्याङ्कन र रद्दको प्रस्तावित कानुनी आधार प्रमाणित गरी अधिकारप्राप्त तहमा कारणयुक्त निर्णयका लागि पेश गर्ने।', 100], ['cancel-now', 'कुनै थप विश्लेषण नगरी सबै बोलपत्र रद्द गर्ने।', 0], ['award-lowest', 'मूल्याङ्कन नसकी सबैभन्दा कम अंकको प्रस्ताव स्वतः स्वीकृत गर्ने।', 0]] },
      { id: 'cancel-law', title: 'आधार', criterion: 'legal-basis', prompt: 'कुन कानुनी/नजिर सन्दर्भ प्रयोग गर्ने?', explanation: 'ऐनको दफा २६ को हाल लागू पाठ निर्णायक हुन्छ; स्थानीय PPMO/PPRC निर्णयले पुराना तथ्यमा भएको प्रयोग मात्र देखाउँछन्।', options: [['act-and-precedent', 'दफा २६ को लागू पाठ, बोलपत्र कागजात र कारणयुक्त निर्णय; PPMO राय ६/PPRC निर्णय ७ र ४० विगतको सन्दर्भका रूपमा।', 100], ['old-case-binding', 'विगतको निर्णयलाई तथ्य र कानून नमिले पनि स्वतः लागू गर्ने।', 0], ['office-order', 'मौखिक निर्देशनलाई ऐनभन्दा माथि राख्ने।', 0]] },
      { id: 'cancel-record', title: 'अभिलेख', criterion: 'process', prompt: 'निर्णय फाइलमा के जोड्ने?', explanation: 'मूल्याङ्कन प्रतिवेदन, स्वीकृत अनुमान/बजेट, लागू दफासँगको विश्लेषण र अधिकारको प्रमाणबाट निर्णय परीक्षणयोग्य हुन्छ।', options: [['reasoned-file', 'मूल्याङ्कन विश्लेषण, स्वीकृत लागत अनुमान/बजेट, रद्दको ठोस कारण, लागू दफा र निर्णय गर्ने अधिकारीको स्वीकृतिसहितको फाइल।', 100], ['summary-table', 'बोलपत्रदाताको नाम र मूल्य भएको तालिका मात्र।', 0], ['backdate', 'कारणपछि खोजेर निर्णय मिति पछाडि सार्ने।', 0]] },
      { id: 'cancel-reasoning', title: 'निष्कर्ष', criterion: 'reasoning', prompt: 'सबैभन्दा सुरक्षित निष्कर्ष कुन हो?', explanation: 'रद्द वा स्वीकृतिको कुनै पनि निर्णय प्रतिस्पर्धाको चरण र प्रमाणित कानुनी आधारअनुसार हुनुपर्छ।', options: [['no-automatic-cancel', 'कानुनी आधार र तथ्य नपुगेसम्म स्वतः रद्द नगर्ने; आवश्यकता भए वैधानिक रूपमा कारणसहितको निर्णय गर्ने।', 100], ['price-alone', 'अनुमानभन्दा बढी मूल्य देखिएमा सधैं प्रक्रिया रद्द गर्ने।', 0], ['reissue-secretly', 'रद्द निर्णय नलेखी नयाँ सूचना निकाल्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'cost-estimate-and-specification-review',
    title: 'लागत अनुमान र specification को पूर्णता',
    category: 'लागत अनुमान तथा कागजात',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    scenario: 'अस्पतालले इमेजिङ उपकरण खरिद गर्न लागेको छ। खरिद फाइलमा उपकरणको आधारभूत मूल्य मात्र छ; स्थापना, तालिम, warranty पछि CMC र बजेट मिलानको स्पष्टता छैन। बोलपत्रमा CMC मागिएको भए पनि मूल्याङ्कन तालिकामा समेटिएको छैन।',
    objectives: ['लागत अनुमानका घटक जाँच्ने', 'मापनयोग्य प्राविधिक शर्त बनाउने', 'मूल्याङ्कनमा समान व्यवहार कायम गर्ने'],
    priorKnowledge: ['वस्तु खरिदका specification र लागत अनुमान'],
    legalReferenceIds: ['rules-6-10', 'pprc-decision-24', 'pprc-decision-29', 'pprc-decision-40'],
    questions: [
      { id: 'estimate-decision', title: 'खरिद अघि', criterion: 'decision', prompt: 'सूचना प्रकाशित गर्नुअघि के गर्नुपर्छ?', explanation: 'खरिदको सम्पूर्ण आवश्यकतासँग मिल्ने अनुमान, बजेट र मूल्याङ्कन विधि स्वीकृत गरेर मात्र सूचना अघि बढाउनुपर्छ।', options: [['complete-estimate', 'स्थापना, परीक्षण, तालिम, आवश्यक सेवा अवधि/CMC र स्वीकृत बजेट जाँचेर पूर्ण अनुमान र कागजात स्वीकृत गर्ने।', 100], ['publish-base-only', 'उपकरणको आधारभूत मूल्य मात्र राखेर तुरुन्त बोलपत्र प्रकाशन गर्ने।', 0], ['add-cost-later', 'CMC वा अतिरिक्त सेवाको लागत सम्झौतापछि थप गर्ने।', 0]] },
      { id: 'estimate-law', title: 'नजिर सन्दर्भ', criterion: 'legal-basis', prompt: 'कुन स्थानीय निर्णय यस जोखिमसँग नजिक छ?', explanation: 'PPRC निर्णय २४/२९/४० स्थानीय अभिलेखका विगतको निर्णय हुन्; तिनलाई वर्तमान कानुनी पाठको ठाउँमा प्रयोग नगर्नुहोस्।', options: [['pprc-estimates', 'PPRC निर्णय २४, २९ र ४० मा देखिएका लागत अनुमान/specification का जोखिमसँग तुलना गरी लागू ऐन/नियम पनि पुष्टि गर्ने।', 100], ['ppmo-opinion-only', 'कुनै पुरानो रायलाई वर्तमान लागत अनुमानको पूर्ण नियम मान्ने।', 0], ['no-citation', 'लागत अनुमान र कागजातका लागि कानुनी आधार आवश्यक नमान्ने।', 0]] },
      { id: 'estimate-docs', title: 'कागजात मिलान', criterion: 'process', prompt: 'बोलपत्र कागजात र मूल्याङ्कन तालिका कसरी मिलाउने?', explanation: 'कागजातमा मागिएको मूल्य/सेवा सबै प्रस्तावदाताका लागि समान आधारमा मूल्याङ्कन गर्न मिल्ने गरी प्रकाशन अघि तालिका बनाउनुहोस्।', options: [['align-docs', 'दायरा, warranty/CMC, स्थापना र मूल्याङ्कन विधि स्पष्ट गरी अनुमान, बजेट र मूल्याङ्कन तालिकाबीच मिलान गर्ने।', 100], ['ignore-cmc', 'CMC कागजातमा राख्ने तर मूल्याङ्कनबाट बाहिर राख्ने।', 0], ['change-after-open', 'खोलिसकेपछि कुन प्रस्तावदातालाई लाभ हुन्छ त्यसअनुसार CMC शर्त बदल्ने।', 0]] },
      { id: 'estimate-risk', title: 'निर्णय जोखिम', criterion: 'reasoning', prompt: 'अपूर्ण अनुमानको सम्भावित असर कसरी घटाउने?', explanation: 'प्रकाशनअघि जीवनचक्र लागत, बजेट पर्याप्तता, specification र मूल्याङ्कनको एकरूपता जाँच्दा विवाद र अपूर्ण करारको जोखिम घट्छ।', options: [['check-completeness', 'अनुमानको स्रोत/घटक र बजेट उपलब्धता प्रमाणित गरी आवश्यक प्राविधिक तथा वित्तीय समीक्षापछि अघि बढ्ने।', 100], ['lowest-is-enough', 'सबैभन्दा कम आधारभूत मूल्य आएमा बाँकी सेवा लागत महत्वहीन हुन्छ।', 0], ['award-and-amend', 'पछि सम्झौता संशोधनले अनुमान/शर्तका सबै कमी स्वतः सच्याउँछ।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'missing-bid-document-and-clarification',
    title: 'बोलपत्रपछि छुटेको कागजात र स्पष्टीकरण',
    category: 'बोलपत्र परीक्षण',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'बोलपत्र खोलिसकेपछि एउटा प्रस्तावदाताले म्यादभित्र नबुझाएको करसम्बन्धी प्रमाणपत्र र नयाँ अनुभव प्रमाण थप्न अनुरोध गर्छ। अर्को प्रस्तावदाताले पेश गरेको कागजातको एउटा विवरण पुष्टि गर्न मात्र स्पष्टीकरण मागेको छ।',
    objectives: ['स्पष्टीकरण र नयाँ प्रमाणबीच फरक छुट्याउने', 'सबैलाई समान व्यवहार गर्ने', 'म्यादपछिको कागजात निर्णय अभिलेख गर्ने'],
    priorKnowledge: ['बोलपत्र दाखिला र मूल्याङ्कनका प्रकाशित शर्त'],
    legalReferenceIds: ['act-section-23', 'rules-40-66', 'ppmo-opinion-185', 'ppmo-opinion-192'],
    questions: [
      { id: 'document-action', title: 'परीक्षणको निर्णय', criterion: 'decision', prompt: 'दुवै अनुरोधलाई कसरी सम्बोधन गर्ने?', explanation: 'अनिवार्य योग्यता/प्रमाण नयाँ रूपमा थप्न दिने कि नदिने भन्ने निर्णय वर्तमान कानून र प्रकाशित कागजातबाट गर्नुपर्छ; स्पष्टीकरणले प्रस्ताव बदल्न पाउँदैन।', options: [['distinguish-request', 'अनिवार्य कागजात छुटेको अवस्था र पहिल्यै पेश कागजातको पुष्टि छुट्याई, लागू नियमले अनुमति दिएको सीमाभित्र समान व्यवहार गर्ने।', 100], ['accept-all', 'प्रस्तावदातालाई कमी पूरा गर्न जति कागजात पनि पछि थप्न दिने।', 0], ['reject-both', 'कुनै स्पष्टीकरण पनि नलिई दुवैलाई स्वतः अस्वीकार गर्ने।', 25]] },
      { id: 'document-law', title: 'सन्दर्भ', criterion: 'legal-basis', prompt: 'कुन सन्दर्भ ध्यानमा राख्ने?', explanation: 'दफा २३, लागू नियम र बोलपत्र कागजात प्राथमिक हुन्; PPMO राय १८५/१९२ पुराना विगतको सन्दर्भ हुन्।', options: [['current-rule-and-docs', 'ऐनको दफा २३, लागू नियम र बोलपत्र कागजात; PPMO राय १८५/१९२ लाई मात्र विगतको अभ्यास सन्दर्भ मान्ने।', 100], ['old-opinion-as-law', 'पुरानो रायमा उल्लेख भएको निर्णयलाई सबै नयाँ खरिदमा जस्ताको तस्तै लागू गर्ने।', 0], ['post-opening-discretion', 'खोलिसकेपछि समितिले कुनै पनि नयाँ योग्यता तोक्न सक्छ।', 0]] },
      { id: 'document-process', title: 'प्रक्रिया', criterion: 'process', prompt: 'मूल्याङ्कन समितिले के अभिलेख गर्नुपर्छ?', explanation: 'प्रत्येक अनुरोध, कागजातमा रहेको शर्त, अनुमति/निषेधको आधार र सबै प्रस्तावमा समान प्रयोग अभिलेख गर्नुहोस्।', options: [['record-equal-treatment', 'अनुरोध र जवाफ, सम्बन्धित शर्त, लागू नियमको आधार र सबै समान अवस्थाका बोलपत्रदातालाई अपनाएको एउटै व्यवहार प्रतिवेदनमा राख्ने।', 100], ['private-response', 'एक बोलपत्रदातालाई मात्र मौखिक रूपमा नयाँ योग्यता पूर्ति गर्न दिने।', 0], ['no-record', 'स्पष्टीकरण भएको तथ्य प्रतिवेदनमा नलेख्ने।', 0]] },
      { id: 'document-reasoning', title: 'मूल्याङ्कन निष्कर्ष', criterion: 'reasoning', prompt: 'स्पष्टीकरणको स्वीकार्य सीमाबारे कुन निष्कर्ष ठीक छ?', explanation: 'स्पष्टीकरणले विद्यमान प्रस्तावको अस्पष्टता बुझाउन सक्छ, तर नयाँ सारभूत योग्यता/कागजात थपेर प्रतिस्पर्धा बदल्ने अनुमति स्वतः हुँदैन।', options: [['no-material-change', 'मूल प्रस्तावको सारभूत सामग्री वा योग्यता बदल्ने नयाँ कागजात स्वीकार नगर्ने; अनुमत स्पष्टीकरणलाई सीमित र समान रूपमा प्रयोग गर्ने।', 100], ['new-qualification', 'नयाँ अनुभवपत्र पाएपछि म्यादपछिको योग्यता पूरा भएको मान्ने।', 0], ['ignore-doc-terms', 'बोलपत्र कागजातको प्रमाण शर्त मूल्याङ्कनमा लागू नगर्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'similar-experience-evaluation',
    title: 'समान प्रकृतिको अनुभव मूल्याङ्कन',
    category: 'योग्यता मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'सडक निर्माणको बोलपत्रमा एउटा कम्पनीले फरक जिल्लाको सडक परियोजनाको अनुभव पेश गरेको छ। परियोजनाको मूल्य र भौगोलिक अवस्था फरक भए पनि कामको प्रकृति तथा बोलपत्रले तोकेको समानताको केही शर्त पूरा भएको देखिन्छ।',
    objectives: ['बोलपत्रको परिभाषाबाट योग्यता जाँच्ने', 'प्रमाणित अनुभवको सान्दर्भिकता मूल्याङ्कन गर्ने', 'अनावश्यक नयाँ मापदण्ड नथप्ने'],
    priorKnowledge: ['प्राविधिक योग्यता र समान अनुभव'],
    legalReferenceIds: ['act-section-23', 'act-section-25', 'rules-40-66', 'pprc-decision-27'],
    questions: [
      { id: 'experience-decision', title: 'योग्यता निर्णय', criterion: 'decision', prompt: 'प्रस्तावको अनुभवबारे कुन कदम ठीक छ?', explanation: 'बोलपत्रमा प्रकाशित आकार/प्रकृतिको मापदण्डबाट प्रमाण मूल्याङ्कन गर्नुहोस्; फरक जिल्ला वा फरक नाम मात्रले स्वतः अयोग्य हुँदैन।', options: [['apply-published-test', 'प्रकाशित समान आकार/प्रकृतिको परिभाषा, आवश्यक मात्रा/मूल्य र प्रमाणसँग तुलना गरी कारणसहित योग्यता निर्णय गर्ने।', 100], ['same-district-only', 'अनुभव आफ्नै जिल्लामा नभएकाले स्वतः अयोग्य ठहर गर्ने।', 0], ['accept-title-only', 'कामको शीर्षक मिलेकै आधारमा अन्य मापदण्ड नहेरी योग्य मान्ने।', 25]] },
      { id: 'experience-law', title: 'नजिर', criterion: 'legal-basis', prompt: 'स्थानीय निर्णयबाट कुन पाठ लिन सकिन्छ?', explanation: 'PPRC निर्णय २७ पुरानो सडक खरिदको तथ्यमा आधारित हो; वर्तमान कागजात र कानून नै लागू हुन्छ।', options: [['decision-27-as-context', 'PPRC निर्णय २७ लाई समान प्रकृतिको अनुभवको विगतको सन्दर्भ मानी बोलपत्रको हालको शर्त लागू गर्ने।', 100], ['precedent-replaces-sbd', 'निर्णय २७ ले हरेक खरिदमा समान परिभाषा स्वतः बनाउँछ।', 0], ['local-only', 'ऐन/कागजातभन्दा भौगोलिक नजिकपनलाई प्राथमिक कानुनी आधार मान्ने।', 0]] },
      { id: 'experience-proof', title: 'प्रमाण परीक्षण', criterion: 'process', prompt: 'कुन प्रमाण जाँच्ने?', explanation: 'सम्पन्न काम, आवेदकको भूमिका, मूल्य/परिमाण र जारीकर्ता निकायको आधिकारिकता आवश्यक शर्तअनुसार प्रमाणित गर्नुहोस्।', options: [['verify-relevant-proof', 'सम्पन्नता प्रमाण, सम्झौता/कार्य विवरण, बोलपत्रदाताको भूमिका र आवश्यक परिमाण/मूल्यलाई जारीकर्ता निकायबाट प्रमाणीकरण गर्ने।', 100], ['name-match', 'ठेक्काको नाममा road शब्द भए पुग्छ।', 0], ['assume-jv-share', 'JV भएको कुनै पनि परियोजनाको सम्पूर्ण रकम एक सदस्यलाई स्वतः दिने।', 0]] },
      { id: 'experience-risk', title: 'समान व्यवहार', criterion: 'reasoning', prompt: 'मूल्याङ्कनमा निष्पक्षताको जोखिम कसरी घटाउने?', explanation: 'नयाँ, अप्रकाशित भौगोलिक वा नामसम्बन्धी शर्त थप्दा असमान व्यवहार हुन्छ; सबै प्रस्तावमा समान प्रकाशित मापदण्ड लागू गर्नुपर्छ।', options: [['consistent-criteria', 'सबै बोलपत्रदातालाई एउटै प्रकाशित योग्यता मापदण्ड लगाई, फरक मतको कारण र प्रमाण स्पष्ट गर्ने।', 100], ['invent-location-rule', 'मूल्याङ्कन क्रममा नयाँ जिल्ला/स्थान शर्त थप्ने।', 0], ['favor-incumbent', 'स्थानीय ठेकेदारलाई अनुभव परीक्षणबाट छुट दिने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'technical-compliance-and-verification',
    title: 'प्राविधिक अनुरूपता र प्रमाण प्रमाणीकरण',
    category: 'मूल्याङ्कन तथा निर्णय',
    difficulty: 'उन्नत',
    estimatedMinutes: 13,
    scenario: 'मेडिकल उपकरणको मूल्याङ्कनमा समितिले compliance तालिका बनाएको छ। एउटा प्रस्तावमा specification पूरा भएको दाबी छ, तर पेश गरिएको trademark/authorization कागजातको जारीकर्ता पुष्टि गरिएको छैन र प्रतिवेदनमा निष्कर्षको कारण खुलाइएको छैन।',
    objectives: ['मापनयोग्य specification लागू गर्ने', 'बाह्य प्रमाणको आधिकारिकता पुष्टि गर्ने', 'विश्लेषणसहितको मूल्याङ्कन प्रतिवेदन बनाउने'],
    priorKnowledge: ['प्राविधिक प्रस्ताव परीक्षण'],
    legalReferenceIds: ['act-section-23', 'act-section-25', 'pprc-decision-18', 'pprc-decision-29'],
    questions: [
      { id: 'tech-action', title: 'समितिको अर्को कदम', criterion: 'decision', prompt: 'मूल्याङ्कन समितिले के गर्नुपर्छ?', explanation: 'प्रकाशित specification विरुद्ध प्रमाण मूल्याङ्कन र शङ्कास्पद प्रमाण आधिकारिक निकायबाट पुष्टि गरेर मात्र निष्कर्ष निकाल्नुहोस्।', options: [['verify-and-analyze', 'प्रकाशित specification अनुसार प्रत्येक बुँदा परीक्षण गर्ने, शङ्कास्पद प्रमाण जारीकर्ताबाट प्रमाणीकरण गरी कारणसहित निष्कर्ष दिने।', 100], ['trust-claim', 'बोलपत्रदाताले comply भनेकाले प्रमाण परीक्षण नगर्ने।', 0], ['reject-automatically', 'कागजातको प्रमाणीकरण बाँकी छ भन्दै बिना जाँच स्वतः अयोग्य बनाउने।', 0]] },
      { id: 'tech-law', title: 'निर्णय सन्दर्भ', criterion: 'legal-basis', prompt: 'कुन निर्णय यस अवस्थासँग नजिक छ?', explanation: 'PPRC निर्णय १८/२९ विगतको तथ्यका आधारमा हुन्; वर्तमान ऐन, नियम र बोलपत्रको प्रकाशित मापदण्डसँग मिलाएर हेर्नुहोस्।', options: [['pprc-18-29', 'ऐनको दफा २३/२५ र कागजातसँगै PPRC निर्णय १८/२९ का विगतको मूल्याङ्कन पाठ हेर्ने।', 100], ['decision-as-current-threshold', 'पुरानो निर्णयको हरेक प्राविधिक शर्त अहिले स्वतः अनिवार्य छ।', 0], ['price-only', 'प्राविधिक अनुरूपताको सट्टा मूल्यलाई मात्र आधार बनाउने।', 0]] },
      { id: 'tech-evidence', title: 'प्रमाणीकरण प्रक्रिया', criterion: 'process', prompt: 'कागजातको आधिकारिकता कसरी जाँच्ने?', explanation: 'सार्वजनिक स्रोत वा जारीकर्ता संस्थाबाट स्वतन्त्र पुष्टि गरी अनुरोध-जवाफ अभिलेख गर्नुहोस्।', options: [['official-source', 'जारीकर्ता/सम्बन्धित आधिकारिक निकायमा लिखित पुष्टि माग्ने, जवाफ र पुष्टि भएका विवरण प्रतिवेदनमा संलग्न गर्ने।', 100], ['competitor-rumor', 'प्रतिस्पर्धीको आरोपलाई अन्तिम प्रमाण मान्ने।', 0], ['self-certify', 'प्रस्तावदाताको नयाँ मौखिक दाबीलाई पर्याप्त मान्ने।', 0]] },
      { id: 'tech-reasoning', title: 'प्रतिवेदन', criterion: 'reasoning', prompt: 'मूल्याङ्कन प्रतिवेदनमा कस्तो विवरण खुलाउनुपर्छ?', explanation: 'खाली तालिका मात्र पर्याप्त हुँदैन; परीक्षण बुँदा, प्रमाण, पुष्ट्याइँ र योग्य/अयोग्यको वस्तुपरक कारण खुलाउनुपर्छ।', options: [['reasoned-report', 'प्रत्येक शर्त, पेश प्रमाण, प्रमाणीकरणको नतिजा र योग्य/अयोग्य निष्कर्षको कारण मिलेको विश्लेषणात्मक प्रतिवेदन तयार गर्ने।', 100], ['table-only', 'कुनै कारणबिना checkmark भएको तालिका मात्र बुझाउने।', 0], ['rewrite-after-award', 'आशय सूचना दिएपछि मात्र प्रतिवेदनमा कारण थप्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'correct-sbd-and-local-preference',
    title: 'उपयुक्त बोलपत्र कागजात र प्राथमिकता',
    category: 'बोलपत्र कागजात',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'कार्यालयले स्थानीय रूपमा उत्पादित सामग्री खरिद गर्न पुरानो नमूना बोलपत्र कागजात नक्कल गरेको छ। मस्यौदामा वस्तुको प्रकृतिसँग नमिल्ने शर्त र पुरानो मूल्य प्राथमिकता प्रतिशत पनि समावेश छ।',
    objectives: ['खरिदको प्रकृतिअनुसार SBD छनोट गर्ने', 'पुरानो प्राथमिकता/सीमा स्वतः नअपनाउने', 'प्रकाशनअघि कागजात समीक्षा गर्ने'],
    priorKnowledge: ['वस्तु/निर्माण/परामर्शका बोलपत्र कागजात'],
    legalReferenceIds: ['act-section-5', 'act-section-23', 'rules-49-59', 'pprc-decision-2'],
    questions: [
      { id: 'sbd-action', title: 'मस्यौदा समीक्षा', criterion: 'decision', prompt: 'प्रकाशनअघि कस्तो कदम चाल्ने?', explanation: 'खरिदको वास्तविक प्रकृतिसँग मेल खाने हालको SBD/कागजात अपनाउनुहोस् र अप्रासंगिक शर्त हटाउनुहोस्।', options: [['select-current-sbd', 'वस्तुको प्रकृति र लागू नियमअनुसार हालको आधिकारिक SBD छानेर सबै शर्त, फाराम र मूल्याङ्कन मापदण्ड समीक्षा गर्ने।', 100], ['reuse-template', 'पुरानो नमूना जस्ताको तस्तै राखेर प्रकाशन गर्ने।', 0], ['supplier-draft', 'इच्छुक आपूर्तिकर्तालाई आफ्नै लागि शर्त लेख्न दिने।', 0]] },
      { id: 'sbd-law', title: 'स्रोत', criterion: 'legal-basis', prompt: 'पुरानो PPRC निर्णयलाई कसरी प्रयोग गर्ने?', explanation: 'PPRC निर्णय २ पुरानो कागजातबारे विगतको सन्दर्भ हो; लागू नमूना र नियम वर्तमान आधिकारिक स्रोतबाट पुष्टि गर्नुपर्छ।', options: [['verify-current', 'ऐन/नियम र हालको आधिकारिक SBD प्राथमिक; PPRC निर्णय २ लाई पुरानो जोखिमको उदाहरण मात्र मान्ने।', 100], ['old-sbd-binding', 'निर्णय २ वा पुरानो नमूनालाई आजको बाध्यकारी कागजात मान्ने।', 0], ['no-source', 'SBD छनोट खरिदकर्ताको मौखिक इच्छामा छोड्ने।', 0]] },
      { id: 'sbd-preference', title: 'प्राथमिकता शर्त', criterion: 'process', prompt: 'पुरानो प्राथमिकता प्रतिशतको मस्यौदालाई कसरी सम्हाल्ने?', explanation: 'पुरानो निर्णय/कागजातको प्रतिशतलाई नक्कल नगरी हाल लागू प्राथमिकता व्यवस्था, पात्रता र कागजातमा स्पष्ट खुलासा पुष्टि गर्नुहोस्।', options: [['verify-preference', 'हाल लागू कानुनी प्राथमिकता, पात्रता, प्रमाण र गणना विधि आधिकारिक स्रोतबाट पुष्टि गरी प्रकाशनअघि स्पष्ट लेख्ने; पुष्टि नभए पुरानो प्रतिशत हटाउने।', 100], ['copy-old-rate', 'पुरानो कागजातको आधारमा नयाँ SBD मा पुरानै प्रतिशत राख्ने।', 0], ['ad-hoc-award', 'कुनै स्पष्ट आधारबिना मूल्याङ्कनमा प्राथमिकता दिने।', 0]] },
      { id: 'sbd-reasoning', title: 'अन्तिम गुणस्तर जाँच', criterion: 'reasoning', prompt: 'कागजातको प्रतिस्पर्धात्मकता कसरी जाँच्ने?', explanation: 'मापदण्ड स्पष्ट, सम्बन्धित र समान रूपमा लागू हुने हुनुपर्छ; अनावश्यक रूपमा प्रतिस्पर्धा सीमित गर्नु हुँदैन।', options: [['clear-neutral-terms', 'अनुपातिक, कामसँग सम्बन्धित र प्रमाणित गर्न मिल्ने शर्त राखी, समान व्यवहार र प्रतिस्पर्धामा असर जाँच्ने।', 100], ['brand-lock', 'कुनै औचित्यबिना एउटै ब्रान्ड/स्थानीय प्रदायकमा सीमित गर्ने।', 0], ['vague-terms', 'मूल्याङ्कनपछि अर्थ लगाउन मिल्ने अस्पष्ट शर्त राख्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'two-envelope-evaluation-sequence',
    title: 'दुई खाम मूल्याङ्कनको क्रम',
    category: 'बोलपत्र प्रक्रिया',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'सूचनामा प्राविधिक र आर्थिक प्रस्ताव छुट्टाछुट्टै पेश गर्न भनिएको छ। खोल्ने दिन अनलाइन प्रणालीमा सबै कागजात देखिएपछि कर्मचारीले आर्थिक प्रस्ताव पनि प्राविधिक मूल्याङ्कनअघि खोल्न सकिने बताउँछन्।',
    objectives: ['प्रकाशित प्रक्रिया पालना गर्ने', 'प्राविधिक र आर्थिक मूल्याङ्कन छुट्याउने', 'प्रवेश/खोल्ने अभिलेख राख्ने'],
    priorKnowledge: ['e-GP र चरणबद्ध मूल्याङ्कन'],
    legalReferenceIds: ['act-section-23', 'rules-49-59', 'pprc-decision-5'],
    questions: [
      { id: 'envelope-action', title: 'खोल्ने क्रम', criterion: 'decision', prompt: 'समितिले कुन क्रम अपनाउनुपर्छ?', explanation: 'सूचना र वर्तमान प्रणाली/कागजातले तोकेको चरण पालना गर्नुहोस्; प्राविधिक नतिजा नहुँदै वित्तीय प्रस्ताव खोल्नु हुँदैन।', options: [['follow-stated-sequence', 'प्रकाशित कागजात र हालको e-GP प्रक्रियाअनुसार पहिले प्राविधिक मूल्याङ्कन गर्ने र योग्य ठहरिएका प्रस्तावको आर्थिक चरण मात्र खोल्ने।', 100], ['open-all', 'अनलाइनमा देखिने भएकाले सबै आर्थिक प्रस्ताव तुरुन्त खोल्ने।', 0], ['choose-later', 'कुन प्रस्ताव खोल्ने भन्ने कुरा मूल्याङ्कनपछि छनोट गर्ने।', 0]] },
      { id: 'envelope-law', title: 'सन्दर्भ', criterion: 'legal-basis', prompt: 'PPRC निर्णय ५ लाई कसरी बुझ्ने?', explanation: 'निर्णय ५ पुरानो e-bid/दुई खाम सन्दर्भ हो; तत्कालीन सीमा वा प्रक्रिया वर्तमानमा स्वतः नअपनाउनुहोस्।', options: [['current-docs', 'वर्तमान ऐन/नियम, प्रकाशित बोलपत्र कागजात र e-GP निर्देशन प्राथमिक; PPRC निर्णय ५ विगतको उदाहरण मात्र।', 100], ['old-threshold', 'निर्णय ५ को तत्कालीन खरिद सीमा अहिले पनि उही छ।', 0], ['general-rule', 'प्राविधिक/आर्थिक चरणको कुनै फरक हुँदैन।', 0]] },
      { id: 'envelope-record', title: 'प्रक्रिया अभिलेख', criterion: 'process', prompt: 'कुन अभिलेख राख्ने?', explanation: 'खोल्ने मिति, उपस्थित/प्रवेश लग, प्राविधिक नतिजा र आर्थिक प्रस्ताव खोल्ने अधिकार/सूचना देखिने अभिलेख सुरक्षित गर्नुहोस्।', options: [['audit-trail', 'e-GP audit trail, खोल्ने विवरण, प्राविधिक मूल्याङ्कन र आर्थिक चरण खोल्ने निर्णय/सूचना सुरक्षित राख्ने।', 100], ['screenshots-only', 'कुनै प्रणाली लग नराखी मनपर्ने प्रस्तावको screenshot मात्र।', 0], ['manual-change', 'पहिलो खोलाइपछि प्रणालीमा चरणको समय बदल्ने।', 0]] },
      { id: 'envelope-risk', title: 'निष्पक्षता', criterion: 'reasoning', prompt: 'यो क्रमले कुन जोखिम नियन्त्रण गर्छ?', explanation: 'वित्तीय प्रस्तावको जानकारीले प्राविधिक निर्णयलाई प्रभावित नगर्ने र सबै प्रस्तावदातालाई प्रकाशित प्रक्रियामा समान व्यवहार हुने व्यवस्था गर्नुपर्छ।', options: [['protect-independence', 'प्राविधिक मूल्याङ्कनको निष्पक्षता जोगाउने, आर्थिक प्रभावबाट मुक्त राख्ने र सबै प्रस्तावदातालाई समान अवसर दिने।', 100], ['price-influence', 'मूल्य हेरेपछि प्राविधिक निर्णयमा संशोधन गर्न दिने।', 0], ['selective-opening', 'कम मूल्य भएको प्रस्तावको मात्र आर्थिक खाम खोल्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'joint-venture-qualification',
    title: 'JV साझेदारको भूमिका र योग्यता',
    category: 'योग्यता मूल्याङ्कन',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    targetAudience: 'दुवै',
    scenario: 'निर्माण बोलपत्रमा संयुक्त उपक्रमले अनुभव र वित्तीय क्षमता पेश गरेको छ। कागजातमा प्रत्येक सदस्यको भूमिका र अनुभव बाँडफाँट कसरी मूल्याङ्कन गर्ने स्पष्ट छ, तर समितिले ती शर्त पढेको छैन।',
    objectives: ['JV सम्झौता र प्रकाशित योग्यता जाँच्ने', 'साझेदारको भूमिका प्रमाणित गर्ने', 'कुनै पुरानो प्रतिशत नथप्ने'],
    priorKnowledge: ['JV र बोलपत्रदाता योग्यता'],
    legalReferenceIds: ['act-section-23', 'rules-28-35', 'ppmo-opinion-9'],
    mockDocuments: [
      {
        id: 'doc-jv-agreement',
        title: 'संयुक्त उपक्रम सम्झौता (Joint Venture Agreement)',
        documentType: 'jv-agreement',
        issuer: 'सूर्य कन्स्ट्रक्सन प्रा.लि. तथा चन्द्र बिल्डर्स प्रा.लि.',
        date: '२०८१/०२/२५',
        referenceNo: 'JV/AGR/2081/02',
        content: `सार्वजनिक निर्माण खरिद ठेक्का नं.: DUDBC/BLD/NCB-08/2080-81

पक्षहरू:
१. सूर्य कन्स्ट्रक्सन प्रा.लि. (साझेदार क) - हिस्सा: ५०%
२. चन्द्र बिल्डर्स प्रा.लि. (साझेदार ख) - हिस्सा: ५०%

प्रस्तावित कार्य विभाजन:
- मुख्य साझेदार (Lead Partner): सूर्य कन्स्ट्रक्सन प्रा.लि. (अधिकार प्रत्यायोजनसहित)
- आर्थिक तथा प्राविधिक दायित्व: दुवै कम्पनी संयुक्त र छुट्टाछुट्टै (Jointly and Severally) जिम्मेवार रहनेछन्।
- बोलपत्र कागजातको दफा २८ अनुसार Lead Partner को हिस्सा कम्तीमा ५१% हुनुपर्ने शर्त रहेकोमा सम्झौतामा ५०-५०% मात्र उल्लेख छ।`,
        notes: [
          'बोलपत्र कागजात (SBD) मा तोकिएको Lead Partner को न्यूनतम हिस्सा पूरा भएको छ वा छैन जाँच्नुपर्छ।',
          'कागजातमा संयुक्त र पृथक (Joint & Several) दायित्व स्वीकार गरेको हुनुपर्छ।',
        ],
      },
    ],
    questions: [
      { id: 'jv-action', title: 'योग्यता निर्णय', criterion: 'decision', prompt: 'समितिले कस्तो मूल्याङ्कन गर्ने?', explanation: 'JV को क्षमता र सदस्यहरूको भूमिका प्रकाशित कागजातमा तोकिएको आधारअनुसार छुट्टाछुट्टै र संयुक्त रूपमा जाँच्नुहोस्।', options: [['apply-jv-terms', 'JV agreement, सदस्यगत भूमिका/प्रतिबद्धता र कागजातले तोकेको संयुक्त/व्यक्तिगत योग्यता आधारअनुसार निर्णय गर्ने।', 100], ['leader-only', 'नेतृत्व सदस्यको प्रमाण मात्र हेरेर बाँकी सबै शर्त उपेक्षा गर्ने।', 0], ['reject-all-jv', 'JV भएकोले स्वतः अयोग्य ठहर गर्ने।', 0]] },
      { id: 'jv-law', title: 'विगतको राय', criterion: 'legal-basis', prompt: 'PPMO राय ९ को उपयुक्त प्रयोग कुन हो?', explanation: 'राय ९ विगतको सन्दर्भ हो; हाल लागू नियम र बोलपत्रको JV शर्तलाई त्यसले प्रतिस्थापन गर्दैन।', options: [['historical-check', 'लागू नियम र JV शर्त प्राथमिक राखी PPMO राय ९ बाट साझेदारको भूमिका जाँच्ने विगतको पाठ लिनु।', 100], ['copy-percent', 'राय ९ को पुरानो हिस्सा/प्रतिशत अहिलेको सबै JV मा जस्ताको तस्तै लागू गर्नु।', 0], ['ignore-agreement', 'सम्झौता कागजातमा लेखिएको JV भूमिका नहेर्नु।', 0]] },
      { id: 'jv-record', title: 'कागजात परीक्षण', criterion: 'process', prompt: 'कुन कागजात/प्रमाण मिलाउने?', explanation: 'JV agreement, हस्ताक्षर, प्रतिनिधि, सदस्यको जिम्मेवारी र योग्यता प्रमाण प्रकाशित शर्तअनुसार जाँच्नुहोस्।', options: [['check-agreement', 'JV agreement/प्रतिबद्धता, सदस्यहरूको हस्ताक्षर र भूमिका, आवश्यक अनुभव/वित्तीय प्रमाण तथा कागजातले तोकेको दायित्व जाँच्ने।', 100], ['verbal-share', 'मूल्याङ्कनपछि सदस्यको हिस्सा मौखिक रूपमा तय गर्ने।', 0], ['single-certificate', 'एउटा सदस्यको प्रमाण सबै सदस्यलाई स्वतः दिने।', 0]] },
      { id: 'jv-risk', title: 'जोखिम', criterion: 'reasoning', prompt: 'समान प्रतिस्पर्धा कायम गर्ने उत्तम तरिका कुन हो?', explanation: 'कुनै विशेष JV लाई अनुकूल वा प्रतिकूल नयाँ मापदण्ड नबनाई सबै प्रस्तावमा प्रकाशित सर्त समान लागू गर्नुहोस्।', options: [['equal-published-tests', 'प्रकाशित नियमले अनुमति दिएको योग्यता aggregation मात्र प्रयोग गरी सबै JV मा समान परीक्षण गर्ने।', 100], ['new-share-rule', 'बोलपत्र खुलेपछि नयाँ सदस्यगत प्रतिशत सीमा बनाउने।', 0], ['ignore-capacity', 'कागजातअनुसार आवश्यक क्षमता नहेर्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'buyer-boq-omission',
    title: 'BOQ मा खरिद निकायबाट छुटेको item',
    category: 'लागत अनुमान तथा कागजात',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    targetAudience: 'दुवै',
    scenario: 'निर्माण बोलपत्रको BOQ मा आवश्यक बीमा मद खरिद निकायबाट छुटेको देखिन्छ। बोलपत्रदाताहरूले यसलाई फरक ढंगले समेटेका छन् र प्रस्ताव खोलिसकिएको छ। मूल्याङ्कन समितिले सबैलाई एउटै औसत दर थप्ने प्रस्ताव गरेको छ।',
    objectives: ['खरिद निकायको कागजात त्रुटि पहिचान गर्ने', 'खोलिसकेपछि अप्रकाशित गणना नथप्ने', 'समान व्यवहार र कानुनी समीक्षा सुनिश्चित गर्ने'],
    priorKnowledge: ['BOQ र बोलपत्र कागजातको व्याख्या'],
    legalReferenceIds: ['act-section-23', 'act-section-25', 'ppmo-opinion-12'],
    mockDocuments: [
      {
        id: 'doc-omitted-boq',
        title: 'खरिद एकाइले जारी गरेको परिमाण विवरण (BOQ Sheet)',
        documentType: 'boq-sheet',
        issuer: 'काल्पनिक भवन तथा आवास डिभिजन कार्यालय',
        date: '२०८१/०१/१२',
        referenceNo: 'BOQ/2080-81/09',
        content: `क्र.सं. | कामको विवरण | एकाइ | परिमाण (Quantity) | दर (अङ्कमा) | जम्मा रकम
-----------------------------------------------------------------------------
१. | साइट सरसफाइ तथा प्रारम्भिक कार्य | लट (LS) | १.०० | [...] | [...]
२. | जग खन्ने कार्य (Excavation) | घन मिटर | ४५०.०० | [...] | [...]
३. | ढलान कार्य (RCC Works 1:1.5:3) | घन मिटर | १२०.०० | [...] | [...]
४. | बीमा कार्य (Contractors All Risk Insurance) | [खरिद एकाइबाट छुटेको मद] | [...] | [...]
५. | भित्री प्लास्टर कार्य (Plaster 1:4) | वर्ग मिटर | ८५०.०० | [...] | [...]

कैफियत:
- बीमा सम्बन्धी मद बोलपत्र कागजातको शर्तमा अनिवार्य भनिएको तर BOQ को तालिकामा परिमाण र मूल्य महल नै खरिद एकाइबाट छुट भएको।`,
        notes: [
          'PPMO राय नं. १२ अनुसार निकायको आफ्नै छुटलाई बोलपत्रदातामाथि एकतर्फी थोपर्न वा मनपरी औसत दर थपेर मूल्याङ्कन बिगार्न मिल्दैन।',
        ],
      },
    ],
    questions: [
      { id: 'boq-omission-action', title: 'अगाडिको कदम', criterion: 'decision', prompt: 'औसत दर थप्ने प्रस्तावलाई कसरी सम्बोधन गर्ने?', explanation: 'पुरानो रायमा सिफारिस भएको कुनै गणना-विधि वर्तमान खरिदमा स्वतः लागू हुँदैन; प्रकाशित कागजात र लागू नियमअनुसार कानुनी समीक्षा चाहिन्छ।', options: [['pause-and-review', 'सबै प्रस्तावको प्रभाव, प्रकाशित BOQ/शर्त र लागू नियमको कानुनी समीक्षा गरी अधिकारप्राप्त तहबाट समान र लिखित समाधान तय नगरेसम्म मनलाग्दी दर नथप्ने।', 100], ['average-all', 'PPRC/PPMO को कुनै पनि पुरानो सन्दर्भ नहेरी सबैमा औसत दर थप्ने।', 0], ['select-winner-rate', 'छान्न चाहेको बोलपत्रदाताको दर सबैमा लागू गर्ने।', 0]] },
      { id: 'boq-omission-law', title: 'रायको सीमा', criterion: 'legal-basis', prompt: 'PPMO राय १२ ले कस्तो भूमिका खेल्छ?', explanation: 'राय १२ विगतको BOQ-छुट सन्दर्भ हो; त्यसको विशिष्ट उपचारलाई हालको कानून/कागजात परीक्षणबिना सामान्य नियम नमान्नुहोस्।', options: [['historical-not-rule', 'राय १२ लाई कागजात त्रुटिको विगतको उदाहरण मानी, हालको ऐन/नियम र प्रकाशित शर्तबाट समाधान पुष्टि गर्ने।', 100], ['automatic-average', 'राय १२ ले सबै खरिदमा औसत दर अनिवार्य गर्छ।', 0], ['ignore-statute', 'ऐन/नियम छोडेर पुरानो राय मात्र लागू गर्ने।', 0]] },
      { id: 'boq-omission-process', title: 'अभिलेख र समानता', criterion: 'process', prompt: 'कुन अभिलेख तयार गर्ने?', explanation: 'BOQ त्रुटि कहाँ भयो, यसले प्रत्येक प्रस्तावमा के असर गर्‍यो र कुन कानुनी आधारमा समाधान भयो भन्ने स्पष्ट हुनुपर्छ।', options: [['impact-analysis', 'छुटेको मद, सबै प्रस्तावको फरक व्यवहार/मूल्य प्रभाव, कागजातका शर्त, कानुनी राय र निर्णयको समान प्रयोग अभिलेख गर्ने।', 100], ['silent-correction', 'दर गोप्य रूपमा सच्याएर मूल्याङ्कन अघि बढाउने।', 0], ['supplier-contact', 'एक प्रस्तावदातासँग निजी रूपमा दर मिलाउने।', 0]] },
      { id: 'boq-omission-reasoning', title: 'समाधानको सिद्धान्त', criterion: 'reasoning', prompt: 'सबैभन्दा विश्वसनीय सिद्धान्त कुन हो?', explanation: 'खोलिसकेपछि नयाँ मूल्याङ्कन सूत्र बनाउनु निष्पक्षता र पारदर्शितामा जोखिम हो; तथ्य र अधिकारको समीक्षा आवश्यक हुन्छ।', options: [['no-new-formula', 'प्रकाशित नभएको गणना/दर मनलाग्दी नथप्ने; समान व्यवहार कायम गर्ने वैधानिक बाटो र आवश्यक परे प्रक्रिया रोक्ने निर्णय कारणसहित गर्ने।', 100], ['post-hoc-formula', 'खोलिसकेपछि परिणाम अनुकूल बनाउने नयाँ सूत्र प्रयोग गर्ने।', 0], ['ignore-impact', 'कागजातमा छुट भए पनि बोलपत्रदातामा असर छैन भनी प्रमाणबिना मान्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'front-loaded-boq-rates',
    title: 'BOQ को असन्तुलित दर र cash flow',
    category: 'बोलपत्र मूल्याङ्कन',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'निर्माण बोलपत्रमा जम्मा मूल्य प्रतिस्पर्धी छ, तर सुरुवाती कामका केही BOQ दर असामान्य रूपमा उच्च र पछिल्ला कामका दर कम देखिन्छन्। बोलपत्र कागजातमा असन्तुलित दरको समीक्षा गर्ने शर्त छ।',
    objectives: ['एकाइ दरको जोखिम विश्लेषण गर्ने', 'प्रकाशित शर्त लागू गर्ने', 'प्रमाणसहित निष्कर्ष रेकर्ड गर्ने'],
    priorKnowledge: ['BOQ तुलना र करार जोखिम'],
    legalReferenceIds: ['act-section-23', 'rules-64-66', 'ppmo-opinion-199'],
    questions: [
      { id: 'frontload-action', title: 'मूल्याङ्कन निर्णय', criterion: 'decision', prompt: 'असन्तुलित दर देखिँदा के गर्ने?', explanation: 'कागजातमा रहेको शर्तअनुसार दरको यथार्थता र जोखिम जाँच्नुहोस्; कुल मूल्य मात्र वा अनुमानको फरक मात्रले नतिजा स्वतः तय गर्दैन।', options: [['analyze-rates', 'BOQ मदगत दर, मात्रा, लागत आधार र प्रकाशित असन्तुलित दरसम्बन्धी शर्त परीक्षण गरी कारणसहित निर्णय गर्ने।', 100], ['total-only', 'कुल योग कम भएकाले कुनै थप परीक्षण नगर्ने।', 0], ['reject-without-clause', 'कागजातमा आधार नहेरी असामान्य लागेकै कारण स्वतः अयोग्य बनाउने।', 25]] },
      { id: 'frontload-law', title: 'सन्दर्भ', criterion: 'legal-basis', prompt: 'PPMO राय १९९ लाई कसरी प्रयोग गर्ने?', explanation: 'राय १९९ मा असन्तुलित दर/Line of Credit को पुरानो छलफल छ; वर्तमान कागजात र कानूनबाट पुष्टि गर्नुपर्छ।', options: [['apply-published-terms', 'प्रकाशित शर्त तथा लागू ऐन/नियम प्राथमिक राखी PPMO राय १९९ लाई विगतको जोखिम-सन्दर्भ मान्ने।', 100], ['automatic-loc', 'राय १९९ ले सबै खरिदमा एउटै LOC सीमा अहिले पनि तोक्छ।', 0], ['exclude-by-rumor', 'प्रतिस्पर्धीको आरोप मात्रबाट दर अस्वीकार गर्ने।', 0]] },
      { id: 'frontload-evidence', title: 'प्रमाण', criterion: 'process', prompt: 'कुन विश्लेषण राख्ने?', explanation: 'दर र मात्रा, कामको समयक्रम, भुक्तानी सर्त र कागजातमा मागिएको प्रमाणको सम्बन्ध देखाउने प्रतिवेदन तयार गर्नुहोस्।', options: [['rate-risk-analysis', 'असामान्य मद, दर-विश्लेषण, कामको क्रम/नगद प्रवाहमा असर र आवश्यक आधिकारिक प्रमाणसहित प्रतिवेदन राख्ने।', 100], ['verbal-concern', 'समितिको मौखिक शङ्का मात्र।', 0], ['invent-requirement', 'म्यादपछि नयाँ LOC प्रमाण अनिवार्य गर्ने।', 0]] },
      { id: 'frontload-risk', title: 'करार जोखिम', criterion: 'reasoning', prompt: 'कुन सम्भावित जोखिम जाँच्नुपर्छ?', explanation: 'अग्रिम उच्च दरले प्रारम्भिक भुक्तानी, परिमाण परिवर्तन वा करार कार्यसम्पादनमा जोखिम पार्न सक्छ; यसलाई प्रमाणसँग जोड्नुहोस्।', options: [['cashflow-impact', 'उच्च अग्रिम भुक्तानी, परिमाण परिवर्तन र कार्यसम्पादन जोखिमको असरलाई BOQ तथा प्रकाशित करार शर्तसँग जोडेर मूल्याङ्कन गर्ने।', 100], ['assume-fraud', 'कुनै विश्लेषणबिना नै सुरुमै जालसाजी भएको स्वतः निष्कर्ष निकाल्ने।', 0], ['no-contract-risk', 'एकाइ दरको ढाँचाले करारमा कुनै प्रभाव पार्दैन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'consulting-selection-and-negotiation',
    title: 'परामर्श सेवाको चयन र वार्ता',
    category: 'परामर्श सेवा',
    difficulty: 'उन्नत',
    estimatedMinutes: 13,
    scenario: 'परामर्श सेवाको प्रस्ताव मूल्याङ्कनपछि पहिलो-ranked परामर्शदातासँग कार्यविधि र सम्झौता वार्ता भइरहेको छ। टोलीले वार्ता कठिन देखिएकाले मूल्याङ्कन अंक कम भएको दोस्रो प्रस्तावदातासँग सीधै सम्झौता गर्ने प्रस्ताव गरेको छ।',
    objectives: ['प्रकाशित चयन विधि कायम गर्ने', 'वार्ताको अभिलेख बनाउने', 'वार्ता असफल भए कानुनी अर्को चरण पहिचान गर्ने'],
    priorKnowledge: ['परामर्श सेवाको तकनीकी/वित्तीय प्रस्ताव'],
    legalReferenceIds: ['act-section-37', 'rules-40-66', 'ppmo-opinion-19'],
    questions: [
      { id: 'consulting-action', title: 'वार्ताको निर्णय', criterion: 'decision', prompt: 'पहिलो-ranked प्रस्तावसँग वार्ता नटुंगिएमा के गर्ने?', explanation: 'मूल्याङ्कन र प्रकाशित विधिअनुसार वार्ता निष्कर्ष अभिलेख गरी अर्को कदम हाल लागू कानून तथा solicitation ले अनुमति दिएअनुसार मात्र चाल्नुहोस्।', options: [['document-and-follow', 'पहिलो-rankedसँग वार्ताको विषय/निष्कर्ष अभिलेख गर्ने र असफल भए लागू ऐन, नियम तथा प्रकाशित विधिले तोकेको क्रम पालना गर्ने।', 100], ['skip-to-second', 'वार्ता कठिन भएको भन्दै अंक नहेरी दोस्रो प्रस्तावदातासँग तुरुन्त सम्झौता गर्ने।', 0], ['renegotiate-score', 'दोस्रो प्रस्तावदाताको अंक वार्तापछि बढाउने।', 0]] },
      { id: 'consulting-law', title: 'कानुनी आधार', criterion: 'legal-basis', prompt: 'कुन स्रोतलाई आधार बनाउने?', explanation: 'हालको दफा/नियम र प्रकाशित RFP लागू हुन्छन्; PPMO राय १९ पुरानो विगतको सन्दर्भ हो।', options: [['act-rfp-first', 'ऐनको दफा ३६–३७ को लागू पाठ, नियम र प्रकाशित RFP; PPMO राय १९ लाई विगतको उदाहरणका रूपमा मात्र।', 100], ['old-opinion-only', 'पुरानो रायले आजको चयन विधि स्वतः तय गर्छ।', 0], ['committee-choice', 'समितिले आफूलाई उपयुक्त लाग्ने विधि वार्तापछि छान्न सक्छ।', 0]] },
      { id: 'consulting-record', title: 'वार्ता अभिलेख', criterion: 'process', prompt: 'वार्ताको फाइलमा के राख्ने?', explanation: 'उपस्थित प्रतिनिधि, कार्यविधि/जनशक्ति, सम्झौता दायरा, सहमत/असहमत बुँदा र अधिकारको रेकर्ड राख्नुहोस्।', options: [['negotiation-minutes', 'वार्ता माइन्युट, सहभागी/अधिकार, स्पष्ट कार्यदायरा, सहमत-असहमत बुँदा र लागू नियमअनुसारको निर्णय अभिलेख गर्ने।', 100], ['informal-call', 'फोनमा भएको सहमति मात्र।', 0], ['rewrite-rfp', 'वार्ताका क्रममा RFP का प्रतिस्पर्धी शर्त गोप्य रूपमा बदल्ने।', 0]] },
      { id: 'consulting-reasoning', title: 'निष्पक्षता', criterion: 'reasoning', prompt: 'कुन सिद्धान्तले निष्पक्ष चयन जोगाउँछ?', explanation: 'प्रकाशित मेरिट क्रम, दायरा र वार्ताको कानुनी दायरा पालना गर्नुपर्छ; मनमौजी रूपमा प्रस्तावदाता बदल्न पाइँदैन।', options: [['respect-ranking', 'प्रकाशित मूल्याङ्कन क्रम र वार्ता-सीमा कायम राखी हरेक निर्णय प्रमाण र लागू नियमसँग जोड्ने।', 100], ['preference', 'वार्ता मन नपरेको कारण दोस्रो-rankedलाई प्राथमिकता दिने।', 0], ['change-criteria', 'वार्तामा सहभागीअनुसार चयन मापदण्ड बदल्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'site-not-ready-contract-delay',
    title: 'साइट उपलब्ध नभएको करार ढिलाइ',
    category: 'करार कार्यान्वयन',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'निर्माण सम्झौतामा हस्ताक्षर भएको छ, तर साइटको केही भाग स्थानीय विवादका कारण ठेकेदारलाई उपलब्ध गराइएको छैन। ठेकेदारले म्याद थप मागेको छ; फाइलमा साइट हस्तान्तरण र critical path को विवरण अधुरो छ।',
    objectives: ['साइट उपलब्धताको तथ्य जाँच्ने', 'ढिलाइको कारण/असर अलग गर्ने', 'म्याद, क्षतिपूर्ति र सम्झौताको शर्त यकिन गर्ने'],
    priorKnowledge: ['सम्झौता व्यवस्थापन र समयतालिका'],
    legalReferenceIds: ['act-section-53-55', 'rules-6-10', 'ppmo-opinion-11'],
    questions: [
      { id: 'site-delay-action', title: 'म्यादसम्बन्धी निर्णय', criterion: 'decision', prompt: 'म्याद थप मागमा के गर्नु उचित हुन्छ?', explanation: 'साइट नदिएको तथ्य, ठेकेदारको सूचना, कामको महत्वपूर्ण समयरेखा र सम्झौताले तोकेको उपचार अलग-अलग जाँच्नुहोस्।', options: [['causation-review', 'साइट उपलब्धताको मिति, अवरोध, समयमै सूचना र critical path असर प्रमाणित गरी सम्झौताअनुसार कारणयुक्त निर्णय गर्ने।', 100], ['automatic-extension', 'साइटसम्बन्धी कुनै प्रमाण नहेरी पूरै माग स्वीकृत गर्ने।', 0], ['automatic-penalty', 'सबै ढिलाइ ठेकेदारकै कारण मानी क्षतिपूर्ति काट्ने।', 0]] },
      { id: 'site-delay-law', title: 'सन्दर्भ', criterion: 'legal-basis', prompt: 'PPMO राय ११ को पाठ के हो?', explanation: 'राय ११ साइट उपलब्धताको विगतको सन्दर्भ हो; वर्तमान सम्झौता र लागू नियमले अन्तिम नतिजा निर्धारण गर्छन्।', options: [['historical-plus-contract', 'साइट/पूर्वतयारीसम्बन्धी लागू व्यवस्था, सम्झौताको सम्बन्धित खण्ड र PPMO राय ११ को विगतको सन्दर्भसँग तथ्य मिलाउने।', 100], ['opinion-guarantees', 'राय ११ ले सबै ठेकेदारलाई स्वतः म्याद थप सुनिश्चित गर्छ।', 0], ['no-contract', 'सम्झौता अवधि र सूचनाको शर्त नहेर्ने।', 0]] },
      { id: 'site-delay-record', title: 'प्रमाण सङ्कलन', criterion: 'process', prompt: 'निर्णय अघि कुन कागजात लिने?', explanation: 'साइट हस्तान्तरण, अवरोध, सूचना, कार्यतालिका र प्राविधिक असरको मिति सहित अभिलेख आवश्यक हुन्छ।', options: [['timeline-evidence', 'साइट हस्तान्तरण/बाधा लग, पक्षहरूको पत्राचार, कार्यतालिका/critical path र प्राविधिक प्रतिवेदन संकलन गर्ने।', 100], ['verbal-claim', 'ठेकेदारको मौखिक दाबी मात्र।', 0], ['backdate-handover', 'पछिल्लो मितिमा पुरानो साइट हस्तान्तरण प्रमाणपत्र बनाउने।', 0]] },
      { id: 'site-delay-reasoning', title: 'कारण मूल्याङ्कन', criterion: 'reasoning', prompt: 'ढिलाइ कसरी जिम्मेवारीसँग जोड्ने?', explanation: 'साइट उपलब्धता र अन्य पक्षको ढिलाइले कामको महत्वपूर्ण क्रमलाई वास्तवमै प्रभावित गर्‍यो कि गरेन भन्ने causation जाँच्नुहोस्।', options: [['causal-impact', 'हरेक अवरोधको जिम्मेवार पक्ष, अवधि र critical path मा असर प्रमाणित गरी सम्झौताको म्याद/क्षतिपूर्ति धारासँग मिलाउने।', 100], ['full-extension', 'कुनै असर नदेखिए पनि सबै मागिएको समय थप्ने।', 0], ['contractor-always', 'साइट निकायले नदिए पनि सबै ढिलाइ ठेकेदारकै जिम्मा लगाउने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'price-adjustment-contract-clause',
    title: 'मूल्य समायोजन दाबी र करार',
    category: 'करार कार्यान्वयन',
    difficulty: 'उन्नत',
    estimatedMinutes: 12,
    scenario: 'निर्माण कार्यमा बजार मूल्य बढेको भन्दै ठेकेदारले मूल्य समायोजन मागेको छ। सम्झौतामा मूल्य समायोजन खण्ड छ, तर मागसँग जोडिएका सूचकाङ्क, आधार मिति र गणना परीक्षण गरिएको छैन।',
    objectives: ['सम्झौताको मूल्य समायोजन सूत्र पढ्ने', 'सूचकाङ्क र अवधिको प्रमाण जाँच्ने', 'स्वीकृति अधिकार र गणना अभिलेख गर्ने'],
    priorKnowledge: ['मूल्य समायोजन र निर्माण करार'],
    legalReferenceIds: ['act-section-53-55', 'rules-110-119'],
    questions: [
      { id: 'adjustment-action', title: 'दाबीको परीक्षण', criterion: 'decision', prompt: 'दाबी आएपछि के गर्ने?', explanation: 'मूल्य वृद्धि मात्रले भुक्तानी स्वचालित हुँदैन; हस्ताक्षरित करारको सूत्र र पात्र अवधि लागू हुन्छ।', options: [['check-contract-formula', 'करारको मूल्य समायोजन खण्ड, पात्र काम/अवधि र सूत्रअनुसार प्रमाणित गणना परीक्षण गरी अधिकारप्राप्त तहमा पेश गर्ने।', 100], ['pay-market-change', 'बजार मूल्य बढेको प्रमाणमा मात्र माग जति पनि भुक्तानी गर्ने।', 0], ['deny-always', 'सार्वजनिक करारमा मूल्य समायोजन कहिल्यै हुन सक्दैन भनी अस्वीकार गर्ने।', 0]] },
      { id: 'adjustment-law', title: 'कानुनी आधार', criterion: 'legal-basis', prompt: 'कुन व्यवस्था निर्णायक हुन्छ?', explanation: 'ऐनको लागू व्यवस्था र सम्झौताको विशिष्ट खण्डलाई साथमा पढ्नुहोस्; कुनै पुरानो सूत्र/दर स्वतः नअपनाउनुहोस्।', options: [['law-and-contract', 'ऐनको दफा ५३–५५, लागू नियम र हस्ताक्षरित करारमा समावेश सूत्र/शर्तको एकीकृत परीक्षण।', 100], ['historic-rate', 'पुरानो राय वा अघिल्लो करारको दरलाई यस करारमा स्वतः राख्ने।', 0], ['verbal-approval', 'इन्जिनियरको मौखिक स्वीकृतिलाई करार संशोधन मान्ने।', 0]] },
      { id: 'adjustment-record', title: 'गणना अभिलेख', criterion: 'process', prompt: 'कुन प्रमाण जाँच्ने?', explanation: 'आधार अवधि, सूचकाङ्कको आधिकारिकता, लागू कामको मात्रा र गणना worksheet फाइलमा राख्नुहोस्।', options: [['index-workpaper', 'स्रोत/आधार मिति भएको आधिकारिक सूचकाङ्क, पात्र कामको मापन, गणना worksheet र समीक्षा/स्वीकृतिको अभिलेख।', 100], ['supplier-spreadsheet', 'ठेकेदारको spreadsheet बिना स्रोत जाँच स्वीकार्ने।', 0], ['apply-all-items', 'सम्झौतामा नपरेका सबै खरिद/मदमा समायोजन विस्तार गर्ने।', 0]] },
      { id: 'adjustment-reasoning', title: 'जोखिम', criterion: 'reasoning', prompt: 'गणनामा कुन नियन्त्रण आवश्यक छ?', explanation: 'समायोजनको अवधि, सूत्र र पात्र लागत मदको सुसंगत प्रयोगले अतिरिक्त/दोहोरो भुक्तानीको जोखिम घटाउँछ।', options: [['consistent-formula', 'समान करार शर्त र पात्र अवधिमा मात्र सूत्र लागू गरी दोहोरो गणना/असम्बन्धित मद हटाउने।', 100], ['choose-index', 'दाबीको रकम बढी बनाउन मिल्ने सूचकाङ्क छानेर पछि लागू गर्ने।', 0], ['ignore-base-date', 'आधार मिति नहेरी वर्तमान सूचकाङ्कबाट सम्पूर्ण रकम निकाल्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'variation-approval-and-scope',
    title: 'भेरिएसन आदेश र अधिकार सीमा',
    category: 'करार कार्यान्वयन',
    difficulty: 'उन्नत',
    estimatedMinutes: 13,
    scenario: 'निर्माण अवधिमा भूमिगत सेवा लाइन भेटिएपछि प्राविधिकले अतिरिक्त काम प्रस्ताव गरेका छन्। लागत र समय असर तयार छ, तर काम सुरु गर्ने मौखिक निर्देशन दिइसकिएको छ र अधिकारप्राप्त अधिकारीको पूर्वनिर्णय छैन।',
    objectives: ['भेरिएसनको कारण/दायरा प्रमाणित गर्ने', 'अधिकार र बजेट स्वीकृति पहिचान गर्ने', 'काम र निर्णयको समयक्रम अभिलेख गर्ने'],
    priorKnowledge: ['करार संशोधन र भेरिएसन'],
    legalReferenceIds: ['act-section-53-55', 'rules-110-119'],
    questions: [
      { id: 'variation-action', title: 'काम अघि बढाउने निर्णय', criterion: 'decision', prompt: 'कुन कदम आवश्यक छ?', explanation: 'अत्यावश्यक अवस्थाका लागू अपवाद बाहेक, कामको दायरा, लागत, बजेट र अधिकारस्वीकृति प्रमाणित नगरी मौखिक निर्देशनलाई नियमित भेरिएसन मान्न सकिँदैन।', options: [['formal-review', 'सम्झौता र हालको कानूनअनुसार कारण, दायरा, मात्रा, लागत/समय असर र स्वीकृति अधिकार जाँचेर औपचारिक निर्णय गर्ने।', 100], ['ratify-any', 'काम सुरु भइसकेकाले कुनै समीक्षा नगरी सबै लागत पश्चात् स्वीकृत गर्ने।', 0], ['reject-any', 'सम्झौतामा रहेको भए पनि सबै भेरिएसन सधैं निषेध गर्ने।', 0]] },
      { id: 'variation-law', title: 'व्यवस्था', criterion: 'legal-basis', prompt: 'कुन कानुनी पाठ प्रयोग गर्ने?', explanation: 'दफा ५४/नियम ११८ सम्बन्धी स्थानीय सन्दर्भ संशोधन र अधिकार सीमासहित आधिकारिक स्रोतबाट पुष्टि गर्नुपर्छ।', options: [['current-variation-law', 'ऐनको दफा ५३–५५, लागू नियम तथा सम्झौताको भेरिएसन खण्डको हालको पाठ र अधिकार सीमा पुष्टि गर्ने।', 100], ['old-limit', 'पुरानो संशोधन अघिको सीमा वा मौखिक अभ्यासलाई आधार मान्ने।', 0], ['plan-only', 'वार्षिक खरिद योजनालाई मात्र भेरिएसन स्वीकृतिको आधार बनाउने।', 0]] },
      { id: 'variation-process', title: 'अभिलेख', criterion: 'process', prompt: 'कुन कागजात निर्णय फाइलमा राख्ने?', explanation: 'भूमिगत लाइनको प्रमाण, डिजाइन/प्राविधिक प्रतिवेदन, मात्रा/दर, बजेट, समय असर र अनुमोदनको समयक्रम राख्नुहोस्।', options: [['variation-file', 'प्राविधिक प्रतिवेदन, डिजाइन परिमार्जन, साइट प्रमाण, दर विश्लेषण, बजेट उपलब्धता र अधिकारप्राप्त अधिकारीको औपचारिक स्वीकृतिसहितको फाइल तयार गर्ने।', 100], ['oral-instruction', 'मौखिक निर्देशन मात्र।', 0], ['after-the-fact-only', 'काम सकिएपछि मिति पछाडि राखेर स्वीकृति बनाउने।', 0]] },
      { id: 'variation-reasoning', title: 'नियन्त्रण', criterion: 'reasoning', prompt: 'कुन नियन्त्रणले अनावश्यक scope विस्तार घटाउँछ?', explanation: 'मूल उद्देश्यसँग सम्बन्ध, कारण र आवश्यक मात्रा परीक्षण गरी लागू कानूनले तोकेको सीमा/अधिकारमै निर्णय गर्नुहोस्।', options: [['necessity-authority', 'कामको आवश्यकता र मूल उद्देश्यसँग सम्बन्ध प्रमाणित गरी लागू सीमा, बजेट र अधिकारीको स्वीकृति जाँच्ने।', 100], ['unlimited-scope', 'उही ठेक्का भएकाले जुनसुकै थप काम स्वीकार्ने।', 0], ['hide-variation', 'भेरिएसनलाई BOQ मा नदेखाई नियमित काममा मिसाउने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'review-request-and-procurement-hold',
    title: 'पुनरावलोकन निवेदन र खरिदको चरण',
    category: 'पुनरावलोकन तथा गुनासो',
    difficulty: 'उन्नत',
    estimatedMinutes: 13,
    scenario: 'आशयको सूचना पाएपछि एक बोलपत्रदाताले मूल्याङ्कन प्रतिवेदनमा त्रुटि भएको भन्दै निवेदन दिएको छ। खरिद इकाइले करारमा हस्ताक्षरको तयारी गरिरहेको छ, तर निवेदनको विषय र लागू समयसीमा जाँचिएको छैन।',
    objectives: ['निवेदनको प्रकार र चरण छुट्याउने', 'लागू म्याद/स्थगन आधिकारिक रूपमा जाँच्ने', 'अभिलेख र तटस्थ जवाफ तयार गर्ने'],
    priorKnowledge: ['पुनरावलोकन संयन्त्र र आशय सूचना'],
    legalReferenceIds: ['act-section-47-51', 'pprc-decision-6'],
    questions: [
      { id: 'review-action', title: 'निवेदन पाएपछि', criterion: 'decision', prompt: 'करार हस्ताक्षर अघि कुन निर्णय लिने?', explanation: 'निवेदनको तह, विषय र लागू कानुनी रोक/म्याद जाँचेर मात्र खरिदको अर्को चरण चाल्नुहोस्।', options: [['verify-stage-and-hold', 'निवेदनको विषय, क्षेत्राधिकार, हाल लागू कानूनी रोक/म्याद र सम्बन्धित प्रमाण जाँच्ने; प्रक्रिया रोक्नुपर्ने भए रोक्ने।', 100], ['sign-immediately', 'निवेदन आएको भए पनि कारण नजाँची करारमा हस्ताक्षर गर्ने।', 0], ['reject-verbally', 'निवेदन दर्ता नगरी मौखिक रूपमा अस्वीकार गर्ने।', 0]] },
      { id: 'review-law', title: 'कानुनी सन्दर्भ', criterion: 'legal-basis', prompt: 'कुन व्यवस्था प्रयोग गर्ने?', explanation: 'दफा ४७–५१ को अहिलेको एकीकृत पाठ तथा आवश्यक आधिकारिक प्रक्रिया जाँच्नुहोस्; विगतको निर्णयले वर्तमान समयसीमा बताउँदैन।', options: [['current-review-provisions', 'ऐनको दफा ४७–५१ को हाल लागू पाठ र सम्बन्धित नियम/सूचना; PPRC निर्णय ६ विगतको सन्दर्भ मात्र।', 100], ['old-deadline', 'पुरानो निर्णयबाट अहिलेको म्याद अनुमान गर्ने।', 0], ['office-preference', 'कार्यालयले आफूलाई मनपर्ने निवेदन प्रक्रिया रोज्ने।', 0]] },
      { id: 'review-process', title: 'प्रक्रिया', criterion: 'process', prompt: 'कुन फाइल तयार राख्ने?', explanation: 'निवेदन, खरिदका सबै सम्बन्धित निर्णय/सूचना, मूल्याङ्कन प्रमाण र समयमा गरिएको कार्यको रेकर्ड सुरक्षित राख्नुहोस्।', options: [['complete-review-record', 'निवेदन/उजुरी दर्ता, खरिद कागजात, मूल्याङ्कन फाइल, निर्णयहरूको समयक्रम, प्रमाण र जवाफसहितको पूर्ण मिसिल तयार गर्ने।', 100], ['selected-pages', 'अनुकूल कागजातका सीमित पाना मात्र राख्ने।', 0], ['alter-report', 'निवेदन आएपछि मूल मूल्याङ्कन प्रतिवेदनलाई overwrite गर्ने।', 0]] },
      { id: 'review-reasoning', title: 'निष्पक्षता', criterion: 'reasoning', prompt: 'जवाफ तयार गर्दा के सिद्धान्त अपनाउने?', explanation: 'प्रत्येक आपत्ति रेकर्डसँग जवाफ दिई समान प्रक्रिया लागू गर्नुपर्छ; निवेदकलाई पुरस्कृत वा दण्डित गर्ने होइन।', options: [['point-by-point', 'आपत्तिहरूलाई सम्बन्धित प्रमाण र कानुनी आधारसँग बुँदागत रूपमा सम्बोधन गरी समान प्रक्रिया कायम गर्ने।', 100], ['retaliate', 'निवेदन दिएको कारणले प्रस्तावदातालाई अर्को खरिदमा अयोग्य पार्ने।', 0], ['ignore-claim', 'निवेदनको तथ्यगत दाबी परीक्षण नगर्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'bid-security-validity',
    title: 'बोलपत्र जमानत र वैधता',
    category: 'बोलपत्र परीक्षण',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'एक बोलपत्रदाताको जमानत म्याद माग गरिएको भन्दा दुई हप्ता कम भई शर्तसँग फरक देखिन्छ। मूल्याङ्कन टोलीले सबै जमानतमा एउटै पुरानो म्याद लाद्ने वा प्रकाशित बोलपत्र शर्तअनुसार समान रूपमा परीक्षण गरी कानुनसम्मत निर्णय गर्ने भन्ने विषयमा छलफल भइरहेको छ।',
    objectives: ['प्रकाशित जमानत शर्तसँग तुलना गर्ने', 'जारीकर्ता र रकम/अवधि प्रमाणित गर्ने', 'पुरानो निश्चित अवधिलाई नक्कल नगर्ने'],
    priorKnowledge: ['बोलपत्र जमानत र वैधता'],
    legalReferenceIds: ['rules-40-66', 'ppmo-opinion-193'],
    questions: [
      { id: 'security-action', title: 'जमानत परीक्षण', criterion: 'decision', prompt: 'समितिले जमानतबारे के गर्नुपर्छ?', explanation: 'जमानत रकम, स्वरूप, जारीकर्ता र अवधि प्रकाशित शर्त तथा लागू नियमसँग तुलना गरी नतिजा निकाल्नुहोस्।', options: [['compare-tender-terms', 'प्रत्येक जमानतको रकम, स्वरूप, जारीकर्ता र म्यादलाई कागजात र हालको नियमसँग मिलाएर परीक्षण गर्ने।', 100], ['same-old-period', 'हरेक खरिदमा पुरानो ठ्याक्कै अवधि अनिवार्य मान्ने।', 0], ['ignore-expiry', 'रकम मिलेपछि म्याद नहेर्ने।', 0]] },
      { id: 'security-law', title: 'विगतको सन्दर्भ', criterion: 'legal-basis', prompt: 'PPMO राय १९३ को भूमिका कुन हो?', explanation: 'राय १९३ पुरानो जमानत/म्याद सन्दर्भ हो; यसमा दिइएको कुनै अवधिलाई वर्तमान नियमको विकल्प नबनाउनुहोस्।', options: [['verify-current-security', 'लागू नियम र बोलपत्रको हालको शर्तलाई प्राथमिकता दिई राय १९३ लाई विगतको जाँच-सूत्र मान्ने।', 100], ['copy-validity', 'राय १९३ को अवधिलाई स्वतः सबै जमानतमा लागू गर्ने।', 0], ['bank-preference', 'बैंक परिचित भएकाले शर्त नमिले पनि स्वीकार गर्ने।', 0]] },
      { id: 'security-process', title: 'प्रमाणीकरण', criterion: 'process', prompt: 'जमानतको वास्तविकता कसरी जाँच्ने?', explanation: 'सम्बन्धित बैंक वा आधिकारिक माध्यमबाट जारीकर्ता, रकम, लाभग्राही र म्याद पुष्टि गरी प्रमाण सुरक्षित गर्नुहोस्।', options: [['bank-verification', 'बैंक/जारीकर्ता निकायको आधिकारिक पुष्टि, जमानतको सर्त र म्यादसहित मूल्याङ्कन फाइलमा प्रमाण राख्ने।', 100], ['scan-only', 'स्क्यान प्रतिमा देखिएकै आधारमा प्रमाणीकरण नगर्ने।', 0], ['bidder-phone', 'प्रस्तावदाताको फोनमा दिएको आश्वासनलाई बैंक पुष्टि मान्ने।', 0]] },
      { id: 'security-reasoning', title: 'जोखिम', criterion: 'reasoning', prompt: 'कुन निष्कर्ष उचित छ?', explanation: 'प्रकाशित बोलपत्र शर्तअनुसार जमानतको म्याद र रकम पूर्ण हुनुपर्छ; असमान छुट दिँदा अन्य प्रस्तावदातामाथि अन्याय हुन्छ र कानुनी जोखिम निम्तिन्छ।', options: [['equal-rule', 'प्रत्येक जमानतमा एउटै प्रकाशित शर्त लागू गरी, कमीलाई स्पष्टीकरण/सुधारबाट सम्बोधन गर्न मिल्छ कि भन्ने कानुनी सीमा पुष्टि गर्ने।', 100], ['waive-favorite', 'अनुकूल प्रस्तावदाताको म्याद कमी माफ गर्ने।', 0], ['invent-cure', 'खोलिसकेपछि सबैको जमानत म्याद थप्ने नयाँ सुविधा सिर्जना गर्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'prequalification-following-competition',
    title: 'पूर्वयोग्यतापछि प्रतिस्पर्धी चरण',
    category: 'खरिद विधि',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'ठूलो निर्माणको पूर्वयोग्यतामा तीन कम्पनी छनोट भएका छन्। एकाइले shortlist लाई नै अन्तिम स्वीकृतिको सूची मानेर खुला प्रतिस्पर्धी बोलपत्र चरण नगरी सम्झौता वार्ता गर्न खोजेको छ।',
    objectives: ['पूर्वयोग्यता र अन्तिम बोलपत्र चरण छुट्याउने', 'स्वीकृत कागजातअनुसार प्रतिस्पर्धा अघि बढाउने', 'सबै short-listed पक्षलाई समान सूचना दिने'],
    priorKnowledge: ['पूर्वयोग्यता र बोलपत्र आह्वान'],
    legalReferenceIds: ['act-section-8', 'rules-28-35', 'ppmo-opinion-186'],
    questions: [
      { id: 'prequal-action', title: 'अर्को चरण', criterion: 'decision', prompt: 'पूर्वयोग्यता सफल भएपछि के गर्नु उचित हुन्छ?', explanation: 'पूर्वयोग्यताबाट योग्य ठहरिएका सूचीकृत सबै प्रस्तावदातालाई दोस्रो चरणको बोलपत्र पेश गर्न समान अवसर दिनुपर्छ।', options: [['issue-next-stage', 'छनोट भएका सबैलाई प्रकाशित प्रतिस्पर्धी चरणको निमन्त्रणा दिई, सोही कागजात/तालिकाअनुसार बोलपत्र माग्ने।', 100], ['negotiate-direct', 'छनोट भएका कम्पनीमध्ये एउटासँग सीधै मूल्य वार्ता गर्ने।', 0], ['award-shortlist', 'पूर्वयोग्यता सफल हुनु नै करार स्वीकृति हो भनी सम्झौता गर्ने।', 0]] },
      { id: 'prequal-law', title: 'नजिरको पाठ', criterion: 'legal-basis', prompt: 'PPMO राय १८६ बाट के सिक्ने?', explanation: 'राय १८६ विगतको पूर्वयोग्यता सन्दर्भ हो; हाल लागू चरण/प्रक्रिया ऐन, नियम र कागजातबाट पुष्टि गर्नुहोस्।', options: [['qualification-not-award', 'पूर्वयोग्यता र अन्तिम प्रतिस्पर्धा छुट्याउने; राय १८६ लाई विगतको सन्दर्भ र लागू नियमलाई बाध्यकारी आधार मान्ने।', 100], ['historic-procedure', 'राय १८६ को पुरानो प्रक्रिया जस्ताको तस्तै वर्तमानमा अनिवार्य मान्ने।', 0], ['no-next-stage', 'Shortlist पछि कुनै प्रतिस्पर्धा आवश्यक छैन।', 0]] },
      { id: 'prequal-process', title: 'सूचना/अभिलेख', criterion: 'process', prompt: 'सबै short-listed कम्पनीलाई कसरी व्यवहार गर्ने?', explanation: 'एकै समयमा एउटै कागजात, संशोधन/स्पष्टीकरण र दाखिला सुविधा दिनुहोस् तथा वितरणको प्रमाण राख्नुहोस्।', options: [['equal-invitation', 'स्वीकृत कागजात/सूचना एउटै समयमा सबै योग्य shortlist लाई पठाई, संशोधन/प्रश्नोत्तर समान रूपमा उपलब्ध गराउने।', 100], ['selective-invite', 'पसन्द गरिएको एउटालाई मात्र निमन्त्रणा पठाउने।', 0], ['private-changes', 'हरेक कम्पनीसँग फरक गोप्य शर्त तय गर्ने।', 0]] },
      { id: 'prequal-risk', title: 'प्रतिस्पर्धा', criterion: 'reasoning', prompt: 'यो प्रक्रियाले कुन जोखिम नियन्त्रण गर्छ?', explanation: 'अन्तिम प्रतिस्पर्धी अवसर सबै योग्य short-listed पक्षलाई उपलब्ध गराउँदा खुलापन र समान व्यवहार कायम हुन्छ।', options: [['preserve-competition', 'पूर्वयोग्यताको नतिजा मात्रले ठेक्का तय नगरी प्रकाशित दोस्रो चरणमा प्रतिस्पर्धा कायम राख्ने।', 100], ['restrict-bids', 'एक shortlist सदस्यलाई मात्र अन्तिम प्रस्ताव दिन दिने।', 0], ['redefine-shortlist', 'अनुमति बिना चरणबीच shortlist थपघट गर्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'false-document-authentication',
    title: 'शङ्कास्पद कर/अनुभव कागजात प्रमाणीकरण',
    category: 'योग्यता मूल्याङ्कन',
    difficulty: 'उन्नत',
    estimatedMinutes: 13,
    targetAudience: 'सार्वजनिक निकाय',
    scenario: 'प्रतिस्पर्धीले एउटा बोलपत्रदाताको कर र अनुभव प्रमाणपत्र शङ्कास्पद भएको उजुरी गरेको छ। मूल्याङ्कन समितिको आफ्नै समीक्षा गर्दा जारीकर्ता कार्यालयको वेबसाइटमा विवरण तुरुन्त भेटिएन, तर आधिकारिक जवाफ आएको छैन।',
    objectives: ['आरोप र प्रमाण छुट्याउने', 'आधिकारिक प्रमाणीकरण गर्ने', 'प्रक्रियागत निष्पक्षता र आवश्यक कारबाही कायम गर्ने'],
    priorKnowledge: ['योग्यता प्रमाणपत्र र due process'],
    legalReferenceIds: ['act-section-23', 'act-section-59-63', 'ppmo-opinion-15'],
    mockDocuments: [
      {
        id: 'doc-suspicious-tax',
        title: 'शङ्कास्पद भनी दाबी गरिएको कर चुक्ता प्रमाणपत्र',
        documentType: 'tax-clearance',
        issuer: 'आन्तरिक राजस्व कार्यालय, क्षेत्र नं. २, ललितपुर',
        date: '२०८१/०१/२४',
        referenceNo: 'आ.रा.का./कर/०८०-८१/९८१२',
        content: `करदाताको नाम: श्री एपेक्स इन्जिनियरिङ एण्ड सप्लायर्स प्रा.लि.
स्थायी लेखा नम्बर (PAN): ३०२४५६७८९
आर्थिक वर्ष: २०७९/०८०

यस कार्यालयमा दर्ता रहेको उक्त करदाताले आर्थिक वर्ष २०७९/०८० को आयविवरण तथा सोबापत लाग्ने कर दाखिला गरी कर चुक्ता गरेको प्रमाणित गरिन्छ।

[प्रमाणीकरण नोट: प्रतिस्पर्धी फर्मद्वारा पेश भएको उजुरी पत्रसाथ संलग्न]
[समितिको प्रारम्भिक कैफियत: प्रणालीमा खोजी गर्दा विवरण नदेखिएकाले सम्बन्धित कार्यालयमा पत्र पठाई आधिकारिक जवाफ पर्खिनुपर्ने]`,
        notes: [
          'PPMO राय नं. १५ अनुसार झुट्टा वा शङ्कास्पद कागजातको विवादमा अनुमान वा शङ्काको भरमा मात्र बोलपत्र रद्द नगरी जारी गर्ने आधिकारिक निकायबाट औपचारिक पुष्टि लिनुपर्दछ।',
        ],
      },
    ],
    questions: [
      { id: 'fraud-action', title: 'आरोपपछि', criterion: 'decision', prompt: 'समितिले कुन निर्णयको तयारी गर्ने?', explanation: 'शङ्का मात्रमा जालसाजीको अन्तिम निष्कर्ष नगरी आधिकारिक प्रमाण मागी लागू कानून/कागजातअनुसार मूल्याङ्कन गर्नुहोस्।', options: [['verify-first', 'जारीकर्ता/सम्बन्धित आधिकारिक निकायबाट लिखित पुष्टि मागी प्रमाणित तथ्यअनुसार कागजात र कानुनी परिणामको निर्णय गर्ने।', 100], ['accuse-publicly', 'वेबसाइटमा नदेखिएकै आधारमा सार्वजनिक रूपमा जालसाजी घोषणा गर्ने।', 0], ['ignore-allegation', 'उजुरी आएको कारणले प्रमाणको कुनै परीक्षण नगर्ने।', 25]] },
      { id: 'fraud-law', title: 'कानुनी सन्दर्भ', criterion: 'legal-basis', prompt: 'PPMO राय १५ को उपयुक्त पाठ?', explanation: 'राय १५ विगतको हो; वर्तमान ऐन, नियम, प्रमाण र आधिकारिक निकायको पुष्ट्याइँ प्राथमिक हुन्छन्।', options: [['official-proof', 'लिखित प्रमाण, आधिकारिक निकाय र आवश्यक पुष्ट्याइँ; राय १५ लाई मात्र विगतको अभ्यासको सन्दर्भ मान्ने।', 100], ['opinion-conclusive', 'राय १५ कै आधारमा सिधै कुनै आधिकारिक पुष्ट्याइँ नगरी कारबाही गर्न सकिने।', 0], ['no-due-process', 'आरोपको आधारमै कुनै सुनुवाइ नगरी निष्कर्ष निकाल्ने।', 0]] },
      { id: 'fraud-process', title: 'प्रमाणीकरण प्रक्रिया', criterion: 'process', prompt: 'कुन कदम फाइलमा राख्ने?', explanation: 'शङ्काको स्रोत, आधिकारिक सोधपुछ, प्राप्त जवाफ, प्रस्तावदाताको प्रतिनिधित्व/स्पष्टीकरणको लागू सीमा र समितिको निष्कर्ष सुरक्षित गर्नुहोस्।', options: [['document-verification', 'उजुरी, प्रमाणको प्रतिलिपि, आधिकारिक निकायमा सोधिएको प्रश्न/जवाफ र समान प्रक्रियामा भएको समितिको विश्लेषण राख्ने।', 100], ['competitor-only', 'उजुरीकर्ताको आरोपलाई नै प्रमाण मान्ने।', 0], ['alter-record', 'शङ्का मिलाउन मूल कागजात वा पत्राचार परिवर्तन गर्ने।', 0]] },
      { id: 'fraud-reasoning', title: 'निष्पक्षता', criterion: 'reasoning', prompt: 'प्रमाणित अनियमितता भएमा के फरक पार्छ?', explanation: 'प्रमाणित अवस्था र शङ्कालाई फरक व्यवहार गर्नुहोस्; अयोग्यता, सिफारिस वा कालोसूचीको प्रक्रिया अधिकार र सुनुवाइसहित लागू कानूनबाट निर्धारण हुन्छ।', options: [['proportionate-lawful-action', 'पहिले तथ्य पुष्टि गर्ने; प्रमाणित भए लागू बोलपत्र शर्त र वैधानिक प्रक्रिया/अधिकारअनुसार मात्र कारबाही गर्ने।', 100], ['automatic-blacklist', 'शङ्का आएको मात्रले स्वतः कालोसूचीमा राख्ने।', 0], ['ignore-confirmed-fraud', 'प्रमाणित झुट्टा कागजात पनि मूल्याङ्कनमा कुनै असर नपर्ने मान्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'ration-supply-license-and-estimate',
    title: 'रासन खरिदको व्यवसायिक इजाजत',
    category: 'वस्तु खरिद',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'निकायले रासन आपूर्ति बोलपत्रमा एक प्रस्तावलाई कम मूल्यका कारण छनोट गर्न लागेको छ। पेश गरिएको व्यवसाय दर्ता/इजाजतपत्रबाट रासन आपूर्ति गर्न मिल्ने कुरा स्पष्ट छैन; लागत अनुमानको स्वीकृति पनि फाइलमा भेटिएन।',
    objectives: ['सम्बन्धित व्यवसायिक इजाजत जाँच्ने', 'लागत अनुमान स्वीकृति प्रमाणित गर्ने', 'कम मूल्यभन्दा बाहिर योग्यता/प्रक्रिया परीक्षण गर्ने'],
    priorKnowledge: ['रासन खरिद र व्यवसायिक योग्यता'],
    legalReferenceIds: ['rules-6-10', 'rules-88', 'pprc-decision-38'],
    questions: [
      { id: 'ration-action', title: 'स्वीकृति अघि', criterion: 'decision', prompt: 'निकायले कुन परीक्षण पूरा गर्नुपर्छ?', explanation: 'लागत अनुमान र रासन आपूर्तिका लागू योग्यता/इजाजत दुवै प्रमाणित गरी प्रकाशित मापदण्डमा आधारित निर्णय गर्नुहोस्।', options: [['license-and-estimate', 'सम्बन्धित आपूर्ति इजाजत/योग्यता र स्वीकृत लागत अनुमान जाँचेर बोलपत्र कागजात तथा लागू नियमअनुसार निर्णय गर्ने।', 100], ['lowest-price', 'कम मूल्य भएकाले इजाजत र लागत अनुमान नहेरी स्वीकृत गर्ने।', 0], ['invent-license', 'खोलिसकेपछि नयाँ इजाजत शर्त थप्ने।', 0]] },
      { id: 'ration-law', title: 'नजिर', criterion: 'legal-basis', prompt: 'PPRC निर्णय ३८ ले के देखाउँछ?', explanation: 'निर्णय ३८ स्थानीय रासन खरिदको विगतको तथ्य हो; नियम ८८ र हाल लागू संशोधन/कागजात पुष्टि गर्नुहोस्।', options: [['rule-and-context', 'नियम ८८ को वर्तमान पाठ र बोलपत्र शर्त लागू गरी PPRC निर्णय ३८ लाई विगतको उदाहरण मान्ने।', 100], ['all-license-case', 'निर्णय ३८ लाई कुनै पनि वस्तु खरिदको समान इजाजत नियम मान्ने।', 0], ['decision-replaces-rule', 'पुरानो निर्णयले नियमावलीको हालको पाठ हटाउँछ।', 0]] },
      { id: 'ration-record', title: 'प्रमाण', criterion: 'process', prompt: 'कुन कागजात फाइलमा राख्ने?', explanation: 'इजाजत जारीकर्ता/दायरा, स्वीकृत अनुमान र योग्यता परीक्षण प्रतिवेदन प्रमाणित हुनुपर्छ।', options: [['license-scope-record', 'इजाजतको जारीकर्ता/वैधता/व्यवसाय दायरा, लागत अनुमान स्वीकृति र प्रकाशित योग्यता परीक्षणको प्रतिवेदन।', 100], ['company-name', 'कम्पनीको नाम आपूर्ति जस्तो सुनिएकाले पर्याप्त मान्ने।', 0], ['missing-estimate', 'लागत अनुमान नभए पनि पछि तयार गर्ने योजना मात्र।', 0]] },
      { id: 'ration-reasoning', title: 'समान व्यवहार', criterion: 'reasoning', prompt: 'निष्पक्ष निष्कर्ष कुन हो?', explanation: 'कागजातमा तोकिएका योग्यता शर्त सबैमा समान लागू गरी आवश्यक प्रमाण आधिकारिक स्रोतबाट जाँच्नुहोस्।', options: [['same-eligibility-test', 'सबै बोलपत्रदाताको व्यवसायिक योग्यता एउटै प्रकाशित शर्तबाट जाँचेर प्रमाणित निष्कर्ष निकाल्ने।', 100], ['cheap-is-eligible', 'कम मूल्यले योग्यता कमी स्वतः पूरा गर्छ।', 0], ['post-bid-license', 'नयाँ योग्यता वा इजाजत खोलिसकेपछि थप्न दिने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'local-product-preference-current-law',
    title: 'स्थानीय उत्पादन प्राथमिकता जाँच',
    category: 'वस्तु खरिद',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'कार्यालयले देशभित्र उत्पादित वस्तु खरिद गर्न खोजेको छ। पुरानो PPRC निर्णयबाट एउटा प्राथमिकता प्रतिशत टिपिएको छ, तर अहिलेको नियम, वस्तुको पात्रता र दाबी प्रमाणित गर्ने कागजात जाँचिएको छैन।',
    objectives: ['वर्तमान प्राथमिकता नीति प्रमाणित गर्ने', 'पात्रता र प्रमाणलाई SBD मा स्पष्ट गर्ने', 'पुरानो प्रतिशतलाई स्वतः नअपनाउने'],
    priorKnowledge: ['वस्तु खरिद र मूल्याङ्कन मापदण्ड'],
    legalReferenceIds: ['act-section-5', 'act-section-23', 'pprc-decision-2'],
    questions: [
      { id: 'preference-action', title: 'कागजात अन्तिमकरण', criterion: 'decision', prompt: 'पुरानो प्रतिशतको दाबीलाई कसरी सम्हाल्ने?', explanation: 'हाल लागू कानुनी प्राथमिकता पुष्टि गरी पात्र वस्तु, प्रमाण, गणना र लागू हुने चरणलाई बोलपत्रमा प्रकाशनअघि स्पष्ट गर्नुहोस्।', options: [['verify-and-disclose', 'वर्तमान ऐन/नियम/निर्देशिकाको आधारमा यकिन गरी मात्र प्राथमिकता प्रतिशत र दायरा बोलपत्र कागजातमा खुलाउने; पुष्टि नभएका प्रतिशत नराख्ने।', 100], ['copy-pprc', 'PPRC निर्णय २ बाट पुरानो प्राथमिकता प्रतिशत जस्ताको तस्तै नक्कल गर्ने।', 0], ['decide-after-opening', 'बोलपत्र खोलिसकेपछि मात्र प्राथमिकता प्रतिशत तय गर्ने।', 0]] },
      { id: 'preference-law', title: 'निर्णयको दायरा', criterion: 'legal-basis', prompt: 'PPRC निर्णय २ लाई कसरी पढ्ने?', explanation: 'स्थानीय निर्णय/नमूना विगतको हो; वर्तमान प्राथमिकता सम्बन्धी व्यवस्था आधिकारिक कानून र वर्तमान कागजातबाट पुष्टि हुन्छ।', options: [['history-not-current-rule', 'PPRC निर्णय २ लाई पुरानो अभ्यासको सन्दर्भ मानी वर्तमान प्राथमिकता कानुनी पाठबाट पुनः पुष्टि गर्ने।', 100], ['same-forever', 'पुरानो निर्णयमा लेखिएको प्रतिशत सधैं लागू हुन्छ।', 0], ['no-legal-source', 'स्थानीय उत्पादन प्राथमिकता मनलाग्दी दिन सकिन्छ।', 0]] },
      { id: 'preference-process', title: 'प्रमाण परीक्षण', criterion: 'process', prompt: 'दाबी मूल्याङ्कनका लागि के चाहिन्छ?', explanation: 'पात्रता प्रमाण, जारीकर्ता र उत्पादनको मापदण्ड कागजातमा पूर्वनिर्धारित हुनुपर्छ र सबै प्रस्तावमा समान जाँचिनुपर्छ।', options: [['predefined-proof', 'कागजात/निर्देशिकामा उल्लेखित आधिकारिक निकायको प्रमाणपत्र, उत्पादकको विवरण र पुष्ट्याइँको आधार समान रूपमा जाँच्ने।', 100], ['self-declaration-only', 'कम्पनीले स्थानीय भनेको मात्र पर्याप्त ठान्ने।', 0], ['new-proof', 'खोलिसकेपछि कुनै एक प्रस्तावदाताका लागि विशेष प्रमाण थप्ने।', 0]] },
      { id: 'preference-reasoning', title: 'प्रतिस्पर्धा', criterion: 'reasoning', prompt: 'कुन निष्पक्षता नियन्त्रण आवश्यक छ?', explanation: 'प्राथमिकता दिँदा पनि प्रतिस्पर्धा र समान व्यवहार कायम हुनुपर्छ; पुरानो सीमा/प्रतिशत अनुमान गर्नुहुँदैन।', options: [['equal-current-test', 'कानूनले अनुमति दिएको पात्र वस्तुमा मात्र पूर्वप्रकाशित विधि समान रूपमा लागू गरी प्रमाण अभिलेख गर्ने।', 100], ['supplier-specific', 'स्थानीय नाम भएको एउटा कम्पनीलाई मात्र प्राथमिकता दिने।', 0], ['retroactive-formula', 'नतिजा हेरेपछि गणना सूत्र बदल्ने।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'single-responsive-bid-dilemma',
    title: 'एक मात्र बोलपत्र दर्ता र स्वीकृतिको द्विविधा',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'राष्ट्रिय स्तरको खुला बोलपत्रमा म्यादभित्र १ वटा मात्र बोलपत्र दर्ता भयो। अर्को खरिदमा ५ वटा बोलपत्र परेकामा प्राविधिक तथा योग्यता परीक्षण गर्दा ४ वटा अयोग्य भई १ वटा मात्र सारभूत रूपमा प्रभावग्राही (Substantially Responsive) ठहरियो। मूल्याङ्कन समिति र लेखा अधिकृतबीच "एउटा मात्र बोलपत्र प्रतिस्पर्धा नभएकोले स्वतः रद्द गरी पुनः बोलपत्र गर्नुपर्छ वा स्वीकृत गर्न सकिन्छ?" भन्ने विषयमा गम्भीर द्विविधा उत्पन्न भएको छ।',
    objectives: ['नियम ६३ बमोजिम एक मात्र बोलपत्रको स्वीकृति कार्यविधि बुझ्ने', 'स्वतः रद्द नगरी दर र लागत अनुमानको औचित्य परीक्षण गर्ने', 'अधिकारप्राप्त अधिकारीको निर्णय अभिलेख गर्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम ६३', 'सारभूत प्रभावकारिता र दरको उपयुक्तता'],
    legalReferenceIds: ['rules-63', 'rules-40-66', 'act-section-26'],
    questions: [
      { id: 'single-bid-action', title: 'स्वीकृति निर्णय', criterion: 'decision', prompt: 'एक मात्र बोलपत्र दर्ता वा एक मात्र सारभूत रूपमा प्रभावग्राही भएको अवस्थामा निकायले के गर्नुपर्छ?', explanation: 'नियम ६३ बमोजिम प्रकाशित शर्त पूरा गरेको र दर लागत अनुमानको सीमाभित्र उपयुक्त भए अधिकारप्राप्त अधिकारीले स्वीकृत गर्न सक्छन्; स्वतः रद्द गर्नुपर्दैन।', options: [['evaluate-as-per-rule-63', 'नियम ६३ बमोजिम बोलपत्रका प्रकाशित शर्त पूरा गरेको र दर लागत अनुमानको सीमाभित्र उपयुक्त भए अधिकारप्राप्त अधिकारीसमक्ष स्वीकृतिको लागि सिफारिस गर्ने।', 100], ['auto-cancel-immediately', 'एउटा मात्र बोलपत्र प्रतिस्पर्धा नहुने हुनाले मूल्यांकन नै नगरी तुरुन्त रद्द गरी पुनः बोलपत्र गर्ने।', 0], ['negotiate-price-first', 'प्रतिस्पर्धा नभएकाले बोलपत्रदातालाई बोलाएर दर घटाउन अनौपचारिक दबाब दिने।', 0]] },
      { id: 'single-bid-law', title: 'कानुनी आधार', criterion: 'legal-basis', prompt: 'यस निर्णयको कानुनी आधार के हो?', explanation: 'सार्वजनिक खरिद नियमावलीको नियम ६३ ले एक मात्र बोलपत्र स्वीकृत गर्ने कार्यविधि र आधार तोकेको छ।', options: [['rule-63-basis', 'सार्वजनिक खरिद नियमावलीको नियम ६३ ले एक मात्र बोलपत्र स्वीकृत गर्ने स्पष्ट कार्यविधि र आधार तोकेको छ।', 100], ['section-9-only', 'ऐनको दफा ९ ले प्रतिस्पर्धा अनिवार्य गरेकोले १ बोलपत्र कुनै पनि हालतमा स्वीकृत गर्न पाइँदैन।', 0], ['discretion-without-rule', 'कानुनमा कुनै व्यवस्था नभएकाले कार्यालय प्रमुखको तजबिजमा जे पनि गर्न सकिन्छ।', 0]] },
      { id: 'single-bid-process', title: 'प्रक्रिया र अभिलेख', criterion: 'process', prompt: 'एक मात्र बोलपत्र स्वीकृत गर्दा मूल्याङ्कन समितिले कुन प्रक्रिया र अभिलेख पूरा गर्नुपर्छ?', explanation: 'सूचनाको म्याद र माध्यम नियमसम्मत भएको, योग्यता र स्पेसिफिकेशन मिलेको, तथा कबोल दर मनासिब रहेको तथ्य प्रतिवेदनमा अभिलेख गर्नुपर्छ।', options: [['fair-rate-and-docs-check', 'प्रकाशित सूचनाको म्याद र माध्यम नियमसम्मत भएको, योग्यता र स्पेसिफिकेशन मिलेको, तथा कबोल दर हालको बजार दर र लागत अनुमानको तुलनामा मनासिब रहेको तथ्य प्रतिवेदनमा अभिलेख गर्ने।', 100], ['verbal-approval', 'मौखिक छलफलको भरमा मात्र फाइल सदर गराउने।', 0], ['hide-single-bid', 'एउटा मात्र परेको कुरा लुकाएर सामान्य प्रक्रिया जस्तै देखाउने।', 0]] },
      { id: 'single-bid-reasoning', title: 'सार्वजनिक औचित्य', criterion: 'reasoning', prompt: 'यस कार्यविधिको पछाडि निष्पक्षता र सार्वजनिक खर्चको कुन औचित्य रहन्छ?', explanation: 'नियमसम्मत खुला प्रतिस्पर्धा गर्दा पनि एउटा मात्र आउनु बजारको यथार्थ हुन सक्छ; दर मनासिब भए पुनः बोलपत्र गर्दा समय र लागत खेर जानबाट बच्छ।', options: [['efficiency-without-collusion', 'नियमसम्मत खुला सूचना गर्दा पनि एउटा मात्र आउनु वा बाँकी अयोग्य हुनु बजारको यथार्थ हुन सक्छ; दर मनासिब भए पुनः खरिद गर्दा समय र लागत खेर जानबाट बच्न सकिन्छ।', 100], ['always-re-tender', 'पुनः बोलपत्र गर्दा जुनसुकै अवस्थामा पनि सस्तो दर आउने ग्यारेन्टी हुन्छ।', 0], ['favoritism', 'एउटै फर्मलाई लाभ पुर्याउन नियमावलीले यस्तो छुट दिएको हो।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'bid-above-cost-estimate-negotiation',
    title: 'लागत अनुमानभन्दा बढी कबोल र मूल्य वार्ताको द्विविधा',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'अस्पतालको उपकरण खरिदमा न्यूनतम मूल्याङ्कित सारभूत रूपमा प्रभावग्राही बोलपत्रदाताको कबोल रकम स्वीकृत लागत अनुमानभन्दा १२% बढी आयो। व्यवस्थापन समितिले "वार्ता (Negotiation) समिति गठन गरेर बोलपत्रदातालाई बोलाई लागत अनुमानभित्र दर घटाउन लगाएर सम्झौता गरौँ" भन्ने प्रस्ताव गर्‍यो। खरिद अधिकृतले यसमा कानुनी आपत्ति जनाए।',
    objectives: ['नियम ६५(४) बमोजिम लागत अनुमानभन्दा बढी कबोल परेको अवस्था बुझ्ने', 'खुला बोलपत्रमा गैरकानुनी मूल्य वार्ता निषेध पहिचान गर्ने', 'बजेट उपलब्धता र औचित्यका आधारमा रद्द वा स्वीकृतिको निर्णय गर्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम ६५(४)', 'खुला बोलपत्रमा मूल्य वार्ताको सीमा'],
    legalReferenceIds: ['rules-65-4', 'act-section-26', 'ppmo-opinion-6'],
    questions: [
      { id: 'bid-above-action', title: 'वार्ता वा निर्णय', criterion: 'decision', prompt: 'लागत अनुमानभन्दा बढी कबोल परेको अवस्थामा कुन निर्णय कानुनसम्मत हुन्छ?', explanation: 'खुला बोलपत्रमा मूल्य वार्ता गर्न पाइँदैन; बजेट पर्याप्त भए कारण खोली अधिकारप्राप्त अधिकारीबाट स्वीकृत गर्ने वा बोलपत्र अस्वीकृत गरी पुनः खरिद गर्नुपर्छ।', options: [['rule-65-4-no-negotiation', 'खुला बोलपत्रमा मूल्य घटाउन वार्ता गर्न पाइँदैन; बजेट पर्याप्त भए कारण खोली अधिकारप्राप्त अधिकारीबाट स्वीकृत गर्ने वा बोलपत्र अस्वीकृत गरी पुनः खरिद गर्ने।', 100], ['call-for-price-negotiation', 'वार्ता समिति गठन गरी बोलपत्रदातासँग मोलतोल गरेर लागत अनुमान बराबर बनाउने।', 0], ['reduce-quantity-arbitrarily', 'बोलपत्रदाताको सहमतिबिना सामानको संख्या ३०% घटाएर स्वीकृत गर्ने।', 0]] },
      { id: 'bid-above-law', title: 'कानुनी प्रावधान', criterion: 'legal-basis', prompt: 'यस विषयमा सार्वजनिक खरिद कानुनको स्पष्ट व्यवस्था के छ?', explanation: 'नियमावलीको नियम ६५(४) ले लागत अनुमानभन्दा बढी परेको अवस्थाको कार्यविधि तोकेको छ र परामर्श सेवा बाहेक खुला बोलपत्रमा मूल्य वार्ता निषेध छ।', options: [['rule-65-4-provision', 'नियमावलीको नियम ६५(४) ले लागत अनुमानभन्दा बढी परेको अवस्थाको कार्यविधि तोकेको छ र खुला बोलपत्रमा परामर्श सेवामा बाहेक मूल्य वार्ता गर्न निषेध गर्दछ।', 100], ['unlimited-bargaining', 'सरकारी रकम बचत गर्न जुनसुकै खरिदमा पनि मोलमोलाइ गर्न ऐनले छुट दिन्छ।', 0], ['auto-void-without-record', 'लागत अनुमानभन्दा एक रुपैयाँ बढी पर्नासाथ स्वतः रद्द हुन्छ, कुनै निर्णय गर्नै पर्दैन।', 0]] },
      { id: 'bid-above-process', title: 'प्रक्रियात्मक अभिलेख', criterion: 'process', prompt: 'स्वीकृत लागत अनुमानभन्दा बढी दर स्वीकृत गर्दा वा रद्द गर्दा कुन प्रक्रिया पूरा गर्नुपर्छ?', explanation: 'बजार मूल्य वृद्धि, बजेट उपलब्धता र पुनः बोलपत्र गर्दा हुनसक्ने लागतको विश्लेषण गरी अधिकारप्राप्त अधिकारीसमक्ष सिफारिस पेश गर्नुपर्छ।', options: [['evaluate-budget-and-justification', 'मूल्याङ्कन समितिले बजार मूल्य वृद्धि, बजेट उपलब्धता र पुनः बोलपत्र गर्दा हुनसक्ने लागतको विश्लेषण गरी अधिकारप्राप्त अधिकारीसमक्ष सिफारिस पेश गर्ने।', 100], ['private-deal', 'बोलपत्रदातालाई गोप्य पत्र लेखी दर संशोधन गर्न लगाउने।', 0], ['hide-from-audit', 'लागत अनुमानको पाना फेरेर कबोल रकमसँग मिलाउने।', 0]] },
      { id: 'bid-above-reasoning', title: 'मूल्य वार्ता निषेधको औचित्य', criterion: 'reasoning', prompt: 'खुला बोलपत्रमा मूल्य वार्तालाई किन कडा रूपमा निषेध गरिएको हो?', explanation: 'प्रतिस्पर्धी प्रक्रियामा मूल्य वार्ता गर्न दिँदा मिलेमतो, अनियमितता र बोलपत्रको गोपनीयता तथा निष्पक्षता समाप्त हुन्छ।', options: [['protect-bid-integrity', 'प्रतिस्पर्धी प्रक्रियामा मूल्य वार्ता गर्न दिँदा मिलेमतो, अनियमितता र बोलपत्रको गोपनीयता तथा निष्पक्षता समाप्त हुन्छ।', 100], ['speed-up-process', 'वार्ता गर्दा धेरै समय लाग्ने हुनाले मात्र रोकिएको हो।', 0], ['favor-suppliers', 'आपूर्तिकर्तालाई बढी नाफा दिलाउन कानुनले वार्ता रोकेको हो।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'abnormally-low-bid-and-aps',
    title: 'अस्वाभाविक न्यून दर र अतिरिक्त कार्यसम्पादन जमानत (APS)',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'सिँचाइ आयोजनाको बोलपत्रमा लागत अनुमान रु. १ करोड छ। सबैभन्दा कम कबोल गर्ने निर्माण व्यवसायीले रु. ६८ लाख (लागत अनुमानभन्दा ३२% घटेर) प्रस्ताव पेश गर्‍यो। प्राविधिक समितिले "यति सस्तोमा काम हुनै सक्दैन, काम अलपत्र पर्छ, यसलाई सिधै अयोग्य घोषणा गरौँ" भन्यो।',
    objectives: ['अस्वाभाविक न्यून दरको परीक्षण र दर विश्लेषण माग गर्ने विधि बुझ्ने', 'नियम ११० बमोजिम अतिरिक्त कार्यसम्पादन जमानत (APS) को गणना र माग बुझ्ने', 'सोझै अस्वीकृत नगरी प्रक्रिया पूरा गर्ने'],
    priorKnowledge: ['अतिरिक्त कार्यसम्पादन जमानत (Additional Performance Security)', 'दर विश्लेषण र स्पष्टीकरण'],
    legalReferenceIds: ['rules-110-119', 'rules-40-66', 'pprc-decision-3'],
    questions: [
      { id: 'low-bid-action', title: 'न्यून दर सम्बोधन', criterion: 'decision', prompt: 'लागत अनुमानभन्दा अत्यधिक घटेर परेको बोलपत्रलाई के गर्ने?', explanation: 'अनुमानभन्दा १५% भन्दा बढी घटेमा दर विश्लेषण माग गरी सन्तोषजनक भए अतिरिक्त कार्यसम्पादन जमानत (APS) लिएर सम्झौता गर्नुपर्छ।', options: [['seek-rate-analysis-and-aps', 'अनुमानभन्दा १५% भन्दा बढी घटेमा नियमानुसार दर विश्लेषण/पुष्ट्याइँ माग गरी सन्तोषजनक भए अतिरिक्त कार्यसम्पादन जमानत (APS) लिएर स्वीकृतिको प्रक्रिया अघि बढाउने।', 100], ['reject-outright', '३०% भन्दा बढी घटेको देखिएकाले दर विश्लेषण नै नमागी सिधै रद्द गर्ने।', 0], ['accept-normal-guarantee', 'सस्तो कबोल भएकाले अतिरिक्त जमानत केही नमागी सामान्य ५% जमानतमा सम्झौता गर्ने।', 0]] },
      { id: 'low-bid-law', title: 'APS को आधार', criterion: 'legal-basis', prompt: 'अतिरिक्त कार्यसम्पादन जमानत (APS) सम्बन्धी कानुनी व्यवस्था के हो?', explanation: 'लागत अनुमानभन्दा १५% सम्म घटेमा ५% र सोभन्दा बढी घटेको रकमको ५०% बराबर थप जमानत लिनुपर्ने कानुनी व्यवस्था छ।', options: [['rules-110-aps-rule', 'नियमावलीको नियम ११० तथा मानक बोलपत्र कागजात अनुसार लागत अनुमानभन्दा १५% सम्म घटेमा ५% र सोभन्दा बढी घटेको रकमको ५०% बराबर थप जमानत लिनुपर्ने कानुनी व्यवस्था छ।', 100], ['arbitrary-security', 'कार्यालय प्रमुखले जति इच्छा लाग्यो त्यति प्रतिशत बैंक जमानत माग्न सक्छन्।', 0], ['no-extra-security', 'कानुनमा सामान्य ५% बाहेक थप जमानत लिने कुनै कानुनी आधार छैन।', 0]] },
      { id: 'low-bid-process', title: 'विश्लेषण प्रक्रिया', criterion: 'process', prompt: 'यस अवस्थामा मूल्याङ्कन समितिले कुन कार्यविधि अवलम्बन गर्नुपर्छ?', explanation: 'बोलपत्रदातासँग प्रमुख कामको दर विश्लेषण र कार्यविधि माग गरी परीक्षण गर्ने र आशयको सूचनापछि APS सहित जमानत दाखिला गर्न लगाउनुपर्छ।', options: [['clarification-and-aps-calculation', 'बोलपत्रदातासँग प्रमुख कामको दर विश्लेषण र कार्यविधि माग गरी परीक्षण गर्ने र आशयको सूचनापछि सम्झौता आह्वान गर्दा APS सहितको कार्यसम्पादन जमानत दाखिला गर्न लगाउने।', 100], ['force-withdrawal', 'बोलपत्रदातालाई आफैँ फिर्ता लिन पत्र पठाउने।', 0], ['ignore-market-rates', 'दर जतिसुकै असन्तुलित भए पनि विश्लेषण नमागी सिफारिस गर्ने।', 0]] },
      { id: 'low-bid-reasoning', title: 'जोखिम न्यूनीकरण', criterion: 'reasoning', prompt: 'अतिरिक्त कार्यसम्पादन जमानत माग्नुको मुख्य उद्देश्य के हो?', explanation: 'न्यून कबोलका कारण काम बीचमै अलपत्र पर्ने जोखिम न्यूनीकरण गर्न र गुणस्तरीय काम सम्पन्न गराउन थप जमानत लिइन्छ।', options: [['risk-mitigation-and-completion', 'न्यून कबोलका कारण काम बीचमै अलपत्र पर्ने जोखिम न्यूनीकरण गर्न र निर्माण व्यवसायीलाई गुणस्तरीय काम सम्पन्न गर्न बाध्य पार्न।', 100], ['penalize-bidders', 'कम दर हाल्ने व्यवसायीलाई आर्थिक जरिवाना गरेर हतोत्साहित गर्न।', 0], ['bank-commission', 'बैंकहरूको ग्यारेन्टी कमिसन आम्दानी बढाउन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'user-committee-heavy-machinery-rules',
    title: 'उपभोक्ता समिति र हेभी मेसिनरी प्रयोगको सीमा',
    category: 'निर्माण कार्य',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'गाउँपालिकाले रु. ९० लाखको ग्रामीण सडक स्तरोन्नति कार्य उपभोक्ता समितिमार्फत गराउने सम्झौता गर्‍यो। उपभोक्ता समितिले श्रममूलक कामदार नलगाई बाहिरको निजी ठेकेदारसँग सम्झौता गरी २ वटा एक्स्काभेटर र १ वटा लोडर प्रयोग गरेर काम सुरु गर्‍यो। इन्जिनियरले बिल प्रमाणित गर्न मानेनन्। समितिले "समयमै काम सक्न मेसिन प्रयोग गर्न पाउनुपर्छ" भन्दै दबाब दियो।',
    objectives: ['नियम ९७ बमोजिम उपभोक्ता समितिले गर्न पाउने कामको सीमा बुझ्ने', 'हेभी मेसिनरी प्रयोग र ठेकेदारलाई काम दिन नपाइने कानुनी बन्देज पहिचान गर्ने', 'सार्वजनिक खर्चको सदुपयोग र अनियमितता रोक्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम ९७', 'उपभोक्ता समिति कार्यविधि'],
    legalReferenceIds: ['rules-97', 'act-section-8', 'ppmo-opinion-10'],
    questions: [
      { id: 'user-comm-action', title: 'इन्जिनियरको कदम', criterion: 'decision', prompt: 'इन्जिनियर तथा कार्यालयले यस विषयमा के निर्णय लिनुपर्छ?', explanation: 'नियम ९७ विपरीत ठेकेदारलाई जिम्मा दिने र हेभी मेसिनरी प्रयोग गर्ने कार्य रोकी लागत अनुमान अनुसार श्रममूलक विधिबाट मात्र काम गराउनुपर्छ।', options: [['stop-contractor-machinery', 'नियम ९७ विपरीत ठेकेदारलाई जिम्मा दिने र हेभी मेसिनरी प्रयोग गर्ने कार्य रोकी लागत अनुमान र निर्देशिकाअनुसार श्रममूलक विधिबाट मात्र काम गराउने वा सम्झौता रद्द गर्ने।', 100], ['approve-and-pay', 'काम छिटो सकिने भएकाले ठेकेदारको बिल उपभोक्ता समितिकै नामबाट पास गरी भुक्तानी दिने।', 0], ['change-estimate-to-machine', 'काम भइसकेपछि लागत अनुमान संशोधन गरी मेसिन प्रयोगलाई वैधानिकता दिने।', 0]] },
      { id: 'user-comm-law', title: 'कानुनी बन्देज', criterion: 'legal-basis', prompt: 'उपभोक्ता समितिसम्बन्धी कानुनी प्रावधानले के व्यवस्था गरेको छ?', explanation: 'नियमावलीको नियम ९७ अनुसार उपभोक्ता समिति श्रममूलक हुनुपर्छ; यसले ठेकेदारलाई काम दिन र हेभी मेसिनरी प्रयोग गर्न पूर्णतः निषेध छ।', options: [['rule-97-prohibition', 'नियमावलीको नियम ९७ तथा ऐनको भावना अनुसार उपभोक्ता समिति श्रममूलक प्रकृतिको हुनुपर्छ; यसले ठेकेदार वा पेटी ठेकेदारलाई काम दिन र हेभी मेसिनरी प्रयोग गर्न पूर्णतः निषेध छ।', 100], ['unrestricted-machine-use', 'उपभोक्ता समितिले जुनसुकै मेसिन र ठेकेदार प्रयोग गर्न पूर्ण स्वतन्त्रता पाउँछ।', 0], ['opinion-10-violation', 'नियम ९७ ले मेसिनरीबारे केही नबोलेकाले स्थानीय कार्यपालिकाको तजबिज लागू हुन्छ।', 0]] },
      { id: 'user-comm-process', title: 'सुपरीवेक्षण प्रक्रिया', criterion: 'process', prompt: 'उपभोक्ता समितिको सम्झौता र कार्यसम्पादनमा कुन प्रक्रिया अनिवार्य हुन्छ?', explanation: 'लाभान्वित समुदायको सहभागिता, श्रमको मस्टरोल (Muster Roll) र स्वीकृत औजारको मात्र प्रयोग भएको स्थलगत नापजाँच अभिलेख गर्नुपर्छ।', options: [['site-supervision-and-labor-muster-roll', 'लाभान्वित समुदायको सहभागिता, श्रमको मस्टरोल (Muster Roll) र स्वीकृत लागत अनुमानअनुसारका औजारको मात्र प्रयोग भएको स्थलगत सुपरीवेक्षण र प्राविधिक नापजाँच अभिलेख गर्ने।', 100], ['trust-verbal-report', 'उपभोक्ता समितिका अध्यक्षको भनाइको भरमा मात्र बिल स्वीकृत गर्ने।', 0], ['ignore-subcontractor', 'ठेकेदारले काम गरिरहेको देखिए पनि आँखा चिम्लने।', 0]] },
      { id: 'user-comm-reasoning', title: 'सार्वजनिक मर्म', criterion: 'reasoning', prompt: 'उपभोक्ता समितिमा ठेकेदार र हेभी मेसिनरी निषेध गर्नुको मूल मर्म के हो?', explanation: 'स्थानीय जनताको स्वामित्व, रोजगारी सिर्जना र जनसहभागिता अभिवृद्धि गर्न तथा ठेक्का छल्ने बिचौलिया रोक्न यो व्यवस्था गरिएको हो।', options: [['local-employment-and-prevent-middlemen', 'स्थानीय जनताको स्वामित्व, रोजगारी सिर्जना र जनसहभागिता अभिवृद्धि गर्न तथा ठेक्का छल्न बिचौलिया प्रवेश रोक्न।', 100], ['stop-development', 'गाउँमा विकास निर्माणको गति सुस्त बनाउन।', 0], ['harass-committees', 'उपभोक्ता समितिलाई झन्झट दिन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'contract-extension-liquidated-damages',
    title: 'म्याद थप र हर्जाना (Liquidated Damages) को द्विविधा',
    category: 'सम्झौता व्यवस्थापन',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    scenario: 'एक भवन निर्माण ठेक्काको अवधि सकियो। सम्झौता अवधिभर जम्मा ४०% मात्र काम भएको छ। निर्माण व्यवसायीले स्थानीय निर्वाचन, वर्षा र मजदुर अभावको कारण देखाउँदै ६ महिना निःशुल्क म्याद थप माग गर्‍यो। आयोजनाको तर्फबाट साइट उपलब्ध गराउन वा नक्सा स्वीकृत गर्न कुनै ढिलाइ भएको थिएन। कार्यालय प्रमुख र लेखा अधिकृतबीच हर्जाना (LD) कट्टा गर्ने कि नगर्ने भन्नेमा मतभेद भयो।',
    objectives: ['नियम १२० बमोजिम म्याद थपको आधार र हर्जाना (LD) को गणना बुझ्ने', 'सार्वजनिक निकायको ढिलाइ र निर्माण व्यवसायीको ढिलाइबीचको भिन्नता छुट्याउने', 'हर्जाना कट्टा नगरी म्याद थप गर्दा हुने बेरुजु र कानुनी दायित्व बुझ्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम १२०', 'हर्जाना (Liquidated Damages) र अधिकतम १०% सीमा'],
    legalReferenceIds: ['rules-120', 'act-section-53-55', 'ppmo-opinion-11'],
    questions: [
      { id: 'ld-action', title: 'म्याद थप निर्णय', criterion: 'decision', prompt: 'निर्माण व्यवसायीको आफ्नै ढिलाइले काम नसकिएको अवस्थामा म्याद थपको निर्णय कसरी गर्नुपर्छ?', explanation: 'सार्वजनिक निकायको कारण नभई व्यवसायीको ढिलाइ देखिएकाले नियम १२० बमोजिम क्षतिपूर्ति हर्जाना (LD) कट्टा हुने गरी मात्र म्याद थप गर्नुपर्छ।', options: [['extend-with-ld', 'सार्वजनिक निकायको कारण नभई व्यवसायीको ढिलाइ देखिएकाले नियम १२० बमोजिम क्षतिपूर्ति हर्जाना (LD) कट्टा हुने गरी मात्र म्याद थप गर्ने वा सम्झौता अन्त्यको कारबाही अघि बढाउने।', 100], ['extend-without-ld', 'व्यवसायीले निवेदनमा वर्षा र चुनाव उल्लेख गरेकाले बिना हर्जाना निःशुल्क ६ महिना म्याद थप गरिदिने।', 0], ['verbal-extension', 'फाइलमा केही निर्णय नगरी अनौपचारिक रूपमा काम गर्न दिने।', 0]] },
      { id: 'ld-law', title: 'हर्जानाको कानुनी आधार', criterion: 'legal-basis', prompt: 'हर्जाना (Liquidated Damages) सम्बन्धी कानुनी प्रावधान के हो?', explanation: 'व्यवसायीको ढिलाइमा दैनिक ०.०५% का दरले अधिकतम १०% सम्म हर्जाना कट्टा गरी म्याद थप गर्न सकिने व्यवस्था छ।', options: [['rules-120-ld-provision', 'नियमावलीको नियम १२० अनुसार व्यवसायीको कारणले ढिलाइ भए सम्झौता रकमको दैनिक ०.०५% का दरले अधिकतम १०% सम्म हर्जाना कट्टा गरी म्याद थप गर्न सकिने व्यवस्था छ।', 100], ['unlimited-free-extension', 'निर्माण व्यवसायीले जहिले माग गरे पनि जति पटक पनि बिना हर्जाना म्याद थप्नै पर्ने बाध्यता छ।', 0], ['fixed-penalty', 'ढिलाइको दिन जति भए पनि एकमुष्ठ रु. १० हजार जरिवाना तिराए पुग्छ।', 0]] },
      { id: 'ld-process', title: 'ढिलाइ विश्लेषण', criterion: 'process', prompt: 'म्याद थप गर्दा कुन प्राविधिक तथा प्रशासनिक प्रक्रिया पूरा गर्नुपर्छ?', explanation: 'इन्जिनियरबाट ढिलाइको यथार्थ कारण (Critical Path Delay) विश्लेषण, कार्यसम्पादन जमानत र बीमा नवीकरण यकिन गर्नुपर्छ।', options: [['site-delay-analysis-and-guarantee-extension', 'इन्जिनियरबाट ढिलाइको यथार्थ कारण (Critical Path Delay) विश्लेषण, कार्यसम्पादन जमानत र बीमाको म्याद थप भएको प्रमाण यकिन गरी अधिकारप्राप्त अधिकारीबाट निर्णय गराउने।', 100], ['only-application-basis', 'व्यवसायीको निवेदन मात्र दर्ता गरी प्राविधिक प्रतिवेदनबिना म्याद थप गर्ने।', 0], ['ignore-bank-guarantee', 'बैंक जमानतको म्याद गुज्रिए पनि म्याद थप आदेश दिने।', 0]] },
      { id: 'ld-reasoning', title: 'आर्थिक अनुशासन', criterion: 'reasoning', prompt: 'सार्वजनिक निकायको गल्ती नहुँदा हर्जाना नलगाउनु किन आर्थिक अनुशासन विपरीत मानिन्छ?', explanation: 'बिना आधार हर्जाना छुट दिँदा सरकारी स्रोतको हानी भई महालेखापरीक्षकबाट असुलउपर हुने बेरुजु ठहरिन्छ।', options: [['public-loss-and-auditing-standard', 'बिना आधार हर्जाना छुट दिँदा सार्वजनिक निकायलाई समयमा सेवा नपुग्नुका साथै राजस्व तथा सरकारी स्रोतको हानी भई महालेखापरीक्षकबाट असुलउपर हुने बेरुजु ठहरिन्छ।', 100], ['favoring-banks', 'बैंकहरूलाई ब्याज दिलाउन हर्जाना लगाइएको हो।', 0], ['punishing-contractors', 'सबै निर्माण व्यवसायीलाई आर्थिक रूपमा टाट पल्टाउन कानुनले हर्जाना अनिवार्य गरेको हो।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'arithmetic-error-correction-limits',
    title: 'अंक र अक्षरमा फरक तथा गणितीय त्रुटि सच्याउने सीमा',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'खानेपानी आयोजनाको बोलपत्र खोल्दा एक बोलपत्रदाताको BOQ मा "पाइप आपूर्ति" को दर अंकमा रु. ५०० प्रतिमिटर र अक्षरमा "पाँच सय मात्र" लेखिएको छ। तर परिमाण १,००० मिटरसँग गुणन गर्दा कुल रकम रु. ५०,००० लेखिएको छ (वास्तविक गुणन रु. ५,००,००० हुनुपर्नेमा)। यसले गर्दा उसको कुल बोलपत्र रकम लागत अनुमानभन्दा निकै कम देखियो। बोलपत्रदाताले "मैले कुल रकम मात्र हेरेर कबोल गरेको हो, एकाइ दर सच्याउन मिल्दैन" भन्यो।',
    objectives: ['दफा २३ र नियम अनुसार गणितीय त्रुटि सच्याउने सिद्धान्त बुझ्ने', 'एकाइ दर र कुल रकमबीचको प्राथमिकता निर्धारण गर्ने', 'त्रुटि सच्याएपछि बोलपत्रदातालाई सूचित गर्ने र स्वीकृति नदिए जमानत जफत गर्ने प्रक्रिया बुझ्ने'],
    priorKnowledge: ['Arithmetic Error Correction (गणितीय त्रुटि सच्याउने)', 'एकाइ दर (Unit Rate) को सर्वोपरिता'],
    legalReferenceIds: ['rules-40-66', 'act-section-23', 'pprc-decision-18'],
    questions: [
      { id: 'arithmetic-action', title: 'सच्याउने आधार', criterion: 'decision', prompt: 'एकाइ दर र कुल रकममा फरक पर्दा मूल्याङ्कन समितिले कुन दरलाई आधार मान्नुपर्छ?', explanation: 'ऐन र बोलपत्र कागजात बमोजिम एकाइ दरलाई नै आधिकारिक मानी परिमाणसँग गुणन गरी कुल रकम सच्याउनुपर्छ।', options: [['unit-rate-governs', 'ऐन र बोलपत्र कागजात बमोजिम एकाइ दरलाई नै आधिकारिक मानी परिमाणसँग गुणन गरी कुल रकम सच्याउने (Corrected Bid Price) र सोही संशोधित रकम मूल्याङ्कनमा गणना गर्ने।', 100], ['total-amount-governs', 'बोलपत्रदाताले लेखेको कुल रकमलाई नै सदर गरी एकाइ दर घटाएर मिलाइदिने।', 0], ['reject-immediately', 'गणितीय त्रुटि हुनेबित्तिकै कुनै जाँच नगरी बोलपत्र स्वतः रद्द गर्ने।', 0]] },
      { id: 'arithmetic-law', title: 'कानुनी प्राथमिकता', criterion: 'legal-basis', prompt: 'गणितीय त्रुटि सच्याउने सम्बन्धमा प्रचलित कानुनी व्यवस्था के छ?', explanation: 'एकाइ दर र कुल रकममा फरक परे एकाइ दर मान्य हुने र अंक र अक्षरमा फरक परे अक्षर मान्य हुने स्पष्ट व्यवस्था छ।', options: [['rules-arithmetic-rule', 'सार्वजनिक खरिद नियमावली र मानक बोलपत्र कागजातको ITB अनुसार एकाइ दर र कुल रकममा फरक परे एकाइ दर मान्य हुने र अंक र अक्षरमा फरक परे अक्षर मान्य हुने स्पष्ट व्यवस्था छ।', 100], ['bidder-choice', 'बोलपत्रदाताले जुन रोज्छ त्यही मान्नुपर्ने कानुनी व्यवस्था छ।', 0], ['arbitrary-law', 'कानुन मौन रहेकाले मूल्याङ्कन समितिको स्वेच्छाचारिता चल्छ।', 0]] },
      { id: 'arithmetic-process', title: 'सूचना र जमानत जफत', criterion: 'process', prompt: 'सच्याइएको रकम बोलपत्रदातालाई कसरी जानकारी गराउने र उसले अस्वीकार गरे के गर्ने?', explanation: 'सच्याइएको रकमको लिखित जानकारी दिने; स्वीकार नगरे बोलपत्र अस्वीकृत गरी जमानत जफत गर्नुपर्छ।', options: [['notify-correction-and-forfeit-if-rejected', 'सच्याइएको रकमको लिखित जानकारी बोलपत्रदातालाई दिने; यदि उसले सच्याइएको रकम स्वीकार नगरे उसको बोलपत्र अस्वीकृत गरी बोलपत्र जमानत (Bid Security) जफत गर्ने।', 100], ['silent-adjustment', 'बोलपत्रदातालाई थाहै नदिई सम्झौता पत्र पठाउने।', 0], ['refund-guarantee-on-refusal', 'स्वीकार नगरे माफ गरिदिएर जमानत फिर्ता दिने।', 0]] },
      { id: 'arithmetic-reasoning', title: 'एकाइ दरको सर्वोपरिता', criterion: 'reasoning', prompt: 'एकाइ दरलाई नै सर्वोपरि मान्नुको कानुनी र व्यावहारिक कारण के हो?', explanation: 'एकाइ दर सम्झौताको अभिन्न अंग हुने हुनाले जानीजानी कुल रकम घटाएर कम कबोल देखाउने विकृति रोक्न यो सिद्धान्त लागू गरिन्छ।', options: [['unit-rate-is-binding-commitment', 'एकाइ दर नै वास्तविक कार्यको दर सम्झौताको अभिन्न अंग हुने हुनाले जानीजानी कुल रकम घटाएर कम कबोल देखाउने विकृति रोक्न।', 100], ['punish-careless-clerks', 'टाइपिस्टको गल्तीलाई सजाय दिन।', 0], ['increase-bid-price', 'ठेक्का रकम जसरी पनि बढाउन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'tie-bid-price-resolution',
    title: 'समान कबोल रकम (Tie) मा छनोट विधि',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 11,
    scenario: 'एउटा निर्माण खरिदमा प्राविधिक रूपमा सफल दुई निर्माण व्यवसायी (फर्म A र फर्म B) को मूल्याङ्कित कबोल रकम ठ्याक्कै समान (रु. ४५,२०,०००.००) भयो। मूल्याङ्कन समितिका सदस्यहरूबीच एक जनाले "सिक्का उफारेर टस गरौँ वा गोलाप्रथा गरौँ", अर्कोले "स्थानीय फर्मलाई दिऔँ" र तेस्रोले "थप योग्यता/अनुभव वा पुनः दर मागौँ" भनी विवाद भयो।',
    objectives: ['नियम ६४(६) बमोजिम समान कबोल (Tie) भएको अवस्थाको कार्यविधि बुझ्ने', 'गोलाप्रथा र कार्यक्षमता परीक्षणको सही प्राथमिकता पहिचान गर्ने', 'पारदर्शी र निष्पक्ष छनोट अभिलेख गर्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम ६४(६)', 'Tie-breaker कार्यविधि'],
    legalReferenceIds: ['rules-64-6', 'rules-40-66', 'pprc-decision-27'],
    questions: [
      { id: 'tie-action', title: 'छनोट विधि', criterion: 'decision', prompt: 'समान मूल्याङ्कित कबोल रकम (Tie) परेमा कुन विधि अपनाउनु कानुनसम्मत हुन्छ?', explanation: 'नियमावलीको नियम ६४(६) र कागजातको व्यवस्था अनुसार कार्यक्षमता वा तोकिएको पारदर्शी आधारबाट छनोट गर्नुपर्छ।', options: [['rule-64-6-tie-procedure', 'नियमावलीको नियम ६४(६) र कागजातको व्यवस्था अनुसार कार्यक्षमता, कार्य अनुभव वा नियमानुसार तोकिएको पारदर्शी आधार परीक्षण गर्ने वा नियमानुसारको विधि पछ्याउने।', 100], ['secret-coin-toss', 'कोठाभित्र गोप्य रूपमा टस गरेर जसले जित्छ त्यसलाई छनोट गर्ने।', 0], ['favor-local-informally', 'कुनै कानुनी आधारबिना स्थानीयलाई मात्र प्राथमिकता दिने।', 0]] },
      { id: 'tie-law', title: 'नियम ६४(६) को व्यवस्था', criterion: 'legal-basis', prompt: 'यस विषयमा सार्वजनिक खरिद नियमावलीको कुन व्यवस्था आकर्षित हुन्छ?', explanation: 'सार्वजनिक खरिद नियमावलीको नियम ६४ उपनियम (६) ले समान कबोल परेको अवस्थामा छनोट गर्ने स्पष्ट व्यवस्था गरेको छ।', options: [['rule-64-6-legal-provision', 'सार्वजनिक खरिद नियमावलीको नियम ६४ उपनियम (६) ले समान कबोल परेको अवस्थामा छनोट गर्ने स्पष्ट कानुनी व्यवस्था गरेको छ।', 100], ['cancel-and-rebid-only', 'समान कबोल पर्नासाथ ठेक्का स्वतः रद्द गरी पुनः बोलपत्र गर्नैपर्ने बाध्यात्मक व्यवस्था छ।', 0], ['split-fifty-fifty', 'काम आधा आधा बाँडेर दुवैलाई दिनुपर्ने ऐनको व्यवस्था छ।', 0]] },
      { id: 'tie-process', title: 'पारदर्शी अभिलेख', criterion: 'process', prompt: 'Tie-break गर्दा मूल्याङ्कन समितिले कुन प्रक्रिया सुनिश्चित गर्नुपर्छ?', explanation: 'सम्बन्धित बोलपत्रदाताहरूको उपस्थितिमा पारदर्शी ढङ्गले तोकिएको मापदण्डको मुचुल्का तयार गरी निर्णय अभिलेख गर्नुपर्छ।', options: [['transparent-criteria-and-presence', 'सम्बन्धित बोलपत्रदाताहरूको उपस्थितिमा पारदर्शी ढङ्गले तोकिएको मापदण्डको परीक्षण वा प्रक्रिया अपनाई मुचुल्का तयार गरी निर्णय अभिलेख गर्ने।', 100], ['private-negotiation', 'दुवैलाई छुट्टाछुट्टै बोलाई गोप्य कमिसनको प्रस्ताव गर्ने।', 0], ['delay-indefinitely', 'कुनै निर्णय नगरी फाइल थन्क्याएर राख्ने।', 0]] },
      { id: 'tie-reasoning', title: 'निष्पक्षताको मर्म', criterion: 'reasoning', prompt: 'समान कबोलमा पारदर्शी विधि अवलम्बन गर्नु किन अनिवार्य छ?', explanation: 'व्यक्तिगत पूर्वाग्रह वा स्वेच्छाचारिता रोकी सार्वजनिक निकायको निर्णय निष्पक्ष, स्वच्छ र कानुनी रूपमा विवादरहित बनाउन पारदर्शी विधि चाहिन्छ।', options: [['prevent-arbitrary-bias', 'व्यक्तिगत पूर्वाग्रह वा स्वेच्छाचारिता रोकी सार्वजनिक निकायको निर्णय निष्पक्ष, स्वच्छ र कानुनी रूपमा विवादरहित बनाउन।', 100], ['speedy-tender', 'हतार हतार ठेक्का सम्झौता टुङ्ग्याउन।', 0], ['satisfy-politicians', 'राजनीतिक दबाबलाई सन्तुलन गर्न।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'five-running-contracts-declaration',
    title: 'पाँच चालू ठेक्काको स्वघोषणा र परीक्षण',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'रु. ३ करोडको भवन निर्माण खरिदमा एक निर्माण व्यवसायीले ५ वटा भन्दा बढी चालू ठेक्का नभएको स्वघोषणा पेश गर्‍यो। तर प्रतिस्पर्धी अर्को बोलपत्रदाताले उजुरी हाल्दै "यस व्यवसायीका हाल देशभर ६ वटा ठेक्का सम्झौता कार्यान्वयनमा छन्, यसले झुट्टा स्वघोषणा गरेको छ" भनी सम्झौता पत्रहरूका प्रमाण पेश गर्‍यो।',
    objectives: ['पाँच चालू ठेक्का (Five Running Contracts) सम्बन्धी नियमावलीको सीमा परीक्षण गर्ने', 'झुट्टा स्वघोषणा गर्ने बोलपत्रदाताउपर कारबाही र कालोसूची सिफारिस बुझ्ने', 'प्रमाण प्रमाणीकरणको वैधानिक प्रक्रिया अवलम्बन गर्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावलीको ५ चालू ठेक्का व्यवस्था', 'झुट्टा स्वघोषणा र कालोसूची'],
    legalReferenceIds: ['rules-40-66', 'ppmo-opinion-15', 'act-section-59-63'],
    questions: [
      { id: 'running-contracts-action', title: 'उजुरीउपर कदम', criterion: 'decision', prompt: 'उजुरी परेपछि मूल्याङ्कन समितिले के कदम चाल्नुपर्छ?', explanation: 'सम्बन्धित निकायहरूसँग ५ भन्दा बढी चालू ठेक्का रहे/नरहेको तत्काल प्रमाणीकरण गर्ने र झुट्टा देखिए अयोग्य गरी जमानत जफत र कालोसूची सिफारिस गर्नुपर्छ।', options: [['verify-running-contracts-and-disqualify-if-false', 'सम्बन्धित निकायहरूसँग ५ भन्दा बढी चालू ठेक्का रहे/नरहेको तत्काल प्रमाणीकरण गर्ने; झुट्टा स्वघोषणा प्रमाणित भए बोलपत्र अयोग्य ठहर गरी जमानत जफत र कालोसूची सिफारिस गर्ने।', 100], ['ignore-complaint', 'स्वघोषणा फर्म पेश भइसकेकाले बाहिरको उजुरीलाई सिधै खारेज गरी ठेक्का दिने।', 0], ['cancel-whole-tender', 'उजुरी पर्नासाथ सम्पूर्ण बोलपत्र प्रक्रिया नै रद्द गरिदिने।', 0]] },
      { id: 'running-contracts-law', title: 'झुट्टा विवरणको दायित्व', criterion: 'legal-basis', prompt: 'झुट्टा विवरण पेश गर्ने बोलपत्रदातामाथि कुन कानुनी दफा आकर्षित हुन्छ?', explanation: 'दफा ६२ बमोजिम बोलपत्र अस्वीकृत हुने, जमानत जफत हुने र दफा ६३ बमोजिम कालोसूचीमा राख्न सिफारिस गर्नुपर्ने व्यवस्था छ।', options: [['act-section-62-63-basis', 'सार्वजनिक खरिद ऐनको दफा ६२ बमोजिम बोलपत्र अस्वीकृत हुने, जमानत जफत हुने र दफा ६३ बमोजिम कालोसूचीमा राख्न PPMO मा लेखी पठाउनुपर्ने कानुनी व्यवस्था छ।', 100], ['no-penalty-for-declaration', 'स्वघोषणा कागजातमा गल्ती हुँदा कुनै कानुनी सजाय हुँदैन।', 0], ['police-case-only', 'खरिद ऐनमा केही नभएकाले सिधै प्रहरीमा जाहेरी दिनुपर्छ।', 0]] },
      { id: 'running-contracts-process', title: 'प्रमाणीकरण विधि', criterion: 'process', prompt: 'चालू ठेक्का यकिन गर्दा कुन प्रक्रिया अपनाउनुपर्छ?', explanation: 'e-GP / PMIS प्रणाली र सम्बन्धित निकायहरूबाट कार्यसम्पन्न प्रमाणपत्र जारी नभएका चालू ठेक्काको आधिकारिक विवरण लिखित रूपमा रुजु गर्नुपर्छ।', options: [['written-verification-and-pmis-check', 'e-GP / PMIS प्रणाली र सम्बन्धित सार्वजनिक निकायहरूबाट कार्यसम्पन्न प्रमाणपत्र जारी नभएका चालू ठेक्काको आधिकारिक विवरण लिखित रूपमा रुजु गर्ने।', 100], ['telephone-inquiry-only', 'अनौपचारिक फोन सोधपुछको आधारमा प्रतिवेदन लेख्ने।', 0], ['assume-guilty-without-proof', 'कुनै प्रमाणबिना उजुरीकर्ताको दाबी मात्र सत्य मान्ने।', 0]] },
      { id: 'running-contracts-reasoning', title: 'नीतिको उद्देश्य', criterion: 'reasoning', prompt: 'पाँच चालू ठेक्काको सीमा र स्वघोषणा अनिवार्य गर्नुको मुख्य उद्देश्य के हो?', explanation: 'एउटै निर्माण व्यवसायीले क्षमताभन्दा बढी ठेक्का ओगटेर आयोजनाहरू अलपत्र पार्ने प्रवृत्ति रोक्न यो नीति ल्याइएको हो।', options: [['prevent-overload-and-project-paralysis', 'एउटै निर्माण व्यवसायीले क्षमताभन्दा बढी ठेक्का ओगटेर आयोजनाहरू अलपत्र पार्ने प्रवृत्ति रोक्न र कार्यसम्पादन क्षमता सुनिश्चित गर्न।', 100], ['reduce-competition', 'साना निर्माण व्यवसायीलाई ठेक्काबाट बाहिर राख्न।', 0], ['increase-paperwork', 'प्रशासनिक प्रक्रिया लामो बनाउन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'mobilization-advance-bank-guarantee-forfeit',
    title: 'मोबिलाइजेसन पेश्की दुरुपयोग र जमानत जफत',
    category: 'सम्झौता व्यवस्थापन',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    scenario: 'पुल निर्माण ठेक्कामा निर्माण व्यवसायीलाई १०% मोबिलाइजेसन पेश्की रु. १ करोड उपलब्ध गराइयो। ६ महिना बितिसक्दा पनि व्यवसायीले साइटमा कुनै उपकरण वा जनशक्ति परिचालन गरेन र पेश्की रकम घरजग्गामा लगानी गरेको भेटियो। पेश्की बैंक जमानतको म्याद समाप्त हुन १५ दिन मात्र बाँकी छ।',
    objectives: ['नियम १४५ बमोजिम पेश्कीको उपयोग अनुगमन र बैंक जमानतको म्याद परीक्षण बुझ्ने', 'पेश्की दुरुपयोगमा बैंक जमानत तुरुन्त दाबी (Call Guarantee) गर्ने प्रक्रिया बुझ्ने', 'सरकारी रकम असुली र कानुनी उपचार सुनिश्चित गर्ने'],
    priorKnowledge: ['सार्वजनिक खरिद नियमावली नियम १४५', 'Advance Payment Guarantee (पेश्की जमानत) र दाबी प्रक्रिया'],
    legalReferenceIds: ['rules-145', 'act-section-59-63', 'rules-110-119'],
    questions: [
      { id: 'advance-call-action', title: 'जमानत दाबी', criterion: 'decision', prompt: 'पेश्की जमानतको म्याद सकिन लाग्दा र काम नगरेको अवस्थामा तत्काल के कदम चाल्नुपर्छ?', explanation: 'बैंक जमानतको म्याद समाप्त हुनु अगावै सम्बन्धित वाणिज्य बैंकमा पेश्की रकम सरकारी खातामा जम्मा गर्न तत्काल औपचारिक दाबी पठाउनुपर्छ।', options: [['call-guarantee-immediately', 'बैंक जमानतको म्याद समाप्त हुनु अगावै सम्बन्धित वाणिज्य बैंकमा पेश्की जमानत बापतको रकम सरकारी खातामा जम्मा गर्न तत्काल औपचारिक दाबी (Call) पत्र पठाउने।', 100], ['wait-for-expiry', 'म्याद सकिएपछि के गर्छ भनी पर्खेर बस्ने।', 0], ['request-verbal-commitment', 'व्यवसायीलाई मौखिक रूपमा काम छिटो गर्न सम्झाउने।', 0]] },
      { id: 'advance-call-law', title: 'पेश्की असुलीको कानुन', criterion: 'legal-basis', prompt: 'मोबिलाइजेसन पेश्की र बैंक जमानत सम्बन्धी कानुनी व्यवस्था के छ?', explanation: 'नियम १४५ अनुसार पेश्की सम्बन्धित कामका लागि मात्र खर्च हुनुपर्छ र दुरुपयोग भएमा वा म्याद नथपिएमा बिना शर्त बैंक जमानतबाट असुलउपर गरिन्छ।', options: [['rule-145-advance-rules', 'सार्वजनिक खरिद नियमावलीको नियम १४५ अनुसार पेश्की सम्बन्धित कामका लागि मात्र खर्च गर्नुपर्ने र दुरुपयोग भएमा वा म्याद नथपिएमा बिना शर्त बैंक जमानतबाट असुलउपर गरिने व्यवस्था छ।', 100], ['advance-is-grant', 'पेश्की सरकारी अनुदान जस्तै हो, फिर्ता लिन मिल्दैन।', 0], ['court-order-required-first', 'अदालतको अन्तिम फैसला नभएसम्म बैंक जमानत दाबी गर्नै पाइँदैन।', 0]] },
      { id: 'advance-call-process', title: 'दाबी प्रक्रिया', criterion: 'process', prompt: 'पेश्की जमानत दाबी गर्दा कुन प्रशासनिक प्रक्रिया पूरा गर्नुपर्छ?', explanation: 'म्यादभित्रै बैंकको आधिकारिक शाखामा दर्ता हुने गरी सक्कल दाबी पत्र, बैंक भौचर र अख्तियारनामा पेश गर्नुपर्छ।', options: [['formal-written-demand-to-bank', 'सम्झौता र जमानत पत्रका शर्तअनुसार म्यादभित्रै बैंकको आधिकारिक शाखामा दर्ता हुने गरी सक्कल दाबी पत्र, बैंक भौचर र अख्तियारनामा पेश गर्ने।', 100], ['email-only', 'बैंकको कुनै कर्मचारीलाई अनौपचारिक म्यासेज पठाउने।', 0], ['deduct-from-running-bill', 'बिल नै नबनेको अवस्थामा काल्पनिक बिलबाट कट्टा गर्ने।', 0]] },
      { id: 'advance-call-reasoning', title: 'राज्य कोष संरक्षण', criterion: 'reasoning', prompt: 'जमानतको म्याद सकिनु अगावै दाबी गर्नु किन गम्भीर जिम्मेवारी हो?', explanation: 'जमानतको म्याद समाप्त हुनासाथ बैंकको दायित्व अन्त्य भई सरकारी रकम असुल हुन नसक्ने गम्भीर जोखिम रहन्छ।', options: [['prevent-state-financial-loss', 'जमानतको म्याद समाप्त हुनासाथ बैंकको कानुनी दायित्व अन्त्य हुने हुँदा सरकारी रकम असुल हुन नसकी राज्यलाई प्रत्यक्ष आर्थिक हानी हुने जोखिम हुन्छ।', 100], ['harass-bank-managers', 'बैंक प्रबन्धकलाई दबाबमा राख्न।', 0], ['contractor-credit-score', 'निर्माण व्यवसायीको क्रेडिट रेटिङ बिगार्न।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'contract-termination-and-reprocurement',
    title: 'सम्झौता अन्त्य (Termination) र कानुनी कार्यविधि',
    category: 'सम्झौता व्यवस्थापन',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    scenario: 'अस्पताल भवन निर्माणको सम्झौता भएको २ वर्ष भयो। म्याद सकिन लाग्दा प्रगति १५% मात्र छ र निर्माण व्यवसायी पछिल्लो ६ महिनादेखि सम्पर्कविहीन छ। कार्यालय प्रमुखले तुरुन्त ठेक्का तोडेर अर्को ठेकेदारलाई काम दिन चाहेका छन्। तर कानुनी सल्लाहकारले "सीधै ठेक्का तोड्दा प्रक्रियागत त्रुटि भई अदालत वा पुनरावलोकन समितिबाट बदर हुन सक्छ" भनी चेतावनी दिए।',
    objectives: ['दफा ५९ र नियमावली अनुसार सम्झौता अन्त्य (Termination) को वैधानिक कार्यविधि बुझ्ने', 'स्पष्टीकरणको पूर्वसूचना (Notice of Default/Show Cause) को अनिवार्यता पहिचान गर्ने', 'जमानत जफत, बाँकी कामको दायित्व र नयाँ खरिद प्रक्रियाको चरण बुझ्ने'],
    priorKnowledge: ['सार्वजनिक खरिद ऐन दफा ५९', 'प्राकृतिक न्यायको सिद्धान्त र स्पष्टीकरण म्याद'],
    legalReferenceIds: ['act-section-59-63', 'rules-110-119', 'ppmo-opinion-6'],
    questions: [
      { id: 'termination-action', title: 'ठेक्का तोड्ने चरण', criterion: 'decision', prompt: 'ठेक्का तोड्नु (Termination) अगाडि कार्यालयले कुन अनिवार्य कार्य पूरा गर्नुपर्छ?', explanation: 'ऐनको दफा ५९ बमोजिम स्पष्टीकरण/सुधारको म्याद (Notice to Correct / Show Cause) दिई सुनुवाइको मौका प्रदान गरेर मात्र औपचारिक अन्त्य गर्नुपर्छ।', options: [['issue-cure-notice-and-follow-legal-process', 'सम्झौता र ऐनको दफा ५९ बमोजिम स्पष्टीकरण/सुधारको म्याद (Notice to Correct / Show Cause) दिई सुनुवाइको मौका प्रदान गरेर मात्र औपचारिक अन्त्यको निर्णय गर्ने।', 100], ['instant-verbal-termination', 'कुनै सूचना नदिई मौखिक रूपमा आजैबाट ठेक्का तोडियो भनी नयाँ ठेकेदार बोलाउने।', 0], ['keep-waiting-forever', 'सम्पर्कविहीन भए पनि कुनै कदम नचाली म्याद कुरेर बस्ने।', 0]] },
      { id: 'termination-law', title: 'दफा ५९ को व्यवस्था', criterion: 'legal-basis', prompt: 'सम्झौता अन्त्यसम्बन्धी कानुनी आधार के हो?', explanation: 'दफा ५९ ले सम्झौता उल्लङ्घनमा अन्त्य गर्ने, जमानत जफत गर्ने र बाँकी कामको अतिरिक्त खर्च असुल गर्ने आधार तोकेको छ।', options: [['act-section-59-basis', 'सार्वजनिक खरिद ऐनको दफा ५९ ले सम्झौता उल्लङ्घन भएको अवस्थामा सम्झौता अन्त्य गर्ने, कार्यसम्पादन जमानत जफत गर्ने र बाँकी कामको अतिरिक्त खर्च असुल गर्ने स्पष्ट आधार तोकेको छ।', 100], ['unilateral-break-anytime', 'सरकारी निकायले बिना कुनै कारण वा आधार जहिले पनि एकतर्फी ठेक्का तोड्न पाउँछ।', 0], ['no-termination-allowed', 'खरिद ऐनमा ठेक्का तोड्न पाउने कुनै प्रावधान नै छैन।', 0]] },
      { id: 'termination-process', title: 'प्राविधिक मुचुल्का', criterion: 'process', prompt: 'सम्झौता अन्त्यको निर्णय गर्दा कुन प्रशासनिक तथा प्राविधिक अभिलेख अनिवार्य हुन्छ?', explanation: 'कामको संयुक्त/प्राविधिक नापजाँच (Joint Measurement), साइटका सामग्रीको मुचुल्का, जमानत जफत र बाँकी कामको नयाँ लागत अनुमान स्वीकृत गर्नुपर्छ।', options: [['joint-measurement-and-inventory-record', 'कामको संयुक्त वा प्राविधिक नापजाँच (Joint Measurement), साइटमा रहेका सामग्री/उपकरणको मुचुल्का, कार्यसम्पादन जमानत जफत र बाँकी कामको नयाँ लागत अनुमान स्वीकृत गर्ने।', 100], ['approximate-guess', 'अन्दाजको भरमा बिल बनाएर फाइल बन्द गर्ने।', 0], ['release-guarantee-kindly', 'दया देखाएर कार्यसम्पादन जमानत फिर्ता गरिदिने।', 0]] },
      { id: 'termination-reasoning', title: 'प्राकृतिक न्याय', criterion: 'reasoning', prompt: 'पूर्वसूचना (Show Cause Notice) बिना ठेक्का तोड्दा के कानुनी जोखिम हुन्छ?', explanation: 'प्राकृतिक न्यायको सिद्धान्त (Audi Alteram Partem) उल्लङ्घन भई निर्णय बदर हुने र सरकारी निकाय क्षतिपूर्तिको भागीदार हुनसक्ने जोखिम रहन्छ।', options: [['natural-justice-violation', 'प्राकृतिक न्यायको सिद्धान्त (Audi Alteram Partem) उल्लङ्घन भई अदालत वा पुनरावलोकन समितिबाट निर्णय बदर हुने र सरकारी निकाय क्षतिपूर्तिको भागीदार हुनसक्ने जोखिम रहन्छ।', 100], ['contractor-happiness', 'व्यवसायी खुसी हुने जोखिम।', 0], ['no-risk-at-all', 'कुनै कानुनी जोखिम हुँदैन, सरकारी कार्यालय जे गर्दा पनि सुरक्षित हुन्छ।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'blacklisting-pending-bid-acceptance',
    title: 'कालोसूची सिफारिस विचाराधीन हुँदा नयाँ ठेक्का स्वीकृतिको द्विविधा',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'खानेपानी आयोजनाको बोलपत्र मूल्याङ्कनमा "क" निर्माण सेवा न्यूनतम मूल्याङ्कित सारभूत रूपमा प्रभावग्राही ठहरियो। तर मूल्याङ्कनकै क्रममा सडक विभागले उक्त "क" निर्माण सेवालाई अर्को ठेक्का अलपत्र पारेको भन्दै कालोसूचीमा राख्न PPMO मा सिफारिस पठाएको पत्र सार्वजनिक भयो। यद्यपि PPMO ले कालोसूचीको अन्तिम निर्णय गरिसकेको छैन। मूल्याङ्कन समिति अन्योलमा पर्‍यो: के सिफारिस मात्र भएको आधारमा यसलाई अयोग्य घोषणा गर्न मिल्छ?',
    objectives: ['कालोसूची सिफारिस र कालोसूचीको अन्तिम निर्णयबीचको कानुनी अन्तर बुझ्ने', 'दफा ६३ बमोजिम अयोग्यता लागू हुने मिति/चरण पहिचान गर्ने', 'PPMO को निर्णय नआउँदासम्म बोलपत्र स्वीकृतिको कानुनी स्थिति बुझ्ने'],
    priorKnowledge: ['सार्वजनिक खरिद ऐन दफा ६३', 'कालोसूचीकरणको कानूनी प्रभाव र लागू मिति'],
    legalReferenceIds: ['act-section-59-63', 'ppmo-opinion-15', 'rules-40-66'],
    questions: [
      { id: 'pending-blacklist-action', title: 'सिफारिसको कानुनी हैसियत', criterion: 'decision', prompt: 'कालोसूचीमा सिफारिस भएको तर PPMO बाट निर्णय भइनसकेको फर्मलाई कसरी सम्हाल्ने?', explanation: 'PPMO बाट औपचारिक रूपमा कालोसूचीमा सूचीकृत नभएसम्म बोलपत्र मूल्याङ्कन कानुन र प्रकाशित कागजात बमोजिम नै अघि बढाउनुपर्छ।', options: [['pmo-decision-pending-status', 'कालोसूचीमा सिफारिस हुँदैमा स्वतः अयोग्य हुँदैन; PPMO बाट औपचारिक रूपमा कालोसूचीमा सूचीकृत नभएसम्म बोलपत्र मूल्याङ्कन कानुन र प्रकाशित कागजात बमोजिम नै अघि बढाउने।', 100], ['disqualify-on-recommendation', 'सिफारिस पत्र देखिनासाथ तुरुन्त अयोग्य ठहर गरी बोलपत्र रद्द गर्ने।', 0], ['suspend-everything-indefinitely', 'PPMO को निर्णय कहिले आउँछ भनी अनिश्चितकालसम्म खरिद रोकेर बस्ने।', 0]] },
      { id: 'pending-blacklist-law', title: 'दफा ६३ को लागू मिति', criterion: 'legal-basis', prompt: 'कालोसूचीको प्रभाव कुन मितिदेखि लागू हुने कानुनी व्यवस्था छ?', explanation: 'ऐनको दफा ६३ अनुसार PPMO ले औपचारिक रूपमा निर्णय गरी कालोसूचीमा राखेको मितिदेखि मात्र अयोग्य हुन्छ।', options: [['section-63-effective-date', 'ऐनको दफा ६३ अनुसार PPMO ले औपचारिक रूपमा निर्णय गरी कालोसूचीमा राखेको मितिदेखि मात्र सम्बन्धित व्यक्ति वा फर्म खरिद कारबाहीमा भाग लिन अयोग्य हुन्छ।', 100], ['recommendation-date-effective', 'जुनसुकै कार्यालयले सिफारिस पत्र लेखेको दिनदेखि नै कानुनी रूपमा स्वतः कालोसूची लागू हुन्छ।', 0], ['rumor-basis', 'पत्रपत्रिकामा समाचार आएकै दिनदेखि अयोग्य हुन्छ।', 0]] },
      { id: 'pending-blacklist-process', title: 'आधिकारिक रुजु', criterion: 'process', prompt: 'यस अवस्थामा मूल्याङ्कन समितिले कुन प्रमाण पुष्टि गर्नुपर्छ?', explanation: 'PPMO को आधिकारिक पोर्टलको अद्यावधिक कालोसूची हेरी बोलपत्र दाखिला र स्वीकृतिका बखत सो फर्म सूचीमा रहे/नरहेको मिति प्रमाणित गर्नुपर्छ।', options: [['check-ppmo-official-blacklist', 'PPMO को आधिकारिक वेबसाइट/पोर्टलमा रहेको अद्यावधिक कालोसूची सूची (Blacklist) हेरी बोलपत्र दाखिला गर्दा र स्वीकृत गर्दा सो फर्म सूचीमा रहे/नरहेको मिति प्रमाणित गरी अभिलेख गर्ने।', 100], ['accept-verbal-rumor', 'अनौपचारिक हल्लाको आधारमा टिप्पणी उठाउने।', 0], ['ask-competitor-permission', 'प्रतिस्पर्धी फर्मसँग सोधेर निर्णय गर्ने।', 0]] },
      { id: 'pending-blacklist-reasoning', title: 'वैधानिक प्रक्रियाको संरक्षण', criterion: 'reasoning', prompt: 'सिफारिसकै भरमा अयोग्य नमान्नुको कानुनी कारण के हो?', explanation: 'PPMO ले सुनुवाइ गरी निर्णय नगरेसम्म कसैलाई दोषी वा अयोग्य मान्न नपाइने वैधानिक प्रक्रिया (Due Process) र प्राकृतिक न्यायको संरक्षण गर्न यो आवश्यक छ।', options: [['due-process-and-innocent-until-proven', 'PPMO ले सुनुवाइ गरी निर्णय नगरेसम्म कसैलाई दोषी वा अयोग्य मान्न नपाइने वैधानिक प्रक्रिया (Due Process) र प्राकृतिक न्यायको संरक्षण गर्न।', 100], ['protect-bad-contractors', 'खराब काम गर्ने व्यवसायीलाई जोगाउन।', 0], ['bureaucratic-delay', 'सरकारी काम जति ढिलो भए पनि फरक नपर्ने भएर।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'court-stay-order-bid-validity',
    title: 'अदालतको अन्तरिम आदेश र बोलपत्र प्रक्रिया',
    category: 'विवाद तथा पुनरावलोकन',
    difficulty: 'उन्नत',
    estimatedMinutes: 14,
    scenario: 'पुल निर्माणको बोलपत्र मूल्याङ्कन चलिरहेको बेला एक असन्तुष्ट बोलपत्रदाताले उच्च अदालतमा रिट दायर गरी खरिद प्रक्रिया यथास्थितिमा राख्न अन्तरिम आदेश (Stay Order) ल्यायो। यसैबीच बोलपत्रको ९० दिने म्याद र बोलपत्र जमानतको म्याद समाप्त हुन १० दिन मात्र बाँकी छ। अदालतको अन्तिम फैसला आउन समय लाग्ने देखिएको छ।',
    objectives: ['अदालतको अन्तरिम आदेशको सम्मान र कार्यान्वयन बुझ्ने', 'अदालतमा विचाराधीन रहँदा बोलपत्र र जमानतको म्याद थप (Bid Validity Extension) को अनिवार्यता पहिचान गर्ने', 'म्याद गुज्रिएर खरिद स्वतः निष्प्रभावी हुनबाट जोगाउने'],
    priorKnowledge: ['अदालतको अन्तरिम आदेश र खरिद रोक्का', 'बोलपत्र ग्राह्यता अवधि (Bid Validity) र बैंक जमानतको म्याद'],
    legalReferenceIds: ['act-section-47-51', 'rules-40-66', 'pprc-decision-7'],
    questions: [
      { id: 'stay-order-action', title: 'अन्तरिम आदेशको सम्बोधन', criterion: 'decision', prompt: 'अदालतको अन्तरिम आदेश जारी भएको बेला बोलपत्रको म्याद सकिन लागेमा के गर्नुपर्छ?', explanation: 'अदालतको आदेशको सम्मान गरी प्रक्रिया रोक्का राख्ने, तर प्रक्रिया जीवित राख्न बोलपत्रदाताहरूसँग बोलपत्र र जमानतको म्याद थपको सहमति लिनुपर्छ।', options: [['extend-bid-validity-while-stayed', 'अदालतको आदेशको पूर्ण सम्मान गरी मूल्याङ्कन वा सम्झौता रोक्का राख्ने, तर प्रक्रिया जीवित राख्न बोलपत्रदाताहरूसँग बोलपत्र र जमानतको म्याद थपको सहमति लिने।', 100], ['violate-stay-order', 'अन्तरिम आदेशको बेवास्ता गर्दै हतार हतार सम्झौता गरिहाल्ने।', 0], ['let-bid-expire', 'केही नगरी चुपचाप बस्ने र बोलपत्रको म्याद गुजारेर ठेक्का स्वतः रद्द गराउने।', 0]] },
      { id: 'stay-order-law', title: 'अदालतको आदेशको कानुनी मर्यादा', criterion: 'legal-basis', prompt: 'अदालतको आदेश र खरिद कारबाही रोक्का सम्बन्धी कानुनी मर्यादा के हो?', explanation: 'अदालत वा पुनरावलोकन समितिको स्थगन आदेशको अवधिभर कुनै पनि नयाँ निर्णय गर्न पाइँदैन, आदेशको अवज्ञा अदालतको अवहेलना ठहरिन्छ।', options: [['judicial-compliance-and-act-provisions', 'संविधान र खरिद ऐन अनुसार अदालत वा पुनरावलोकन समितिको स्थगन आदेशको अवधिभर कुनै पनि नयाँ निर्णय गर्न पाइँदैन, आदेशको अवज्ञा अदालतको अवहेलना ठहरिन्छ।', 100], ['procurement-above-court', 'सार्वजनिक खरिद विकास निर्माण भएकाले अदालतको आदेश मान्न बाध्य छैन।', 0], ['cancel-tender-instantly', 'अदालतमा मुद्दा पर्नेबित्तिकै ठेक्का तुरुन्त रद्द गर्नुपर्ने नियम छ।', 0]] },
      { id: 'stay-order-process', title: 'म्याद थप प्रक्रिया', criterion: 'process', prompt: 'बोलपत्रको म्याद थप गर्दा कुन कार्यविधि अपनाउनुपर्छ?', explanation: 'बोलपत्र ग्राह्यता अवधि सकिनु अगावै सबै बोलपत्रदातालाई समान रूपमा म्याद थप गर्न अनुरोध गर्ने र बैंक जमानत नवीकरण माग गर्नुपर्छ।', options: [['request-extension-with-guarantee', 'बोलपत्र ग्राह्यता अवधि सकिनु अगावै सबै बोलपत्रदातालाई समान रूपमा म्याद थप गर्न अनुरोध गर्ने र सोही अवधिसम्मको बैंक जमानत नवीकरण माग गर्ने।', 100], ['demand-only-from-lowest', 'आफूलाई मन परेको १ जनालाई मात्र म्याद थप गर्न भन्ने।', 0], ['refuse-to-extend-guarantee', 'बैंक जमानतको म्याद सकिए पनि बोलपत्र सदर मान्ने।', 0]] },
      { id: 'stay-order-reasoning', title: 'प्रक्रिया संरक्षण', criterion: 'reasoning', prompt: 'अदालतको आदेश हुँदाहुँदै पनि बोलपत्रको म्याद थप गराउनु किन आवश्यक हुन्छ?', explanation: 'यदि अदालतबाट पछि खरिद प्रक्रिया फुकुवा भयो भने पनि बोलपत्र र जमानतको म्याद कायमै रहेमा पुनः बोलपत्र नगरी अघि बढ्न सकिन्छ।', options: [['preserve-procurement-legality', 'यदि अदालतबाट पछि खरिद प्रक्रिया फुकुवा भयो भने पनि बोलपत्र र जमानतको म्याद कायमै रहेमा पुनः बोलपत्र नगरी प्रक्रिया अघि बढाउन सकियोस्।', 100], ['earn-bank-interest', 'बैंकलाई नवीकरण शुल्क कमाइदिन।', 0], ['harass-bidders', 'बोलपत्रदातालाई अनावश्यक मुद्दामामिलामा अल्झाउन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'counter-guarantee-foreign-bank',
    title: 'विदेशी बैंक जमानत र काउन्टर ग्यारेन्टी',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'अन्तर्राष्ट्रिय प्रतिस्पर्धी बोलपत्र (ICB) मार्फत विद्युत् प्रसारण लाइन उपकरण खरिद गर्दा एक विदेशी बोलपत्रदाताले सिंगापुरको प्रतिष्ठित बैंकबाट जारी गरिएको सक्कल बोलपत्र जमानत (Bid Bond) पेश गर्‍यो। तर उक्त जमानतमा नेपालको कुनै पनि "क" वर्गको वाणिज्य बैंकले प्रति-प्रत्याभूति (Counter-Guarantee) गरेको छैन। मूल्याङ्कन समितिमा "विदेशी बैंक अन्तर्राष्ट्रिय स्तरको भएकाले सिधै मान्ने कि अयोग्य गर्ने?" भन्ने विषयमा बहस भयो।',
    objectives: ['विदेशी बैंक जमानतमा नेपाली वाणिज्य बैंकको काउन्टर ग्यारेन्टीको कानुनी अनिवार्यता बुझ्ने', 'PPMO राय नं. ८ र मानक खरिद कागजातको प्रावधान परीक्षण गर्ने', 'गैरकानुनी जमानत स्वीकार गर्दा हुने जोखिम पहिचान गर्ने'],
    priorKnowledge: ['PPMO राय नं. ८', 'विदेशी बैंक जमानत र Counter Guarantee'],
    legalReferenceIds: ['ppmo-opinion-8', 'rules-40-66', 'rules-110-119'],
    questions: [
      { id: 'counter-guarantee-action', title: 'जमानतको ग्राह्यता', criterion: 'decision', prompt: 'नेपाली वाणिज्य बैंकको काउन्टर ग्यारेन्टी नभएको विदेशी बैंक जमानतलाई के गर्ने?', explanation: 'नेपालको वाणिज्य बैंकबाट काउन्टर ग्यारेन्टी नभएको विदेशी जमानत कागजात र कानुन विपरीत हुने हुँदा सारभूत रूपमा अप्रभावग्राही मानी अस्वीकृत गर्नुपर्छ।', options: [['reject-without-counter-guarantee', 'नेपालको वाणिज्य बैंकबाट काउन्टर ग्यारेन्टी नभएको विदेशी जमानत कागजात र कानुन विपरीत हुने हुँदा सारभूत रूपमा अप्रभावग्राही (Non-responsive) ठहर गरी बोलपत्र अस्वीकृत गर्ने।', 100], ['accept-foreign-directly', 'विदेशी बैंक अन्तर्राष्ट्रिय साख भएको भएकाले कुनै काउन्टर ग्यारेन्टी नभए पनि स्वीकार गर्ने।', 0], ['allow-post-opening-submission', 'बोलपत्र खोलिसकेपछि ३ महिना समय दिएर नेपालको बैंकबाट काउन्टर ग्यारेन्टी ल्याउन लगाउने।', 0]] },
      { id: 'counter-guarantee-law', title: 'PPMO राय ८ को आधार', criterion: 'legal-basis', prompt: 'यस विषयमा सार्वजनिक खरिद निर्देशिका र PPMO को स्पष्ट राय के छ?', explanation: 'PPMO राय नं. ८ तथा मानक बोलपत्र कागजात अनुसार विदेशी बैंकबाट जारी भएको जमानत नेपालको वाणिज्य बैंकले प्रति-प्रत्याभूति गरेको हुनुपर्छ।', options: [['ppmo-opinion-8-basis', 'PPMO राय नं. ८ तथा मानक बोलपत्र कागजात अनुसार विदेशी बैंकबाट जारी भएको जमानत नेपालको वाणिज्य बैंकले प्रति-प्रत्याभूति (Counter Guarantee) गरेको हुनु अनिवार्य छ।', 100], ['any-foreign-doc-valid', 'विदेशी कम्पनीलाई नेपाली बैंकको कुनै नियम लागू हुँदैन।', 0], ['no-rule-exists', 'यस विषयमा नेपालको कानुन पूर्णतः मौन छ।', 0]] },
      { id: 'counter-guarantee-process', title: 'रुजु प्रक्रिया', criterion: 'process', prompt: 'बोलपत्र परीक्षण चरणमा जमानत रुजु गर्दा कुन प्रक्रिया पूरा गर्नुपर्छ?', explanation: 'काउन्टर ग्यारेन्टी जारी गर्ने नेपाली वाणिज्य बैंकको आधिकारिक पत्र, ढाँचा, रकम र वैधता अवधि बोलपत्र खुल्ने दिनमै कायम रहेको यकिन गर्नुपर्छ।', options: [['verify-counter-guarantee-and-swift', 'काउन्टर ग्यारेन्टी जारी गर्ने नेपाली वाणिज्य बैंकको आधिकारिक पत्र, ढाँचा, रकम र वैधता अवधि बोलपत्र खुल्ने दिनमै कायम रहेको यकिन गर्ने।', 100], ['assume-validity-by-logo', 'विदेशी बैंकको लोगो राम्रो देखिएको भरमा सदर गर्ने।', 0], ['call-after-award', 'ठेक्का स्वीकृत भइसकेपछि मात्र जमानत हेर्ने।', 0]] },
      { id: 'counter-guarantee-reasoning', title: 'असुली सुनिश्चितता', criterion: 'reasoning', prompt: 'विदेशी जमानतमा नेपालको बैंकबाट काउन्टर ग्यारेन्टी अनिवार्य गर्नुको प्रमुख कारण के हो?', explanation: 'जमानत जफत गर्नुपर्ने अवस्था आएमा विदेशी क्षेत्राधिकारमा गई मुद्दा लड्न असम्भव प्रायः हुने हुँदा नेपालभित्रै तुरुन्त भुक्तानी सुनिश्चित गर्न यो अनिवार्य गरिएको हो।', options: [['enforceability-and-jurisdiction', 'बोलपत्रदाताले सम्झौता नगरेमा वा जमानत जफत गर्नुपर्ने अवस्था आएमा विदेशी क्षेत्राधिकारमा गई मुद्दा लड्न असम्भव प्रायः हुने हुँदा नेपालभित्रै तुरुन्त भुक्तानी सुनिश्चित गर्न।', 100], ['bank-monopoly', 'नेपाली बैंकहरूलाई कमिसन दिलाउन मात्र सिर्जना गरिएको प्रावधान हो।', 0], ['discourage-foreigners', 'विदेशी कम्पनीहरूलाई नेपाल आउन नदिन।', 0]] },
    ],
  }),
  createScenarioCase({
    caseKey: 'minor-deviations-vs-major-rejection',
    title: 'सानातिना फरक (Minor Deviations) र बोलपत्र सारभूतता',
    category: 'बोलपत्र परीक्षण तथा मूल्याङ्कन',
    difficulty: 'मध्यम',
    estimatedMinutes: 12,
    scenario: 'सडक कालोपत्रे खरिदमा न्यूनतम कबोल गर्ने निर्माण व्यवसायीले सबै प्राविधिक योग्यता, यन्त्र उपकरण, वित्तीय क्षमता र जमानत पेश गर्‍यो। तर बोलपत्रको खण्ड "क" मा डकुमेन्ट सर्पिल बाइन्डिङ गर्नुपर्ने निर्देशिकाको साधारण शर्त थियो, उसले स्ट्यापलर र फाइल कभरमा पेश गर्‍यो; साथै १०० पानामध्ये २ वटा सामान्य पानामा पृष्ठ नम्बर (Page number) छुटेको छ। मूल्याङ्कन समितिका एक सदस्यले "शर्त अक्षरशः पूरा नभएकाले बोलपत्र पूर्णतः अस्वीकृत गर्नुपर्छ" भन्ने अडान लिए।',
    objectives: ['सारभूत फरक (Material Deviation) र सानातिना फरक (Minor Deviation) बीचको भेद छुट्याउने', 'PPMO राय नं. ४९ र दफा २३ अनुसार सानातिना फरक ग्राह्य हुने सिद्धान्त बुझ्ने', 'सामान्य औपचारिकताको नाममा स्वस्थ प्रतिस्पर्धा र न्यूनतम दर गुम्न नदिने'],
    priorKnowledge: ['PPMO राय नं. ४९', 'सारभूत प्रभावकारिता (Substantial Responsiveness)'],
    legalReferenceIds: ['ppmo-opinion-49', 'rules-40-66', 'pprc-decision-18'],
    questions: [
      { id: 'minor-dev-action', title: 'सारभूतताको मूल्याङ्कन', criterion: 'decision', prompt: 'डकुमेन्ट बाइन्डिङ वा सामान्य पृष्ठ नम्बरिङ नभएको तर मुख्य योग्यता पूरा भएको बोलपत्रलाई के गर्ने?', explanation: 'यस्तो फरकले कामको गुणस्तर वा प्रतिस्पर्धामा असर नपार्ने सानातिना फरक (Minor Deviation) भएकाले बोलपत्रलाई प्रभावग्राही मानी मूल्याङ्कनमा समावेश गर्नुपर्छ।', options: [['accept-as-minor-deviation', 'यस्तो फरकले कामको गुणस्तर, दायरा वा प्रतिस्पर्धामा कुनै गम्भीर असर नपार्ने सानातिना फरक (Minor Deviation) भएकाले बोलपत्रलाई सारभूत रूपमा प्रभावग्राही मानी मूल्याङ्कनमा समावेश गर्ने।', 100], ['reject-strictly', 'निर्देशिकाको अक्षरशः पालना नभएको भन्दै तुरुन्त गैर-प्रभावग्राही ठहर गरी अस्वीकृत गर्ने।', 0], ['charge-fine', 'बाइन्डिङ नगरेबापत रु. ५० हजार नगद जरिवाना तिराएर मात्र स्वीकार गर्ने।', 0]] },
      { id: 'minor-dev-law', title: 'PPMO राय ४९ को आधार', criterion: 'legal-basis', prompt: 'सानातिना फरक सम्बन्धी सार्वजनिक खरिद कानुन र PPMO रायको आधार के हो?', explanation: 'PPMO राय नं. ४९ तथा खरिद कानुन अनुसार बोलपत्रको सारभूत आवश्यकतामा तात्विक असर नपर्ने सानातिना फरकलाई छुट दिई प्रभावग्राही मान्न सकिन्छ।', options: [['ppmo-opinion-49-and-act', 'PPMO राय नं. ४९ तथा खरिद कानुन अनुसार बोलपत्रको सारभूत आवश्यकतामा तात्विक असर नपर्ने सानातिना फरक (Non-material / Minor Deviations) लाई छुट दिई प्रभावग्राही मान्न सकिन्छ।', 100], ['zero-tolerance-rule', 'कानुनमा सानोभन्दा सानो त्रुटी भए पनि सिधै खारेज गर्नैपर्ने कडा नियम छ।', 0], ['no-legal-reference', 'कानुनमा यससम्बन्धी कुनै व्यवस्था छैन, सबै मूल्याङ्कनकर्ताको मुडमा भर पर्छ।', 0]] },
      { id: 'minor-dev-process', title: 'प्रतिवेदन अभिलेख', criterion: 'process', prompt: 'सानातिना फरक स्वीकार गर्दा मूल्याङ्कन समितिले कुन प्रक्रिया अपनाउनुपर्छ?', explanation: 'उक्त फरकले मूल्य, गुणस्तर र कार्यसम्पादनमा कुनै प्रतिकूल प्रभाव नपार्ने विश्लेषण प्रतिवेदनमा अभिलेख गर्नुपर्छ।', options: [['record-clarification-without-price-change', 'उक्त फरकले मूल्य, गुणस्तर र कार्यसम्पादनमा कुनै प्रतिकूल प्रभाव नपार्ने स्पष्ट विश्लेषण प्रतिवेदनमा अभिलेख गर्ने र आवश्यक भए सामान्य स्पष्टीकरण मात्र माग गर्ने।', 100], ['change-bid-rates', 'स्पष्टीकरणको बहानामा दर घटाउन वा बढाउन लगाउने।', 0], ['keep-unrecorded', 'फाइलमा केही नलेखी गुपचुप स्वीकार गर्ने।', 0]] },
      { id: 'minor-dev-reasoning', title: 'प्रतिस्पर्धाको संरक्षण', criterion: 'reasoning', prompt: 'सानातिना औपचारिकताका आधारमा बोलपत्र रद्द नगर्नु किन महत्त्वपूर्ण छ?', explanation: 'अनावश्यक प्राविधिक बहाना बनाएर कम कबोल गर्ने उपयुक्त बोलपत्रदातालाई पाखा लगाउने र महँगो दरमा ठेक्का गर्न बाध्य पार्ने विकृति रोक्न यो सिद्धान्त महत्त्वपूर्ण छ।', options: [['protect-healthy-competition-and-public-funds', 'अनावश्यक प्राविधिक बहाना बनाएर कम कबोल गर्ने उपयुक्त बोलपत्रदातालाई पाखा लगाउने र राज्यलाई महँगो दरमा ठेक्का गर्न बाध्य पार्ने विकृति रोक्न।', 100], ['bidders-laziness', 'बोलपत्रदाताहरूलाई लापरवाह बनाउन।', 0], ['speed-up-evaluation', 'कागजात नै नहेरी छिटो मूल्याङ्कन टुङ्ग्याउन।', 0]] },
    ],
  }),
];

export const PRACTICAL_SIMULATION_CASES: SimulationCaseVersion[] = [
  ...CORE_SIMULATION_CASES,
  ...ADDITIONAL_SIMULATION_CASES,
];

export const SIMULATION_CASES_BY_KEY = new Map(
  PRACTICAL_SIMULATION_CASES.map((simulationCase) => [simulationCase.caseKey, simulationCase]),
);

export const SIMULATION_SECTION_TO_TAB = {
  dashboard: 'simulation-dashboard',
  cases: 'simulation-cases',
  progress: 'simulation-progress',
  reports: 'simulation-reports',
  certificates: 'simulation-certificates',
  legal: 'simulation-legal',
  'case-management': 'simulation-case-management',
} as const;
