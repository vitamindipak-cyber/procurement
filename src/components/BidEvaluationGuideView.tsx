import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gavel,
  Info,
  Scale,
  ShieldAlert,
  Target,
} from 'lucide-react';

interface BidEvaluationGuideViewProps {
  onNavigateToLaw?: () => void;
  onNavigateToChecklists?: () => void;
}

const evaluationSteps = [
  {
    title: '१. प्राप्ति र म्याद जाँच',
    description: 'दर्ता अभिलेखबाट बोलपत्र अन्तिम म्यादभित्र प्राप्त भएको हो कि होइन रुजु गर्नुहोस्।',
    legalRef: 'नियम ५६, ५८; ऐन दफा २२',
  },
  {
    title: '२. सार्वजनिक रूपमा खोल्ने',
    description: 'तोकिएको समय र स्थानमा बोलपत्र खोल्नुहोस्, उपस्थित प्रतिनिधिको विवरण र कबोल रकम अभिलेख गरी मुचुल्का तयार गर्नुहोस्। प्रतिनिधि अनुपस्थित भए पनि खोल्ने काम रोकिन्न।',
    legalRef: 'नियम ५९',
  },
  {
    title: '३. पूर्णता र योग्यता परीक्षण',
    description: 'हस्ताक्षर/अख्तियारनामा, बोलपत्र जमानत, आवश्यक कागजात, योग्यता र सारभूत शर्त जाँच्नुहोस्। सच्याउन मिल्ने त्रुटि वा सारभूत त्रुटि छुट्याउँदा ऐन, नियम र बोलपत्र कागजात पालना गर्नुहोस्।',
    legalRef: 'ऐन दफा २३; नियम ६०',
  },
  {
    title: '४. प्राविधिक मूल्याङ्कन',
    description: 'माग गरिएको काम, परिमाण, स्पेसिफिकेसन, गुणस्तर र कार्यसम्पादनको प्रस्तावित विवरण बोलपत्र कागजातसँग मिलाउनुहोस्।',
    legalRef: 'ऐन दफा २५(५); नियम ६२',
  },
  {
    title: '५. व्यापारिक मूल्याङ्कन',
    description: 'आपूर्ति/सम्पन्न गर्ने अवधि, भुक्तानी, वारेन्टी, दायित्व र सम्झौताका शर्तमा प्रस्तावले तोकिएका आधार पूरा गर्छ कि गर्दैन जाँच्नुहोस्।',
    legalRef: 'नियम ६३',
  },
  {
    title: '६. आर्थिक मूल्याङ्कन',
    description: 'कबोल रकम, छुट, कर, ढुवानी तथा बोलपत्र कागजातले अनुमति दिएका मूल्य समायोजन मात्र तुलना गर्नुहोस्। मूल्याङ्कनका लागि निकालिएको रकम सम्झौता रकममा स्वतः थपिँदैन।',
    legalRef: 'नियम ६४; ऐन दफा २५',
  },
  {
    title: '७. छनोट विधि र योग्यता पुष्टि',
    description: 'सारभूत रूपमा प्रभावग्राही बोलपत्रहरूलाई प्रकाशित मूल्याङ्कन विधिअनुसार तुलना गरी आवश्यक योग्यता पुष्टि गर्नुहोस्। लागू हुने खरिदमा औसत मूल्यसँगको निकटता वा ३०% भन्दा बढी कम कबोलसम्बन्धी संशोधित व्यवस्था पनि जाँच्नुहोस्।',
    legalRef: 'ऐन दफा २५(५क), (७क), (७ख); लागू नियम/SBD',
  },
  {
    title: '८. कारणसहित प्रतिवेदन',
    description: 'परीक्षण, तुलना, मूल्य समायोजन, अस्वीकृतिका कारण र छनोट सिफारिस प्रमाणित अभिलेखसहित प्रतिवेदनमा खुलाउनुहोस्।',
    legalRef: 'ऐन दफा २५(८); नियम ६५ग',
  },
  {
    title: '९. स्वीकृति, सूचना र सम्झौता',
    description: 'समितिको सिफारिस अधिकारप्राप्त अधिकारीसमक्ष पेश हुन्छ। स्वीकृति/अस्वीकृति, आशयको सूचना, पुनरावलोकन र सम्झौताको प्रक्रिया लागू कानून र म्यादअनुसार अघि बढाउनुहोस्।',
    legalRef: 'ऐन दफा २६–२७, ४७–५०',
  },
];

