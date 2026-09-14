import React from 'react';
import { Repeat, ShieldCheck, Lock, Heart, Award } from 'lucide-react';

export default function Footer({ onResetData }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-gray-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">
              <Repeat className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight gradient-text">TrocaJá</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Marketplace de aluguel de itens e equipamentos (P2P + Lojistas PRO). Alugue com vistoria digital e caução garantida.
          </p>
        </div>

        {/* Real Pain Points Solved Badges */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Garantias do Sistema</h4>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Retenção Automática (18% P2P / 9% PRO)
            </li>
            <li className="flex items-center gap-1.5 text-indigo-300">
              <Lock className="w-3.5 h-3.5" />
              Chat Anti-Vazamento (Zero PIX por fora)
            </li>
            <li className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-3.5 h-3.5" />
              Motor de Regras de Caução Auditável
            </li>
          </ul>
        </div>

        {/* LGPD Compliance */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Conformidade & LGPD</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            RNF01: Tratamento seguro de dados biométricos e financeiros em conformidade com a LGPD (Lei nº 13.709/2018). Trilha de auditoria imutável.
          </p>
        </div>

        {/* Demo Controller */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Controle de Simulação</h4>
          <p className="text-[11px] text-gray-400">
            Alterne as personas na barra superior para testar cada painel.
          </p>
          <button
            onClick={onResetData}
            className="bg-slate-900 hover:bg-slate-800 text-gray-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          >
            Redefinir Dados de Simulação
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-900 flex flex-wrap justify-between items-center text-[11px] text-gray-500">
        <span>© 2026 TrocaJá Tecnologias de Aluguel S/A. Todos os direitos reservados.</span>
        <span>Desenvolvido com IA & Arquitetura de Alta Performance</span>
      </div>
    </footer>
  );
}
