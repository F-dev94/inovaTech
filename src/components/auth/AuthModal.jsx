import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import {
  X, User, Shield, Lock, ArrowRight, CheckCircle2, AlertCircle,
  Database, UserPlus, Key, MapPin, Phone, CreditCard, ShieldCheck, Eye, EyeOff
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';

/**
 * AuthModal — Login Cliente / Gestor / Novo Cadastro.
 * Recebe `onSuccess()` que é chamado apenas após autenticação válida.
 * O botão X retorna à tela de boas-vindas (NÃO acessa a plataforma).
 */
export default function AuthModal({ onClose, onSuccess, defaultRole = 'client' }) {
  const { state, actions } = useTrocaJaStore();
  const [authMode, setAuthMode] = useState(defaultRole); // 'client' | 'admin' | 'register'

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState('carlos');
  const [selectedAdminId, setSelectedAdminId] = useState('renata');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // New Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPixKey, setRegPixKey] = useState('');
  const [regCity, setRegCity] = useState('Ribeirão Preto/SP');
  const [regUserRole, setRegUserRole] = useState('locador');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const clientPersonas = state.personas.filter(p =>
    ['locador', 'locatario', 'lojista'].includes(p.userRole)
  );
  const adminPersonas = state.personas.filter(p =>
    ['suporte', 'seguranca', 'financeiro', 'admin'].includes(p.userRole)
  );

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password || password.trim() === '') {
      setErrorMessage('Por favor, digite sua senha de acesso.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const targetId = authMode === 'client' ? selectedPersonaId : selectedAdminId;
    const result = actions.verifyAndLogin(targetId, password);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error);
    } else {
      setLoginSuccess(true);
      await new Promise((r) => setTimeout(r, 700));
      onSuccess?.(); // sinaliza login válido ao App.jsx
    }
  };

  // ── REGISTRO ───────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName || !regEmail) {
      setErrorMessage('Por favor, preencha o Nome e o E-mail para concluir o cadastro.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    // Verifica email já cadastrado
    const emailExists = state.personas.find(
      p => p.email?.toLowerCase() === regEmail.toLowerCase()
    );
    if (emailExists) {
      setErrorMessage('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    actions.registerUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      userRole: regUserRole,
      cpf: regCpf || '000.000.000-00',
      phone: regPhone || '(16) 99999-8888',
      pixKey: regPixKey || regEmail,
      city: regCity,
      isPro: regUserRole === 'lojista'
    });

    setIsLoading(false);
    setLoginSuccess(true);
    await new Promise((r) => setTimeout(r, 700));
    onSuccess?.();
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-6">

        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Portal de Autenticação TrocaJá</h3>
          </div>
          {/* X volta à tela de boas-vindas, NÃO libera acesso */}
          <button
            onClick={onClose}
            title="Voltar à tela inicial"
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Tab Switcher */}
        <div className="p-2 bg-slate-950 border-b border-slate-800 grid grid-cols-3 gap-1 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('client'); setErrorMessage(''); setLoginSuccess(false); }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'client'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Login Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('admin'); setErrorMessage(''); setLoginSuccess(false); }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Login Gestor</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setLoginSuccess(false); }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'register'
                ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
            <span>Novo Cadastro</span>
          </button>
        </div>

        {/* Success Flash */}
        {loginSuccess && (
          <div className="m-4 mb-0 bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Acesso autenticado com sucesso! Redirecionando...</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="m-4 mb-0 bg-rose-950/70 border border-rose-500/50 p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── FORMULÁRIO DE CADASTRO ───────────────────────────────────────── */}
        {authMode === 'register' ? (
          <form onSubmit={handleRegister} className="p-6 space-y-3 text-xs">
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/40 text-[11px] text-emerald-300">
              ✨ <strong>Criar Nova Conta no TrocaJá</strong>: Informe seus dados pessoais, CPF e chave PIX
              para alugar e receber pagamentos com segurança.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 font-bold block mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="joao@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Senha *</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white pr-9 focus:border-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-gray-300 font-bold block mb-1">Confirmar Senha *</label>
                <input
                  type="password"
                  required
                  placeholder="Repita a senha"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl p-2.5 text-white outline-none ${
                    regConfirmPassword && regConfirmPassword !== regPassword
                      ? 'border-rose-500'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Perfil do Cadastro</label>
              <select
                value={regUserRole}
                onChange={(e) => setRegUserRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold"
              >
                <option value="locador">Locador Amador (P2P — comissão 18%)</option>
                <option value="locatario">Locatário (Alugar Itens)</option>
                <option value="lojista">Parceiro Comercial (Lojista PRO — comissão 9%)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-gray-300 font-bold block mb-1">CPF / CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={regCpf}
                  onChange={(e) => setRegCpf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 font-bold block mb-1">Celular / Whats</label>
                <input
                  type="text"
                  placeholder="(16) 99999-8888"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 font-bold block mb-1">Chave PIX</label>
                <input
                  type="text"
                  placeholder="E-mail ou CPF"
                  value={regPixKey}
                  onChange={(e) => setRegPixKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Cidade / Estado</label>
              <input
                type="text"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full gradient-emerald hover:opacity-90 font-extrabold text-xs py-3 rounded-xl shadow-lg text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Cadastrando...</span>
              ) : (
                <>
                  <span>Concluir Cadastro e Acessar Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        ) : (
          /* ── FORMULÁRIO DE LOGIN (CLIENTE OU GESTOR) ─────────────────────── */
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {authMode === 'client' ? (
              <div className="space-y-3">
                <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/30 text-xs text-indigo-300">
                  👤 <strong>Acesso Cliente</strong>: Selecione a conta e digite a senha cadastrada exata.
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Selecione a Conta do Cliente
                  </label>
                  <select
                    value={selectedPersonaId}
                    onChange={(e) => {
                      setSelectedPersonaId(e.target.value);
                      const p = state.personas.find(x => x.id === e.target.value);
                      if (p) setEmail(p.email || '');
                      setPassword('');
                      setErrorMessage('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-medium"
                  >
                    {clientPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">E-mail do Cliente</label>
                  <input
                    type="email"
                    value={email || `${selectedPersonaId}@trocaja.app`}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white pr-9 focus:border-indigo-500 outline-none"
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Senha padrão dos usuários de demonstração: <span className="font-mono text-amber-400">1a2b3c</span>
                  </p>
                </div>
              </div>

            ) : (
              <div className="space-y-3">
                <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/40 text-xs text-amber-300">
                  🛡️ <strong>Acesso Administrativo Operacional</strong>: Exclusivo para Suporte, T&amp;S,
                  Financeiro e Diretoria.
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Selecione a Credencial de Gestão
                  </label>
                  <select
                    value={selectedAdminId}
                    onChange={(e) => {
                      setSelectedAdminId(e.target.value);
                      const p = state.personas.find(x => x.id === e.target.value);
                      if (p) setEmail(p.email || '');
                      setPassword('');
                      setErrorMessage('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-medium"
                  >
                    {adminPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={email || `${selectedAdminId}@trocaja.app`}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Chave / Senha Administrativa
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white pr-9 focus:border-amber-500 outline-none"
                      placeholder="Digite sua senha administrativa"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Senha padrão administrativa: <span className="font-mono text-amber-400">1a2b3c</span>
                  </p>
                </div>
              </div>
            )}

            {/* Supabase Connection Badge */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Supabase Auth (InovaTech)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {isSupabaseConfigured ? 'Conectado' : 'Modo Local'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className={`w-full font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                authMode === 'client'
                  ? 'gradient-emerald hover:opacity-90 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isLoading ? (
                <span>Validando Senha...</span>
              ) : (
                <>
                  <span>Entrar como {authMode === 'client' ? 'Cliente' : 'Gestor'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