const evaluationLenses = [
  {
    title: 'प्राविधिक',
    question: 'प्रस्तावले चाहिएको वस्तु, काम वा सेवाको आवश्यकता पूरा गर्छ?',
    examples: 'स्पेसिफिकेसन, परिमाण, गुणस्तर, कार्यसम्पादन र प्रस्तावित प्राविधिक विचलन।',
    legalRef: 'नियम ६२',
    icon: Target,
    color: 'blue',
  },
  {
    title: 'व्यापारिक',
    question: 'प्रस्तावका व्यावसायिक शर्तहरू बोलपत्र कागजातसँग मिल्छन्?',
    examples: 'आपूर्ति/सम्पन्न अवधि, भुक्तानी, वारेन्टी, कार्यसम्पादन र सम्झौताका शर्त।',
    legalRef: 'नियम ६३',
    icon: FileCheck2,
    color: 'violet',
  },
  {
    title: 'आर्थिक',
    question: 'कागजातमा तोकिएको तरिकाले तुलना गर्दा मूल्य कति हुन्छ?',
    examples: 'कबोल रकम, छुट, कर र अनुमति दिइएका लागत समायोजन।',
    legalRef: 'नियम ६४',
    icon: Scale,
    color: 'emerald',
  },
];

const officeChecklist = [
  'मूल्याङ्कनका आधार र विधि बोलपत्र कागजातमै छन् र सबै प्रस्तावमा समान रूपमा प्रयोग गरिएका छन्।',
  'खोल्ने मुचुल्का, दर्ता विवरण र बोलपत्र परीक्षणका प्रमाण सुरक्षित छन्।',
  'प्राविधिक, व्यापारिक र आर्थिक निष्कर्ष तथा मूल्य समायोजनको आधार छुट्टाछुट्टै देखाइएको छ।',
  'अस्वीकृत बोलपत्रको कारण र छानिएको विधि प्रतिवेदनमा स्पष्ट छ।',
  'समितिको प्रतिवेदन, स्वीकृति निर्णय, आशयको सूचना र सम्झौतासम्बन्धी कागजात फाइलमा छन्।',
];

const recordsToKeep = [
  'बोलपत्र आह्वान सूचना, स्वीकृत बोलपत्र कागजात र लागू संशोधन/स्पष्टीकरण',
  'बोलपत्र दर्ता किताब, प्राप्ति समय र खोल्ने मुचुल्का',
  'प्रस्ताव, जमानत, योग्यता तथा पूर्णता परीक्षणका कार्यपत्र',
  'प्राविधिक, व्यापारिक र आर्थिक तुलना तथा मूल्य समायोजनको आधार',
  'मूल्याङ्कन समितिको प्रतिवेदन र अधिकारप्राप्त अधिकारीको निर्णय',
  'आशयको सूचना, प्राप्त उजुरी/पुनरावलोकन र त्यससम्बन्धी निर्णय',
  'सम्झौता, कार्यसम्पादन जमानत र स्वीकृति पछिका पत्राचार',
];

