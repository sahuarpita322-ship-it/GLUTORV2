import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Tv,
  Cpu,
  Apple,
  Clock,
  User,
  Menu,
  X,
  Usb,
  Square,
  Sparkles,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { ConnectionStatus } from '../types';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  connectionStatus: ConnectionStatus;
  isSimulated: boolean;
  onQuickConnect: () => void;
  onDisconnect: () => void;
  onOpenAnimation?: () => void;
  onLogout?: () => void;
  userEmail?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  connectionStatus,
  isSimulated,
  onQuickConnect,
  onDisconnect,
  onOpenAnimation,
  onLogout,
  userEmail,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'live', label: 'Live Monitor', icon: Tv },
    { id: 'mcu', label: 'Hardware Connect', icon: Cpu },
    { id: 'lifestyle', label: 'Food & Health', icon: Apple },
    { id: 'history', label: 'History & CSV', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07090e]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark with Animated Indicator */}
          <button
            onClick={() => setCurrentTab('live')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
            >
              <Tv className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </motion.div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                GLUTOR.V2
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
                Direct Telemetry
              </span>
            </div>
          </button>

          {/* Zone 2: Streamlined Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-cyan-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/40 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Connection Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Working Animation Button */}
            {onOpenAnimation && (
              <button
                onClick={onOpenAnimation}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/60 rounded-lg transition-colors cursor-pointer"
                title="Watch animation explaining how Glutor works"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>How It Works</span>
              </button>
            )}

            {connectionStatus === 'connected' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{isSimulated ? 'DEMO STREAM' : 'USB CONNECTED'}</span>
                </span>
                <button
                  onClick={onDisconnect}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded-lg hover:bg-rose-900/60 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onQuickConnect}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Usb className="w-3.5 h-3.5 text-slate-950" />
                <span>Connect USB</span>
              </motion.button>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="hidden sm:inline-block text-[11px] font-mono text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer"
                title={`Logged in as ${userEmail || 'User'}. Click to switch user / log out.`}
              >
                Sign Out
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16] border-b border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
