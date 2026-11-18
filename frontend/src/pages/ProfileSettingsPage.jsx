import React, { useState } from 'react';
import {
  User,
  Settings,
  Sun,
  Moon,
  LogOut,
  Save,
  Check,
  Shield,
  Palette,
  Sliders
} from 'lucide-react';

export default function ProfileSettingsPage({ theme, onSetTheme, onLogout, user, onUpdateUser }) {
  const [profileData, setProfileData] = useState({
    nome: user?.nome || 'Gabriel Albuquerque',
    email: user?.email || 'gabriel.contabil@albuquerque.adv.br',
    crc: user?.crc || 'SP-319482/O-5',
    escritorio: user?.escritorio || 'Albuquerque & Associados Gestão Contábil',
    cidade: user?.cidade || 'São Paulo / SP',
    precisao_decimais: '2',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((p) => ({ ...p, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser(profileData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Perfil & Configurações da Plataforma</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gerencie suas preferências visuais de tema (Claro/Escuro), dados do contador responsável e configurações fiscais.
        </p>
      </div>

      {/* 1. SELEÇÃO DE TEMA */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <Palette className="w-4 h-4 text-gold-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
            Aparência e Identidade Visual do Cockpit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card Tema Escuro */}
          <div
            onClick={() => onSetTheme('dark')}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 relative ${
              theme === 'dark'
                ? 'border-gold-500 ring-2 ring-gold-500/30 bg-obsidian-950'
                : 'border-slate-200 dark:border-obsidian-800 hover:border-gold-500/40 bg-obsidian-950/70'
            }`}
          >
            {theme === 'dark' && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-slate-950">
                Ativo
              </span>
            )}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-obsidian-800 text-gold-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Tema Escuro</div>
                <div className="text-xs text-gold-400/80 font-medium">Preto, Grafite & Dourado</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Fundo em preto profundo e grafite, acentos em ouro metálico e tipografia com letras brancas nítidas de alto contraste.
            </p>
            <div className="h-2 rounded-full bg-gradient-to-r from-obsidian-900 via-gold-500 to-obsidian-900"></div>
          </div>

          {/* Card Tema Claro */}
          <div
            onClick={() => onSetTheme('light')}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 relative ${
              theme === 'light'
                ? 'border-gold-500 ring-2 ring-gold-500/30 bg-white'
                : 'border-slate-200 dark:border-obsidian-800 hover:border-gold-500/40 bg-slate-50 dark:bg-obsidian-800/40'
            }`}
          >
            {theme === 'light' && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-slate-950">
                Ativo
              </span>
            )}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-slate-100 text-gold-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Tema Claro</div>
                <div className="text-xs text-gold-600 dark:text-gold-400 font-medium">Branco, Cinza & Dourado</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Fundo em branco e cinza suave, acentos em dourado nobre e tipografia com letras pretas elegantes e legíveis.
            </p>
            <div className="h-2 rounded-full bg-gradient-to-r from-white via-gold-500 to-slate-200"></div>
          </div>
        </div>
      </div>

      {/* 2. DADOS DO PERFIL DO CONTADOR */}
      <form onSubmit={handleSave} className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <User className="w-4 h-4 text-gold-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400">
            Dados Cadastrais do Contador & Escritório
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nome Completo do Contador
            </label>
            <input
              type="text"
              name="nome"
              value={profileData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Registro Profissional (CRC)
            </label>
            <input
              type="text"
              name="crc"
              value={profileData.crc}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              E-mail Profissional
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nome do Escritório / Organização Contábil
            </label>
            <input
              type="text"
              name="escritorio"
              value={profileData.escritorio}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cidade / Estado de Atuação
            </label>
            <input
              type="text"
              name="cidade"
              value={profileData.cidade}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Precisão de Casas Decimais (Tributos)
            </label>
            <select
              name="precisao_decimais"
              value={profileData.precisao_decimais}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value="2">2 Casas Decimais (Padrão Moeda R$ 0,00)</option>
              <option value="4">4 Casas Decimais (Alíquotas e Precisão Específica)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>Configurações salvas com sucesso!</span>
            </div>
          ) : <div />}

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-gold-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>

      {/* 3. SESSÃO & SEGURANÇA */}
      <div className="bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-obsidian-800">
          <Shield className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-red-400">
            Gerenciamento de Acesso e Sessão
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Encerrar Sessão da Aplicação</div>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Desconecta o perfil ativo e retorna à tela de autenticação segura do cockpit.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-semibold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Deslogar do Sistema</span>
          </button>
        </div>
      </div>
    </div>
  );
}
