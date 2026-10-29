import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tv,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Usb,
  Sparkles,
  Activity,
  HeartPulse,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('sahuarpita322@gmail.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Smooth transition
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email || 'sahuarpita322@gmail.com');
    }, 600);
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demoEmail);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0b101b] border border-cyan-800/60 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-cyan-950/40 relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
          >
            <Tv className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>GLUTOR.V2</span>
            </h1>
            <p className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-wider">
              Breath Sensing &amp; Telemetry Platform
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Account Email / Patient ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                Access Key / Password
              </label>
              <span className="text-[11px] text-cyan-400/80 hover:text-cyan-300 cursor-pointer">
                Hardware Authorized
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
              <span>Remember this workstation</span>
            </label>
            <span className="text-slate-500 font-mono text-[10px]">1 USB Port Mode</span>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating &amp; Initializing...</span>
              </span>
            ) : (
              <>
                <span className="text-sm font-extrabold">Sign In &amp; Launch GLUTOR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Quick Access Preset for User */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 block mb-2 text-center uppercase tracking-wider">
            Quick 1-Click Access
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickDemo('sahuarpita322@gmail.com')}
              className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
                  AS
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    sahuarpita322@gmail.com
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Primary Researcher Account</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>
        </div>

        {/* Security and Hardware Features Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-around text-center text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure Telemetry</span>
          </div>
          <div>·</div>
          <div className="flex items-center gap-1">
            <Usb className="w-3.5 h-3.5 text-teal-400" />
            <span>1 USB Port Direct</span>
          </div>
          <div>·</div>
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Screen Sync</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
