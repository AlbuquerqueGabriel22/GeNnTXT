import React, { useState } from 'react';
import { Shield, KeyRound, User, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [usuario, setUsuario] = useState('gabriel.albuquerque');
  const [senha, setSenha] = useState('••••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      nome: 'Gabriel Albuquerque',
      email: 'gabriel.contabil@albuquerque.adv.br',
      crc: 'SP-319482/O-5',
      escritorio: 'Albuquerque & Associados Gestão Contábil',
      cidade: 'São Paulo / SP'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-obsidian-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-obsidian-900 border border-gold-500/30 rounded-2xl p-8 shadow-2xl relative z-10 animate-fadeIn">
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center shadow-lg shadow-gold-500/20 mb-3">
            <svg className="w-6 h-6 text-obsidian-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            GeNn<span className="text-gold-400">TXT</span> Cockpit Fiscal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma Corporativa de SPED & Reforma Tributária (LC 214/2025)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Usuário ou Registro CRC
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-950 text-white text-xs focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="Insira seu usuário ou CRC"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-950 text-white text-xs focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all"
            >
              <span>Acessar Cockpit Contábil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-obsidian-800 text-center text-[11px] text-slate-500">
          Acesso seguro para profissionais de contabilidade e escritórios fiscais.
        </div>
      </div>
    </div>
  );
}
