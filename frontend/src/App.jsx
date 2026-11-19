import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';
import ModalConfirm from './components/ModalConfirm';

import Dashboard from './pages/Dashboard';
import SpedFiscalPage from './pages/SpedFiscalPage';
import RtcRegularPage from './pages/RtcRegularPage';
import RtcSimplesPage from './pages/RtcSimplesPage';
import DanfsePage from './pages/DanfsePage';
import BalancoPatrimonialPage from './pages/BalancoPatrimonialPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gentxt_auth') !== 'false';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gentxt_theme') || 'dark';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gentxt_user');
    return saved ? JSON.parse(saved) : {
      nome: 'Gabriel Albuquerque',
      email: 'gabriel.contabil@albuquerque.adv.br',
      crc: 'SP-319482/O-5',
      escritorio: 'Albuquerque & Associados Gestão Contábil',
      cidade: 'São Paulo / SP'
    };
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync theme with html document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('gentxt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('gentxt_auth', 'true');
    localStorage.setItem('gentxt_user', JSON.stringify(userData));
  };

  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('gentxt_auth', 'false');
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('gentxt_user', JSON.stringify(updatedData));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' ? 'tech-grid-dark bg-obsidian-950 text-slate-100' : 'tech-grid-light bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onLogout={() => setShowLogoutModal(true)}
        user={user}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Navigation Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onNavigate={setActiveTab}
          />

          {/* Dynamic Content Area */}
          <main className="flex-1 w-full min-w-0">
            {/* Breadcrumb with Return Button */}
            <Breadcrumb
              currentTab={activeTab}
              onNavigate={setActiveTab}
            />

            {/* Tab Views */}
            {activeTab === 'dashboard' && (
              <Dashboard onNavigate={setActiveTab} />
            )}

            {activeTab === 'sped' && (
              <SpedFiscalPage />
            )}

            {activeTab === 'rtc_regular' && (
              <RtcRegularPage />
            )}

            {activeTab === 'rtc_simples' && (
              <RtcSimplesPage />
            )}

            {activeTab === 'danfse' && (
              <DanfsePage />
            )}

            {activeTab === 'balanco' && (
              <BalancoPatrimonialPage />
            )}

            {activeTab === 'settings' && (
              <ProfileSettingsPage
                theme={theme}
                onSetTheme={setTheme}
                onLogout={() => setShowLogoutModal(true)}
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-obsidian-800 bg-white/60 dark:bg-obsidian-950/60 py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-gold-400">GeNnTXT Cockpit Fiscal</span>
            <span>&bull;</span>
            <span>Motor de Escrituração, Balanço & Reforma Tributária (LC 214/2025)</span>
          </div>
          <div>
            Desenvolvido para contadores e escritórios contábeis
          </div>
        </div>
      </footer>

      {/* Confirmation Modal for Logout */}
      <ModalConfirm
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Encerrar Sessão"
        message="Tem certeza de que deseja sair do Cockpit Fiscal? Todos os dados não salvos nos formulários serão redefinidos."
        confirmText="Sim, Sair"
        cancelText="Permanecer Conectado"
      />
    </div>
  );
}
