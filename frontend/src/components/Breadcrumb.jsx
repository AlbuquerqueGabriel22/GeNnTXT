import React from 'react';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ currentTab, onNavigate, subtitle }) {
  const titles = {
    dashboard: 'Visão Geral',
    sped: 'SPED Fiscal (GeNnTXT)',
    rtc_regular: 'Reforma Tributária: Regime Regular (CBS / IBS / IS)',
    rtc_simples: 'Reforma Tributária: Simples Nacional & Fator R',
    danfse: 'Gerador DANFSe Nacional (PDF)',
    settings: 'Perfil & Configurações de Sistema',
  };

  if (currentTab === 'dashboard') {
    return null;
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-obsidian-800">
      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-1.5 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
        >
          <Home className="w-4 h-4" strokeWidth={1.5} />
          <span>Início</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 dark:text-gold-300">
          {titles[currentTab] || 'Módulo'}
        </span>
      </div>

      <button
        onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-gold-500/30 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-obsidian-900 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 shadow-sm transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Voltar ao Painel</span>
      </button>
    </div>
  );
}
