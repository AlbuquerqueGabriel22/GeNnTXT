import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Percent,
  FileCheck2,
  Scale,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, onNavigate }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      badge: 'Início',
      icon: LayoutDashboard,
      desc: 'Painel executivo de controle fiscal'
    },
    {
      id: 'sped',
      label: 'SPED Fiscal (GeNnTXT)',
      badge: 'EFD ICMS',
      icon: FileText,
      desc: 'Geração e auditoria de arquivos SPED'
    },
    {
      id: 'rtc_regular',
      label: 'Regime Regular (RTC)',
      badge: 'CBS/IBS/IS',
      icon: Calculator,
      desc: 'Simulação tributária da LC 214/2025'
    },
    {
      id: 'rtc_simples',
      label: 'Simples Nacional & Fator R',
      badge: 'Anexos I-V',
      icon: Percent,
      desc: 'Cálculo de Fator R e transição RTC'
    },
    {
      id: 'danfse',
      label: 'Gerador DANFSe',
      badge: 'PDF Oficial',
      icon: FileCheck2,
      desc: 'Emissão e visualização de DANFSe nacional'
    },
    {
      id: 'balanco',
      label: 'Balanço Patrimonial',
      badge: 'Anual',
      icon: Scale,
      desc: 'Fechamento anual, planilhas e anexos'
    },
    {
      id: 'settings',
      label: 'Perfil & Configurações',
      badge: 'Ajustes',
      icon: Settings,
      desc: 'Tema, dados cadastrais e preferências'
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 no-print">
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-3 shadow-sm">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navegação Principal
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`p-1.5 rounded-md ${
                    isActive
                      ? 'bg-gold-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-obsidian-800 text-slate-500 dark:text-slate-400 group-hover:text-gold-500'
                  }`}>
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? 'text-gold-600 dark:text-gold-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5'
                }`} />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
