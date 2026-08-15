import { useState, useEffect } from 'react';
import { KeyRound, UserCheck, ShieldCheck, CheckCircle2, Lock, Eye, EyeOff, X, ArrowRight, Sparkles, User, BadgeCheck, Check } from 'lucide-react';

export function OnboardingModal({ isOpen, token, onClose, onCompleteOnboarding, onOpenLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsActivated(false);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  // Password strength logic
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'Not entered', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 9) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onCompleteOnboarding({
        token,
        password,
        name: name.trim(),
      });
      setIsActivated(true);
    } catch (err) {
      setError(err.message || 'Onboarding activation failed. Invalid or expired token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50/95 text-slate-900 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300 selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* 🌸 Light Theme Pastel Mesh Orbs & Animated Background Graphics */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-emerald-300/30 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-indigo-200/35 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />

      {/* Floating 3D Geometric Ring Shapes */}
      <div className="absolute top-16 right-16 w-56 h-56 border border-emerald-400/30 rounded-full animate-spin-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-16 left-16 w-72 h-72 border border-teal-400/25 rounded-full border-dashed animate-spin-slow pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse' }} />

      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 backdrop-blur-xl transition-all cursor-pointer shadow-lg flex items-center gap-2 text-xs font-bold"
        aria-label="Exit onboarding"
      >
        <X className="w-5 h-5" />
        <span className="hidden sm:inline">Close</span>
      </button>

      {/* Main Full Screen Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto py-8">
        
        {!isActivated ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Steps & Graphics */}
            <div className="lg:col-span-5 space-y-6 hidden lg:flex flex-col justify-center pr-4">
              
              {/* Header Branding */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Official Member Onboarding</span>
                </div>

                <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-slate-900">
                  Activate Your <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                    ACES Club Identity
                  </span>
                </h1>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Welcome to ACES! Complete your account verification to access the central content launchpad, events, and guild directory.
                </p>
              </div>

              {/* Step Progress Tracker */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-emerald-300 backdrop-blur-xl shadow-md">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Token Verification</h4>
                    <p className="text-[11px] text-emerald-700 font-bold truncate">Token linked & validated</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Set Full Name & Credentials</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Create secure access password</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 font-black flex items-center justify-center text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Active Guild Membership</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Full privileges enabled</p>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium flex items-center gap-3 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Your invitation token grants official member authorization within ACES CMS.</span>
              </div>

            </div>

            {/* Right Column: Full Screen Onboarding Form */}
            <div className="lg:col-span-7 w-full max-w-lg mx-auto">
              
              <div className="relative rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-emerald-200/80 bg-white/90 backdrop-blur-2xl ring-1 ring-white/80">
                
                {/* Top Glowing Emerald Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

                {/* Form Header Branding with Logo */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-emerald-200 flex items-center justify-center shadow-md ring-2 ring-emerald-500/10 shrink-0">
                    <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">Member Onboarding</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                        Account Setup
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Activate your ACES Club account and establish access credentials.
                    </p>
                  </div>
                </div>

                {/* Token Badge Display */}
                <div className="mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate opacity-90 text-slate-700">
                      Token: <span className="font-mono font-bold text-indigo-900">{token || 'Valid Invite Token'}</span>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 shrink-0">
                    Verified
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
                    {error}
                  </div>
                )}

                {/* Onboarding Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Create Password */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Create Password <span className="text-rose-500">*</span></span>
                      </span>
                      {password && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          strength.label === 'Strong' ? 'bg-emerald-100 text-emerald-800' :
                          strength.label === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          Strength: {strength.label}
                        </span>
                      )}
                    </label>
                    
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Visual Meter Bar */}
                    {password && (
                      <div className="mt-2 flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength.score ? strength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirm Password <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Activating Account...</span>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Activate Account</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>
        ) : (
          /* =========================================================
             ACCOUNT ACTIVATED SUCCESS CELEBRATION VIEW (LIGHT THEME)
             ========================================================= */
          <div className="max-w-lg mx-auto py-10 px-8 rounded-3xl bg-white/95 border border-emerald-300 backdrop-blur-2xl shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            
            {/* Ambient Celebration Glow */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
            <div className="w-32 h-32 bg-emerald-200/50 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Animated Logo / Check Badge */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-white p-3 border-2 border-emerald-400 shadow-xl flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
                <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2 border border-emerald-300">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Complete</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Activated!</h2>
              <p className="text-xs text-slate-600 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                Your member account status is now updated to <strong className="text-emerald-700 uppercase font-bold">ACTIVE</strong>. You can now log in using your registered email address and newly set password.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenLogin) onOpenLogin();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Login Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
          </div>
        )}

      </div>

    </div>
  );
}

export default OnboardingModal;
