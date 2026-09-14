import React from 'react';
import { useTrocaJaStore } from '../../services/store';
import { Repeat, PlusCircle, ShieldCheck, MessageSquare, LayoutDashboard, Search, FileText, UserCheck, LogIn, Shield } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenKyc, onOpenCreateItem, onOpenAuth }) {
  const { activePersona, state } = useTrocaJaStore();

  const isBypassCount = state.messages.filter(m => m.isBypassDetected).length;
  const disputeCount = state.disputes.filter(d => d.status === 'EM_ANALISE').length;
  const isAdminRole = ['suporte', 'seguranca', 'financeiro', 'admin'].includes(activePersona.userRole);

  const handleAdminTabClick = () => {
    if (!isAdminRole) {
      onOpenAuth('admin');
    } else {
      setActiveTab('admin');
    }
  };

  return (
    <>
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-10 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('marketplace')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight gradient-text">TrocaJá</span>
              <span className="text-[10px] font-bold uppercase tracking-wider block text-indigo-400 -mt-1">
                Marketplace PWA
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Marketplace
            </button>

            <button
              onClick={() => setActiveTab('my-rentals')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'my-rentals'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Minhas Reservas & Vistorias
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat Anti-Vazamento
              {isBypassCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {isBypassCount}
                </span>
              )}
            </button>

            {/* Painel Gestor / Admin Tab */}
            <button
              onClick={handleAdminTabClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : isAdminRole
                  ? 'text-amber-300 hover:bg-slate-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Painel Gestor / Admin
              {disputeCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {disputeCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons, Auth State & KYC Status */}
          <div className="flex items-center gap-2.5">
            {/* Login / Auth Switch Button */}
            <button
              onClick={() => onOpenAuth('client')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Perfil ({activePersona.name.split(' ')[0]})</span>
            </button>

            <button
              onClick={onOpenKyc}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-900/50 transition-all"
              title="Biometria facial e documento validados em 1.4s"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>KYC</span>
            </button>

            <button
              onClick={onOpenCreateItem}
              className="flex items-center gap-1.5 gradient-emerald hover:opacity-90 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 transition-all min-h-[38px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Anunciar Item</span>
              <span className="sm:hidden">Anunciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar (Thumb Accessible for PWA) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg flex md:hidden items-center justify-around px-2 py-2 text-[10px] shadow-2xl">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${
            activeTab === 'marketplace' ? 'text-indigo-400 font-extrabold bg-indigo-950/60' : 'text-gray-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Busca</span>
        </button>

        <button
          onClick={() => setActiveTab('my-rentals')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${
            activeTab === 'my-rentals' ? 'text-indigo-400 font-extrabold bg-indigo-950/60' : 'text-gray-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Reservas</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all relative ${
            activeTab === 'chat' ? 'text-indigo-400 font-extrabold bg-indigo-950/60' : 'text-gray-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
          {isBypassCount > 0 && (
            <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {isBypassCount}
            </span>
          )}
        </button>

        <button
          onClick={handleAdminTabClick}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all relative ${
            activeTab === 'admin' ? 'text-amber-400 font-extrabold bg-amber-950/60' : 'text-gray-400'
          }`}
        >
          <Shield className="w-5 h-5 text-amber-400" />
          <span>Gestão</span>
          {disputeCount > 0 && (
            <span className="absolute -top-1 right-2 bg-amber-500 text-slate-950 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {disputeCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
