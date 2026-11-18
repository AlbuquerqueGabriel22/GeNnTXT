import React from 'react';
import { Sun, Moon, User, LogOut, ShieldCheck, Settings } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, activeTab, onNavigate, onLogout, user }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-obsidian-800 bg-white/90 dark:bg-obsidian-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-obsidian-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                GeNn<span className="text-gold-600 dark:text-gold-400">TXT</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border border-gold-500/40 text-gold-600 dark:text-gold-400 bg-gold-500/10">
                RTC v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">
              Cockpit Contábil & Reforma Tributária
            </p>
          </div>
        </div>

        {/* Status & Right Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ambiente RTC Conectado</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            className="p-2 rounded-lg border border-slate-200 dark:border-obsidian-700 text-slate-600 dark:text-slate-300 hover:border-gold-500 hover:text-gold-500 transition-colors bg-slate-100/50 dark:bg-obsidian-900"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-gold-400" strokeWidth={1.8} />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" strokeWidth={1.8} />
            )}
          </button>

          {/* User profile shortcut */}
          <button
            onClick={() => onNavigate('settings')}
            className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                : 'border-slate-200 dark:border-obsidian-800 text-slate-700 dark:text-slate-300 hover:border-gold-500/50 bg-slate-50 dark:bg-obsidian-900'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-obsidian-800 flex items-center justify-center text-slate-700 dark:text-gold-400">
              <User className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <span className="hidden sm:inline font-semibold">
              {user?.nome || 'Contador'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Encerrar Sessão"
            className="p-2 rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
