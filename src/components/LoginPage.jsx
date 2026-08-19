import { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck, User, Eye, EyeOff, Sparkles, KeyRound, ArrowRight, Layers, CalendarDays, BookOpen, CheckCircle2 } from 'lucide-react';

export function LoginPage({ onLogin, onOpenOnboarding, hasOnboardingToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLoginAdmin = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await onLogin('yashjawle440@gmail.com', 'admin@CrossArc');
    } catch (err) {
      setError(err.message || 'Quick admin login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLoginMember = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await onLogin('24110020@pvgcoet.ac.in', 'Member@123');
    } catch (err) {
      setError(err.message || 'Quick member login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 relative overflow-hidden font-sans flex items-center justify-center p-4 sm:p-6 lg:p-12 selection:bg-purple-200 selection:text-purple-900">
      
      {/* 🌸 Light Theme Ambient Pastel Radial Mesh & Glowing Orbs */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-300/35 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[35%] right-[25%] w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[20%] left-[20%] w-[380px] h-[380px] bg-teal-200/35 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Floating 3D Geometric Ring Shapes */}
      <div className="absolute top-16 left-12 w-48 h-48 border border-purple-400/30 rounded-full animate-spin-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-20 right-16 w-72 h-72 border border-pink-400/25 rounded-full border-dashed animate-spin-slow pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse' }} />

      {/* Full Screen Layout Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* =========================================================
           LEFT COLUMN: Light Theme Branding & Graphic Feature Showcase
           ========================================================= */}
        <div className="lg:col-span-6 space-y-8 hidden lg:flex flex-col justify-center pr-4">
          
          {/* Top Brand Pill & Logo */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-purple-200/80 backdrop-blur-md shadow-md">
              <img src="/logo.png" alt="ACES Logo" className="w-6 h-6 object-contain drop-shadow" />
              <span className="text-xs font-extrabold tracking-wide uppercase bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                ACES Central Command • 2026-27
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Orchestrate Campus <br />
              <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Tech Leadership & Guilds
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 font-medium max-w-md">
              Welcome to the official ACES Content Management System. Streamline member records, event lineups, digital magazine archives, and campus announcements.
            </p>
          </div>

          {/* Floating Feature Graphics Cards Grid */}
          <div className="space-y-4 pt-2">
            
            {/* Graphic Card 1: Guild Members Directory */}
            <div className="p-4 rounded-2xl bg-white/80 border border-purple-100 backdrop-blur-xl shadow-xl shadow-purple-950/5 flex items-center justify-between gap-4 animate-float hover:border-purple-300 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Guild Members Directory</h3>
                  <p className="text-xs text-slate-500 font-medium">10 Specialized Technical & Media Guilds</p>
                </div>
              </div>
              <div className="flex items-center -space-x-2 shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" alt="Member" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" alt="Member" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yash" alt="Member" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                <span className="w-7 h-7 rounded-full bg-purple-600 text-[10px] font-bold flex items-center justify-center text-white border-2 border-white shadow-sm">
                  +45
                </span>
              </div>
            </div>

            {/* Graphic Card 2: Events Showcase */}
            <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100 backdrop-blur-xl shadow-xl shadow-indigo-950/5 flex items-center justify-between gap-4 animate-float-delayed hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">High-Impact Hackathons & Events</h3>
                  <p className="text-xs text-slate-500 font-medium">Synchronized with live ACES portal</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                Live Feeds
              </span>
            </div>

            {/* Graphic Card 3: Digital Publications */}
            <div className="p-4 rounded-2xl bg-white/80 border border-pink-100 backdrop-blur-xl shadow-xl shadow-pink-950/5 flex items-center justify-between gap-4 animate-float hover:border-pink-300 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-700 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Annual Magazine Archives</h3>
                  <p className="text-xs text-slate-500 font-medium">Integrated PDF flip-view & downloads</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
           RIGHT COLUMN: Light Theme Glassmorphic Login Form
           ========================================================= */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          
          <div className="relative rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden border border-purple-200/80 bg-white/85 backdrop-blur-2xl ring-1 ring-white/80">
            
            {/* Top Glowing Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600" />

            {/* Header Branding with Official Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300" />
                <div className="relative w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center ring-1 ring-purple-200 shadow-lg">
                  <img src="/logo.png" alt="ACES Official Logo" className="w-full h-full object-contain drop-shadow" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">ACES CMS Portal</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Association of Computer Engineering Students
              </p>
            </div>

            {/* Onboarding Token Detected Alert Banner */}
            {hasOnboardingToken && (
              <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between text-purple-900 text-xs font-semibold shadow-sm">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Onboarding token detected!</span>
                </div>
                <button
                  onClick={onOpenOnboarding}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Activate Now
                </button>
              </div>
            )}

            {/* Error Feedback */}
            {error && (
              <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-xs"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] mt-4"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    <span>Sign In to ACES CMS</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                  </>
                )}
              </button>

            </form>

            {/* Footer Notice */}
            <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>© 2026-2027 ACES Club</span>
              <span className="text-slate-400">Protected System</span>
            </footer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;