export const BidEvaluationGuideView: React.FC<BidEvaluationGuideViewProps> = ({
  onNavigateToLaw,
  onNavigateToChecklists,
}) => (
  <div className="space-y-6">
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="bg-gradient-to-r from-[#173b63] to-blue-800 px-5 py-6 text-white sm:px-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
          <Gavel className="h-4 w-4" />
          <span>सरल भाषा · कानुनी आधार · व्यवहारिक चरण</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">बोलपत्र मूल्याङ्कन गाइड</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-blue-50">
          बोलपत्र खोलिएपछि कुन प्रस्ताव कसरी जाँचिन्छ, न्यूनतम कबोल मात्र किन पर्याप्त हुँदैन,
          र मूल्याङ्कन समितिको सिफारिसपछि के हुन्छ भन्ने चरणबद्ध जानकारी।
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {onNavigateToLaw && (
            <button
              onClick={onNavigateToLaw}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-blue-900 hover:bg-blue-50"
            >
              <BookOpen className="h-4 w-4" />
              ऐन/नियमको पाठ हेर्नुहोस्
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          {onNavigateToChecklists && (
            <button
              onClick={onNavigateToChecklists}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10"
            >
              <ClipboardList className="h-4 w-4" />
              कार्यालय चेकलिस्ट खोल्नुहोस्
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-bold text-blue-900">कानुनी आधार</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-700">ऐन दफा २२–२७; नियम ५९–६५ र लागू संशोधित नियमहरू।</p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
          <p className="text-xs font-bold text-violet-900">मुख्य सिद्धान्त</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-700">सबै प्रस्तावलाई पहिले नै प्रकाशित मापदण्ड र समान विधिबाट जाँच्ने।</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-xs font-bold text-amber-900">याद गर्नुहोस्</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-700">सबैभन्दा कम कबोल रकमले मात्र स्वतः छनोट सुनिश्चित गर्दैन।</p>
        </div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-700" />
        <h3 className="text-lg font-bold text-slate-900">कानुनी व्यवस्था: दफा/नियम र सरल अर्थ</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="px-3 py-2.5 font-bold">विषय</th>
              <th className="px-3 py-2.5 font-bold">कानुनी आधार</th>
              <th className="px-3 py-2.5 font-bold">सरल अर्थ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="px-3 py-3 font-semibold">खोल्ने र प्रारम्भिक परीक्षण</td>
              <td className="px-3 py-3 font-mono">ऐन दफा २२–२३; नियम ५९–६०</td>
              <td className="px-3 py-3">म्याद, खोल्ने प्रक्रिया, कागजात, जमानत र योग्यता रुजु गर्ने।</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-semibold">मूल्याङ्कन र तुलना</td>
              <td className="px-3 py-3 font-mono">ऐन दफा २५; नियम ६१–६५</td>
              <td className="px-3 py-3">बोलपत्र कागजातमा तोकिएका आधारमा प्राविधिक, व्यापारिक र आर्थिक पक्ष जाँच्ने।</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-semibold">संशोधित छनोट व्यवस्था</td>
              <td className="px-3 py-3 font-mono">ऐन दफा २५(५क), (७क), (७ख); लागू नियम/SBD</td>
              <td className="px-3 py-3">सम्बन्धित खरिदमा औसत कबोलसँगको निकटता र लागत अनुमानभन्दा ३०% भन्दा बढी कम कबोलको व्यवस्था जाँच्ने।</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-semibold">प्रतिवेदन र निर्णय</td>
              <td className="px-3 py-3 font-mono">ऐन दफा २५(८), २६–२७; नियम ६५ग</td>
              <td className="px-3 py-3">समितिले आधारसहित प्रतिवेदन दिन्छ; अधिकारप्राप्त अधिकारीले स्वीकृति/अन्य निर्णय गर्छ।</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-semibold">उजुरी तथा पुनरावलोकन</td>
              <td className="px-3 py-3 font-mono">ऐन दफा ४७–५०</td>
              <td className="px-3 py-3">कानूनले तोकेको पक्ष, निकाय र समयसीमाभित्र निर्णय चुनौती दिन सकिन्छ।</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          संशोधनबाट थपिएका छनोट सूत्र वा सीमाहरू सबै खरिदमा एउटै रूपमा लागू हुँदैनन्।
          सम्बन्धित खरिद विधि, पछिल्लो राजपत्रित ऐन/नियम र स्वीकृत बोलपत्र कागजात (SBD) सँग दफा
          तथा नियम रुजु गर्नुहोस्।
        </p>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
        <h3 className="text-lg font-bold text-slate-900">मूल्याङ्कन प्रक्रिया: चरणबद्ध कार्यविधि</h3>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2">
        {evaluationSteps.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-xl border border-slate-200 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-800">
              {index + 1}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.description}</p>
              <p className="mt-2 text-[11px] font-semibold text-blue-800">{step.legalRef}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <h3 className="text-lg font-bold text-slate-900">तीन मूल्याङ्कनबीचको फरक</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {evaluationLenses.map((lens) => {
          const Icon = lens.icon;
          const colorClasses = {
            blue: 'border-blue-200 bg-blue-50 text-blue-800',
            violet: 'border-violet-200 bg-violet-50 text-violet-800',
            emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
          }[lens.color];
          return (
            <article key={lens.title} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-lg border p-2 ${colorClasses}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">{lens.title}</h4>
                <span className="ml-auto text-[10px] font-semibold text-slate-500">{lens.legalRef}</span>
              </div>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-800">{lens.question}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{lens.examples}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-bold text-slate-900">निर्माण कार्यमा थप जाँच</h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          कार्ययोजना, कार्यतालिका, BOQ का परिमाण/एकाइ दर, असन्तुलित वा सुरुका काममा बढी केन्द्रित
          दर र कार्यसम्पादन क्षमताको परीक्षण गर्नुहोस्। दर असन्तुलित देखिनु मात्रै अस्वीकृतिको
          आधार होइन; सम्बन्धित नियम र बोलपत्र कागजातअनुसार कारणसहित विश्लेषण хийнэ।
        </p>
        <p className="mt-2 text-[11px] font-semibold text-blue-800">नियम ६५ तथा लागू SBD</p>
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-700" />
          <h3 className="text-lg font-bold text-slate-900">उदाहरण: कम कबोल सधैँ छनोट हुँदैन</h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          १०० компьютер худалдан авахад техникийн шаардлага पूरा गरेको эсэхийг मूल्यसँगै हेर्नुहोस्।
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-3">बोलपत्रदाता</th>
                <th className="py-2 pr-3">कबोल</th>
                <th className="py-2 pr-3">आवश्यक स्पेसिफिकेसन</th>
                <th className="py-2">अर्को कदम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr><td className="py-2 pr-3 font-semibold">A</td><td className="py-2 pr-3">रु. ४५ लाख</td><td className="py-2 pr-3">पूरा</td><td className="py-2">तुलनामा समावेश</td></tr>
              <tr><td className="py-2 pr-3 font-semibold">B</td><td className="py-2 pr-3">रु. ४२ लाख</td><td className="py-2 pr-3">पूरा</td><td className="py-2">तोकिएको विधिबाट तुलना</td></tr>
              <tr><td className="py-2 pr-3 font-semibold">C</td><td className="py-2 pr-3">रु. ४० लाख</td><td className="py-2 pr-3">पूरा छैन</td><td className="py-2">कानुन/कागजातअनुसार निर्णय</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-700">
          C को रकम सबैभन्दा कम भए पनि आधारभूत प्राविधिक आवश्यकता नपुगेको कारण त्यसलाई स्वतः
          छनोट गर्न मिल्दैन। A र B मध्ये सिफारिस गर्दा पनि लागू मूल्याङ्कन विधि र योग्यता जाँच
          पूरा हुनुपर्छ।
        </p>
      </article>

      <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-700" />
          <h3 className="text-lg font-bold text-slate-900">सानातिना फरक: रकमको प्रभाव बुझ्नुहोस्</h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          ऐन दफा २५(२)–(३) अनुसार अस्वीकार गर्नुपर्ने नभएको सानातिना प्राविधिक फरकको मूल्य
          सम्भव भए निकालेर तुलना गर्न सकिन्छ। त्यस्तो मूल्य बोल रकमको १५% भन्दा बढी भए बोलपत्र
          सारभूत रूपमा अप्रभावग्राही मानिने व्यवस्था छ।
        </p>
        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <p className="text-xs font-bold text-blue-950">उदाहरण</p>
          <p className="mt-1 text-xs text-slate-700">बोल रकम रु. ५० लाख; सानातिना फरकको मूल्य रु. २ लाख।</p>
          <p className="mt-2 font-mono text-sm font-bold text-blue-900">२ लाख ÷ ५० लाख × १०० = ४%</p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-700">
          १५% भन्दा कम हुनु मात्रै स्वीकृतिको प्रमाण होइन। बोलपत्रका अन्य आधारभूत शर्त, स्पष्टिकरण
          र लागू कानून पनि जाँच्नुपर्छ।
        </p>
      </article>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-indigo-700" />
          <h3 className="text-lg font-bold text-slate-900">समिति र निर्णय अधिकारीको भूमिका</h3>
        </div>
        <div className="mt-4 space-y-3 text-xs leading-relaxed">
          <div className="rounded-lg bg-indigo-50 p-3">
            <p className="font-bold text-indigo-950">मूल्याङ्कन समिति</p>
            <p className="mt-1 text-slate-700">परीक्षण, समान आधारमा तुलना, कारण अभिलेख, санал/सिफारिस र प्रतिवेदन तयार गर्छ।</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="font-bold text-slate-900">अधिकारप्राप्त अधिकारी</p>
            <p className="mt-1 text-slate-700">समितिको प्रतिवेदन र कानुनी प्रक्रिया जाँचан, स्वीकृति वा अन्य निर्णय गर्छ र त्यसपछि सम्झौता प्रक्रिया अघि बढाउँछ।</p>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-600">कानुनी आधार: ऐन दफा २५(८), २६–२७; नियम १४७</p>
      </article>

      <article className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-700" />
          <h3 className="text-lg font-bold text-slate-900">अस्वीकृति र पुनरावलोकन</h3>
        </div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-slate-700">
          <li>अयोग्यता, सारभूत रूपमा प्रभावग्राही नहुनु वा आवश्यक शर्त नपुग्नु जस्ता कारण कानून र बोलपत्र कागजातसँग जोडेर खुलाउनुहोस्।</li>
          <li>प्रत्येक सानो त्रुटि स्वतः अस्वीकृतिको कारण हुँदैन; सुधार/स्पष्टीकरणको सीमा ऐन, नियम र SBD ले निर्धारण गर्छ।</li>
          <li>चित्त नबुझेमा बोलपत्रदाताले दफा ४७–५० बमोजिम तोकिएको निकाय, आधार र समयसीमाभित्र पुनरावलोकन माग्न सक्छ।</li>
        </ul>
        <p className="mt-3 text-[11px] font-semibold text-rose-800">समयसीमा, निकाय र प्रक्रिया सम्बन्धित अद्यावधिक कानूनबाट रुजु गर्नुहोस्।</p>
      </article>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-emerald-700" />
          <h3 className="text-lg font-bold text-slate-900">कार्यालय Checklist</h3>
        </div>
        <ul className="mt-4 space-y-3">
          {officeChecklist.map((item) => (
            <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              {item}
            </li>
          ))}
        </ul>
        {onNavigateToChecklists && (
          <button
            onClick={onNavigateToChecklists}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            एकीकृत चेकलिस्टमा जानुहोस् <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">फाइलमा राख्ने मुख्य कागजात</h3>
        </div>
        <ul className="mt-4 space-y-2.5">
          {recordsToKeep.map((item) => (
            <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-slate-700">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>

    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
      यो पृष्ठ सामान्य बुझाइका लागि तयार गरिएको सारांश हो, कानुनी सल्लाह वा बोलपत्र कागजातको
      विकल्प होइन। संशोधित ऐन/नियम, लागू SBD र सम्बन्धित खरिदको स्वीकृत कागजातलाई अन्तिम आधार
      मान्नुहोस्।
    </aside>
  </div>
);
