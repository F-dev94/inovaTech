import React from 'react';
import { DollarSign, Zap, TrendingUp, ArrowDownLeft, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function FinancialDashboardView() {
  const monthlyEarnings = 2847.00;

  const monthlyChartData = [
    { month: 'Mai', value: 40 },
    { month: 'Jun', value: 65 },
    { month: 'Jul', value: 100, active: true },
    { month: 'Ago', value: 55 },
    { month: 'Set', value: 75 }
  ];

  const recentTransactions = [
    {
      id: 'tx-1',
      title: 'Lavadora de Alta Pressão',
      subtitle: 'Pagamento PIX recebido',
      amount: '+ R$ 180,00',
      time: 'Hoje, 14:10',
      isReceived: true,
      icon: ArrowDownLeft
    },
    {
      id: 'tx-2',
      title: 'Gerador de Energia Gasolina',
      subtitle: 'Repasse pendente',
      amount: 'R$ 420,00',
      time: 'Ontem',
      isReceived: false,
      icon: Clock
    }
  ];

  return (
    <div className="bg-slate-900 text-white min-h-full p-4 space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="font-extrabold text-lg text-white tracking-tight">Painel Financeiro</h2>
        <span className="text-xs text-gray-400 font-semibold block">Gerenciamento de Ganhos</span>
      </div>

      {/* Ganhos Hero Card (1:1 Figma Match) */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-200 block">Ganhos do mês (Líquido)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tracking-tight">
              R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-emerald-500/30 pt-3 grid grid-cols-3 text-left gap-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">ATIVAS</span>
            <span className="font-extrabold text-white text-sm">12 Locações</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">PENDENTES</span>
            <span className="font-extrabold text-white text-sm">3 Repasses</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">DOCUMENTOS</span>
            <span className="font-extrabold text-white text-sm">8 NFs emitidas</span>
          </div>
        </div>
      </div>

      {/* Auto PIX Payout Banner Pill (1:1 Figma Match) */}
      <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-2.5 shadow-md">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-emerald-200">
          Próximo repasse automático via PIX em: <strong className="text-white">22/10</strong>
        </span>
      </div>

      {/* Evolução Mensal Bar Chart Section (1:1 Figma Match) */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3">
        <h4 className="font-extrabold text-xs text-gray-300">Evolução Mensal</h4>

        <div className="h-28 flex items-end justify-between px-3 pt-4 pb-1 gap-3">
          {monthlyChartData.map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div 
                style={{ height: `${bar.value}%` }} 
                className={`w-full max-w-[28px] rounded-lg transition-all ${
                  bar.active 
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-800'
                }`}
              />
              <span className="text-[10px] font-bold text-gray-400">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transações Recentes Section (1:1 Figma Match) */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs text-gray-300">Transações Recentes</h4>

        <div className="space-y-2.5">
          {recentTransactions.map((tx) => {
            const TxIcon = tx.icon;
            return (
              <div 
                key={tx.id}
                className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.isReceived ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <TxIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-white">{tx.title}</h5>
                    <span className="text-[11px] text-gray-400 block">{tx.subtitle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-black text-xs block ${
                    tx.isReceived ? 'text-emerald-400' : 'text-gray-200'
                  }`}>
                    {tx.amount}
                  </span>
                  <span className="text-[10px] text-gray-500">{tx.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
