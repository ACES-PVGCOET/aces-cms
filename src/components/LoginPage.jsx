import { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ArrowRight, 
  Layers, 
  CalendarDays, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';

export function LoginPage({ onLogin, onOpenOnboarding, hasOnboardingToken }) {
  const [email, setEmail] = useState('pranavmankar2007@gmail.com');
  const [password, setPassword] = useState('admin@123');
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

  return (
    <div className="min-h-screen w-full bg-[#fcfaff] text-slate-900 relative overflow-hidden font-sans flex items-center justify-center p-4 sm:p-6 lg:p-12">
      
      {/* Background Soft Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 10% 25%, rgba(243, 232, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 45%, rgba(253, 242, 248, 0.7) 100%)',
        }}
      />

      {/* Ambient Decorative Geometric Rings */}
      <div className="absolute -top-12 -left-12 w-[440px] h-[440px] border border-purple-200/50 rounded-full pointer-events-none hidden md:block" />
      <div className="absolute -bottom-16 -right-16 w-[420px] h-[420px] border border-pink-200/50 border-dashed rounded-full pointer-events-none hidden md:block" />

      {/* Main Grid Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* =========================================================
           LEFT COLUMN: Brand Header & 3 Feature Showcase Cards
           ========================================================= */}
        <div className="lg:col-span-6 space-y-6 hidden lg:flex flex-col justify-center pr-2">
          
          {/* Top Brand Pill */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm">
              <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center p-0.5 shadow-xs">
                <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#7c3aed]">
                ACES CENTRAL COMMAND • 2026–27
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] text-slate-900">
              Orchestrate Campus <br />
              <span className="text-[#7c3aed]">
                Tech Leadership &amp;
              </span> <br />
              <span className="text-[#db2777]">
                Guilds
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-500 font-medium max-w-md pt-1">
              Welcome to the official ACES Content Management System. Streamline member records, event lineups, digital magazine archives, and campus announcements.
            </p>
          </div>

          {/* 3 Floating Feature Cards */}
          <div className="space-y-3.5 pt-2">
            
            {/* Card 1: Guild Members Directory */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-lg shadow-purple-500/5 flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-600 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Guild Members Directory</h3>
                  <p className="text-xs text-slate-400 font-medium">10 Specialized Technical &amp; Media Guilds</p>
                </div>
              </div>
              {/* Avatar Stack */}
              <div className="flex items-center -space-x-2 shrink-0">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav&backgroundColor=ffd5dc" 
                  alt="Member" 
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs" 
                />
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Neha&backgroundColor=ffdfbf" 
                  alt="Member" 
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs" 
                />
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yash&backgroundColor=d1d4f9" 
                  alt="Member" 
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs" 
                />
                <span className="w-7 h-7 rounded-full bg-[#8b2cf5] text-[10px] font-extrabold flex items-center justify-center text-white border-2 border-white shadow-xs">
                  +45
                </span>
              </div>
            </div>

            {/* Card 2: High-Impact Hackathons & Events */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-lg shadow-purple-500/5 flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">High-Impact Hackathons &amp; Events</h3>
                  <p className="text-xs text-slate-400 font-medium">Synchronized with live ACES portal</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eef2ff] text-[#4f46e5] shrink-0">
                Live Feeds
              </span>
            </div>

            {/* Card 3: Annual Magazine Archives */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-lg shadow-purple-500/5 flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-100/80 flex items-center justify-center text-pink-600 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Annual Magazine Archives</h3>
                  <p className="text-xs text-slate-400 font-medium">Integrated PDF flip-view &amp; downloads</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#059669] text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
           RIGHT COLUMN: Login Card matching exact screenshot
           ========================================================= */}
        <div className="lg:col-span-6 w-full max-w-[460px] mx-auto">
          
          <div className="relative rounded-[2rem] p-8 sm:p-10 shadow-2xl bg-white border border-slate-100/80 overflow-hidden">
            
            {/* Top Vibrant Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#db2777]" />

            {/* Center Glowing Logo */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.35)] ring-1 ring-purple-100">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center p-1.5 shadow-sm">
                    <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">ACES CMS Portal</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Association of Computer Engineering Students
              </p>
            </div>

            {/* Onboarding Token Banner */}
            <div className="mb-6 p-2.5 pl-3.5 rounded-2xl bg-[#faf5ff] border border-purple-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#7c3aed] font-semibold">
                <KeyRound className="w-4 h-4 text-[#7c3aed] shrink-0" />
                <span className="text-slate-800 text-[11px] sm:text-xs">Onboarding token detected!</span>
              </div>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="px-3.5 py-1.5 rounded-xl bg-[#8b2cf5] hover:bg-[#7c3aed] text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
              >
                Activate Now
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7c3aed]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="pranavmankar2007@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#b0bcc9] text-slate-900 placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-[#bcc8d5] transition-all shadow-inner"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7c3aed]" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-[#b0bcc9] text-slate-900 placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-[#bcc8d5] transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#9333ea] to-[#db2777] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:opacity-95 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to ACES CMS</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 pt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>© 2026–2027 ACES Club</span>
              <span>Protected System</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;
