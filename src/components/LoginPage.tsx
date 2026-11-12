import React, { useState } from 'react';
import { Building2, Eye, EyeOff, HardHat, LockKeyhole, LogIn, Scale, ShieldCheck, ArrowRight } from 'lucide-react';

const loginBackground = new URL('../../loginImage.jpeg', import.meta.url).href;

interface LoginPageProps {
  errorMessage?: string;
  onLogin: (username: string, password: string) => Promise<void>;
  onSignUp: (username: string, email: string, password: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ errorMessage, onLogin, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [email, setEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'लगइन असफल भयो। पुनः प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      const confirmationRequired = await onSignUp(signUpUsername, email, signUpPassword);
      if (confirmationRequired) {
        setNotice('तपाईंको इमेलमा verification link पठाइएको छ। इमेल verify गरेपछि आफ्नो इमेल र पासवर्डबाट लगइन गर्नुहोस्।');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'खाता बनाउन सकिएन। पुनः प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (toSignUp: boolean) => {
    setIsSignUp(toSignUp);
    setError('');
    setNotice('');
  };

  /* ── Shared input classes ─────────────────────────────────────────── */
  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white';

  return (
    <main
      className="login-screen relative flex min-h-screen items-center bg-cover bg-center px-4 py-10 sm:px-10 lg:px-16"
      style={{ backgroundImage: `url("${loginBackground}")` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#06111f]/90 via-[#0b1e38]/75 to-[#0b1e38]/30" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">

        {/* ── Left: hero text ───────────────────────────────────────────── */}
        <div className="hidden max-w-xl text-white lg:block">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-xl font-bold backdrop-blur-sm shadow-lg">
              ख
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">सार्वजनिक खरिद सहयोगी</div>
              <div className="text-[11px] text-blue-200/70 mt-0.5 uppercase tracking-widest">खरिद प्रक्रिया गाइड</div>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-300/80 mb-4">
            सजिलो · पारदर्शी · कानुनसम्मत
          </p>
          <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight xl:text-[2.75rem]">
            सार्वजनिक खरिद<br />प्रक्रियाको पूर्ण<br />व्यावहारिक गाइड।
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-blue-50/75">
            सार्वजनिक निकाय र बोलपत्रदाता दुवैका लागि ऐन २०६३ तथा नियमावली २०६४
            (१६औँ संशोधन) मा आधारित चरणबद्ध जानकारी, क्याल्कुलेटर र कागजात सहयोग।
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4 backdrop-blur-sm">
              <Building2 className="h-5 w-5 text-sky-300" />
              <p className="mt-2.5 text-sm font-bold">सार्वजनिक निकाय</p>
              <p className="mt-1 text-xs leading-relaxed text-blue-100/70">
                विधि छनोट, ७ चरण, मूल्याङ्कन समिति र अनुपालन चेकलिस्ट।
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4 backdrop-blur-sm">
              <HardHat className="h-5 w-5 text-teal-300" />
              <p className="mt-2.5 text-sm font-bold">बोलपत्रदाता</p>
              <p className="mt-1 text-xs leading-relaxed text-blue-100/70">
                योग्यता जाँच, फाराम, e-GP दाखिला र पुनरावलोकन बाटो।
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-xs text-blue-100/60">
            <span className="inline-flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> ऐन · नियम · SBD</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> १६औँ संशोधन समावेश</span>
          </div>
        </div>

        {/* ── Right: auth card ──────────────────────────────────────────── */}
        <section className="w-full rounded-3xl bg-white/[.97] border border-white/60 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-md sm:p-9">

          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#1a4b82] text-lg font-bold text-white shrink-0">ख</div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight">सार्वजनिक खरिद सहयोगी</div>
              <div className="text-[11px] text-slate-400">खरिद प्रक्रिया गाइड</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-7">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              लगइन
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              खाता बनाउनुहोस्
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <LockKeyhole className="h-4.5 w-4.5 text-[#1a4b82]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {isSignUp ? 'नयाँ खाता बनाउनुहोस्' : 'स्वागत छ'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isSignUp
                ? 'इमेल verify गरेपछि आफ्नो खातामा लगइन गर्न सक्नुहुन्छ।'
                : 'आफ्नो लगइन विवरण प्रविष्ट गर्नुहोस्।'}
            </p>
          </div>

          {/* ─── Sign-up form ──────────────────────────────────────────── */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="su-username" className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  प्रयोगकर्ता नाम
                </label>
                <input
                  id="su-username" name="username" type="text"
                  autoComplete="username" minLength={3} maxLength={32}
                  pattern="[a-zA-Z0-9._-]+"
                  title="३ देखि ३२ अक्षर: अंग्रेजी अक्षर, अंक, डट, ड्यास वा अन्डरस्कोर"
                  value={signUpUsername}
                  onChange={(e) => { setSignUpUsername(e.target.value); setError(''); }}
                  className={inputCls} required
                  placeholder="yourname"
                />
              </div>

              <div>
                <label htmlFor="su-email" className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  इमेल ठेगाना
                </label>
                <input
                  id="su-email" name="email" type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={inputCls} required
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="su-password" className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  पासवर्ड (कम्तीमा ८ अक्षर)
                </label>
                <div className="relative">
                  <input
                    id="su-password" name="new-password"
                    type={showSignUpPassword ? 'text' : 'password'}
                    autoComplete="new-password" minLength={8}
                    value={signUpPassword}
                    onChange={(e) => { setSignUpPassword(e.target.value); setError(''); }}
                    className={inputCls + ' pr-11'} required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600"
                    aria-label={showSignUpPassword ? 'पासवर्ड लुकाउनुहोस्' : 'पासवर्ड देखाउनुहोस्'}
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={isSubmitting}
                className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1a4b82] hover:bg-[#15396a] px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-60 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> खाता बनाउँदैछ...</>
                ) : (
                  <><ArrowRight className="h-4 w-4" /> खाता बनाउनुहोस्</>
                )}
              </button>
            </form>

          ) : (
            /* ─── Login form ────────────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-username" className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  प्रयोगकर्ता नाम वा इमेल
                </label>
                <input
                  id="login-username" name="username" type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className={inputCls} required
                  placeholder="username वा email"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  पासवर्ड
                </label>
                <div className="relative">
                  <input
                    id="login-password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className={inputCls + ' pr-11'} required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'पासवर्ड लुकाउनुहोस्' : 'पासवर्ड देखाउनुहोस्'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {(error || errorMessage) && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-700">
                  {error || errorMessage}
                </div>
              )}

              <button
                type="submit" disabled={isSubmitting}
                className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1a4b82] hover:bg-[#15396a] px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-[#1a4b82]/40 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> लगइन हुँदैछ...</>
                ) : (
                  <><LogIn className="h-4 w-4" /> लगइन</>
                )}
              </button>
            </form>
          )}

          {notice && (
            <div role="status" className="mt-4 rounded-xl bg-teal-50 border border-teal-100 px-3.5 py-2.5 text-sm text-teal-800">
              {notice}
            </div>
          )}

          <p className="mt-5 text-center text-xs text-slate-500">
            {isSignUp ? 'पहिले नै खाता छ?' : 'नयाँ प्रयोगकर्ता हो?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(!isSignUp)}
              className="font-semibold text-[#1a4b82] hover:text-[#15396a] transition-colors"
            >
              {isSignUp ? 'लगइन गर्नुहोस्' : 'खाता बनाउनुहोस्'}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};
