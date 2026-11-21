import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Search, XCircle } from 'lucide-react';
import { verifySimulationCertificate } from '../lib/supabaseApi';
import { isSupabaseConfigured } from '../lib/supabase';
import { SimulationCertificateVerification } from '../types/simulation';

interface SimulationCertificateVerificationPageProps {
  initialCode?: string;
}

export const SimulationCertificateVerificationPage: React.FC<SimulationCertificateVerificationPageProps> = ({
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<SimulationCertificateVerification | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateCodeFromHash = () => {
      if (window.location.hash.startsWith('#simulation-verify')) {
        setCode(window.location.hash.split(':').slice(1).join(':'));
        setResult(null);
      }
    };
    window.addEventListener('hashchange', updateCodeFromHash);
    return () => window.removeEventListener('hashchange', updateCodeFromHash);
  }, []);

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setError('प्रमाणपत्र कोड लेख्नुहोस्।');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await verifySimulationCertificate(normalizedCode));
    } catch (verificationError) {
      setError(verificationError instanceof Error
        ? verificationError.message
        : 'प्रमाणपत्र प्रमाणीकरण गर्न सकिएन।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f4fa] p-4 sm:p-8">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#123f6d]">
          <Award className="h-6 w-6" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#176b70]">Practical Simulation Lab</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">प्रमाणपत्र प्रमाणीकरण</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">प्रमाणपत्रमा उल्लेखित अद्वितीय कोड राखेर यसको अवस्था जाँच्नुहोस्।</p>

        <form onSubmit={(event) => void verify(event)} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="simulation-certificate-code">प्रमाणपत्र कोड</label>
          <input
            id="simulation-certificate-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="प्रमाणपत्र कोड"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#176b70] focus:ring-2 focus:ring-emerald-100"
          />
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123f6d] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
            <Search className="h-4 w-4" />
            {loading ? 'जाँच हुँदैछ...' : 'जाँच्नुहोस्'}
          </button>
        </form>

        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {result && (
          <div className={`mt-5 rounded-2xl border p-4 ${result.valid ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`} aria-live="polite">
            <div className="flex items-center gap-2">
              {result.valid
                ? <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                : <XCircle className="h-5 w-5 text-amber-700" />}
              <h2 className={`font-bold ${result.valid ? 'text-emerald-950' : 'text-amber-950'}`}>
                {result.isSample
                  ? 'स्थानीय नमुना — आधिकारिक पुष्टि हुँदैन'
                  : result.valid ? 'प्रमाणपत्र मान्य छ'
                    : result.status === 'revoked' ? 'प्रमाणपत्र रद्द गरिएको छ' : 'प्रमाणपत्र पुष्टि भएन'}
              </h2>
            </div>
            {(result.valid || result.status === 'revoked' || result.isSample) && (
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-slate-600">कोड</dt><dd className="break-all font-medium text-slate-900">{result.code}</dd>
                <dt className="text-slate-600">अभ्यास</dt><dd className="font-medium text-slate-900">{result.caseTitle}</dd>
                <dt className="text-slate-600">स्कोर</dt><dd className="font-medium text-slate-900">{result.score}/100</dd>
                <dt className="text-slate-600">जारी मिति</dt><dd className="font-medium text-slate-900">{result.issuedAt ? new Date(result.issuedAt).toLocaleDateString('ne-NP') : '—'}</dd>
                {result.status === 'revoked' && <><dt className="text-slate-600">अवस्था</dt><dd className="font-bold text-red-700">रद्द गरिएको</dd></>}
              </dl>
            )}
          </div>
        )}
        {!isSupabaseConfigured && (
          <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            यो build मा Supabase जोडिएको छैन। स्थानीय नमुना प्रमाणपत्रहरू सार्वजनिक प्रमाणिकरणयोग्य हुँदैनन्।
          </p>
        )}
        <p className="mt-6 text-xs leading-5 text-slate-500">यो सेवा प्रमाणपत्रको अभिलेख मात्र जाँच्छ; अभ्यास स्कोर वा सहभागीको अन्य विवरण प्रमाणित गर्दैन।</p>
      </section>
    </main>
  );
};
