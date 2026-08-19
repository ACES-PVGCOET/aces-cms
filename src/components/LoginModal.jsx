import { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck, User, Eye, EyeOff, X, Sparkles } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
      onClose();
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
      onClose();
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
      onClose();
    } catch (err) {
      setError(err.message || 'Quick member login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md acrylic-dialog rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 p-1.5 border border-indigo-500/40 flex items-center justify-center ring-1 ring-indigo-500/30 shrink-0">
            <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Member Login</h3>
            <p className="text-xs opacity-70 font-medium mt-0.5">
              Access ACES CMS Dashboard & Features
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. yashjawle440@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Password <span className="text-rose-400">*</span></span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-xl glass-input text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default LoginModal;
