import React from 'react';
import {
  FileText,
  Calculator,
  Percent,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Database
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const cards = [
    {
      id: 'sped',
      title: 'SPED Fiscal EFD ICMS/IPI',
      subtitle: 'Motor GeNnTXT Original',
      desc: 'Importe XMLs de NF-e e gere o arquivo SPED oficial no leiaute da Receita Federal com validação de registros 0000, C100, C170, C190 e Bloco E.',
      icon: FileText,
      tag: 'Produção',
      tagColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionText: 'Gerar SPED Fiscal'
    },
    {
      id: 'rtc_regular',
      title: 'Reforma Tributária: Regime Regular',
      subtitle: 'LC nº 214/2025',
      desc: 'Simule a apuração de CBS (Federal), IBS (Estadual e Municipal) e Imposto Seletivo com reduções legais (30% e 60%) e comparativo de carga tributária.',
      icon: Calculator,
      tag: 'RTC 2026+',
      tagColor: 'text-gold-700 dark:text-gold-400 bg-gold-500/10 border-gold-500/20',
      actionText: 'Simular Regime Regular'
    },
    {
      id: 'rtc_simples',
      title: 'Simples Nacional & Fator R',
      subtitle: 'Transição RTC & Anexos I a V',
      desc: 'Calcule o Fator R instantaneamente para enquadramento no Anexo III ou V, apure a alíquota efetiva do DAS e avalie a opção de CBS/IBS por fora.',
      icon: Percent,
      tag: 'Planejamento',
      tagColor: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionText: 'Calcular Simples & Fator R'
    },
    {
      id: 'danfse',
      title: 'Gerador DANFSe Nacional',
      subtitle: 'Padrão Técnico NT-008',
      desc: 'Emita a representação gráfica do DANFSe em PDF a partir de XMLs da NFS-e Nacional, com controle de canhoto e tarjas de situação fiscal.',
      icon: FileCheck2,
      tag: 'PDF Vetorial',
      tagColor: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      actionText: 'Gerar DANFSe em PDF'
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-obsidian-900 to-obsidian-950 border border-slate-200 dark:border-gold-500/20 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500/15 border border-gold-500/30 text-gold-400 mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Ecossistema Integrado de Gestão Contábil</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Plataforma Unificada para Contadores: <br />
            <span className="text-gold-400">SPED Fiscal & Reforma Tributária</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Automatize a geração de arquivos EFD ICMS/IPI com o motor proprietário GeNnTXT e antecipe o impacto das novas regras da Lei Complementar nº 214/2025 para clientes do Regime Geral e do Simples Nacional.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('sped')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Acessar Gerador SPED</span>
            </button>
            <button
              onClick={() => onNavigate('rtc_regular')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-xs tracking-wider transition-all"
            >
              <Calculator className="w-4 h-4 text-gold-400" />
              <span>Simulador RTC (CBS/IBS)</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Feature Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Módulos Operacionais
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecione a ferramenta contábil para iniciar o processamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="group relative bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 hover:border-gold-500/40 rounded-xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-gold-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-gold-400 group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${c.tagColor}`}>
                      {c.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {c.title}
                  </h3>
                  <div className="text-xs font-semibold text-gold-600 dark:text-gold-400 mb-2.5">
                    {c.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {c.desc}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(c.id)}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-obsidian-700 group-hover:border-gold-500/50 bg-slate-50 dark:bg-obsidian-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-all"
                >
                  <span>{c.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights / Technical Compliance Strip */}
      <div className="bg-slate-100/70 dark:bg-obsidian-900/60 border border-slate-200 dark:border-obsidian-800 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">EFD ICMS/IPI Oficial</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Leiaute atualizado conforme Guia Prático da EFD</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Motor SERPRO / RTC</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Regras e parâmetros fiscais da LC 214/2025</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Auditoria Local Segura</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Processamento confidencial dos XMLs fiscais</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
