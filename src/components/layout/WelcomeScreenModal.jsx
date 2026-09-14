import React from 'react';
import { QrCode, Smartphone, Repeat, Shield, User, UserPlus, ArrowRight, Sparkles, Lock } from 'lucide-react';

/**
 * WelcomeScreenModal — Tela de entrada BLOQUEANTE.
 * NÃO possui botão X. O usuário DEVE escolher um portal e fazer login
 * para acessar a plataforma.
 */
export default function WelcomeScreenModal({ onSelectPortal, onOpenQrModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 backdrop-blur-lg overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-6">

        {/* Header Splash Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-b border-indigo-500/30 relative text-center">
          {/* Sem botão X — acesso somente via login */}
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 mb-3">
            <Repeat className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Bem-vindo ao <span className="gradient-text">TrocaJá</span>
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-md mx-auto">
            Plataforma de Aluguel P2P &amp; Lojistas com Vistoria Digital, Caução Garantida e Repasses PIX Automáticos.
          </p>

          {/* Badge de segurança */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-[11px] text-amber-300 font-bold">
            <Lock className="w-3 h-3" />
            Acesso Seguro — Login Obrigatório
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Section 1: PWA Mobile QR Code Download Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md border border-emerald-500/40">
                  📱 App Mobile PWA Instalável
                </span>
                <span className="text-gray-400 text-xs font-semibold">Câmera do Celular</span>
              </div>
              <h4 className="font-bold text-white text-sm">
                Instale o App no seu Celular em Segundos!
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Escaneie o QR Code ou clique no botão abaixo para abrir e instalar o TrocaJá como app nativo.
              </p>
              <button
                onClick={onOpenQrModal}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 font-bold transition-colors underline underline-offset-2"
              >
                <QrCode className="w-3.5 h-3.5" />
                Ver QR Code para Celular
              </button>
            </div>

            {/* Ícone decorativo */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-indigo-400" />
              </div>
              <span className="text-[9px] text-indigo-400 font-mono mt-1 font-bold">
                PWA — Sem App Store
              </span>
            </div>
          </div>

          {/* Section 2: Destination Portals Selection */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider text-center text-gray-400">
              Selecione seu Perfil de Acesso para Continuar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Cliente / Locador / Lojista */}
              <button
                onClick={() => onSelectPortal('client')}
                className="bg-slate-950 hover:bg-slate-800 p-4 rounded-2xl border border-indigo-500/40 text-left transition-all group flex flex-col justify-between space-y-3 hover:border-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <User className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    Entrar como Cliente / Locador
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    Alugue ferramentas, publique seus itens para renda extra ou gerencie sua loja PRO.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Requer Login
                </span>
              </button>

              {/* Option B: Equipe Gestora / Admin */}
              <button
                onClick={() => onSelectPortal('admin')}
                className="bg-slate-950 hover:bg-amber-950/30 p-4 rounded-2xl border border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-3 hover:border-amber-500"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                    Painel Gestor &amp; Operações (Admin)
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    Acesso exclusivo para Suporte, Segurança, Financeiro, CTO e CEO.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Credencial Corporativa Obrigatória
                </span>
              </button>
            </div>

            {/* Novo Cadastro */}
            <button
              onClick={() => onSelectPortal('register')}
              className="w-full bg-slate-950 hover:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/30 text-center transition-all group flex items-center justify-center gap-2 hover:border-emerald-500"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm text-emerald-300 group-hover:text-emerald-200 transition-colors">
                Criar Nova Conta no TrocaJá
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
