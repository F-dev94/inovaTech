import React from 'react';
import { useTrocaJaStore } from '../../services/store';
import { DollarSign, CheckCircle2, FileText, ArrowUpRight, Zap, Award } from 'lucide-react';

export default function FinancialView() {
  const { state, actions } = useTrocaJaStore();

  const finishedBookings = state.bookings.filter(b => b.status === 'FINALIZADA' || b.status === 'AGUARDANDO_CONCILIACAO');

  return (
    <div className="space-y-6">
      {/* Header Context for Patrícia Nogueira */}
      <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm">
            Conciliação & Repasses Financeiros (Visão Patrícia Nogueira)
          </h3>
          <p className="text-gray-300 text-xs mt-0.5">
            Fim das 40 planilhas manuais. 100% de automação de PIX e emissão automática de NF-e para lojistas PRO.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/40">
            Erro de Repasse: 0.0%
          </span>
        </div>
      </div>

      {/* Financial Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-gray-400 text-xs font-semibold block">Comissões Retidas Plataforma</span>
          <span className="text-xl font-extrabold text-emerald-400">R$ 1.840,50</span>
          <span className="text-[10px] text-gray-500 block">18% P2P + 9% PRO Automáticos</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-gray-400 text-xs font-semibold block">Seguro Proteção Arrecadado</span>
          <span className="text-xl font-extrabold text-indigo-400">R$ 480,00</span>
          <span className="text-[10px] text-gray-500 block">Cobertura ativa em 100% das reservas</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-gray-400 text-xs font-semibold block">Assinaturas Lojistas PRO</span>
          <span className="text-xl font-extrabold text-amber-400">R$ 179.880,00/mês</span>
          <span className="text-[10px] text-amber-300 font-bold block">1.200 Lojas Ativas (R$ 149,90/mês)</span>
        </div>
      </div>

      {/* Automated Conciliation & PIX Payout Table (RF08) */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          Fila de Conciliação e Repasse PIX + NF-e Automática
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Reserva</th>
                <th className="py-2.5 px-3">Locador / Beneficiário</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Subtotal</th>
                <th className="py-2.5 px-3">Comissão Plataforma</th>
                <th className="py-2.5 px-3">Repasse Líquido PIX</th>
                <th className="py-2.5 px-3">Status Repasse</th>
                <th className="py-2.5 px-3 text-right">Nota Fiscal (NF-e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {state.bookings.map((booking) => {
                const netPayout = booking.subtotal - booking.commissionAmount;
                const isConciliated = booking.payoutStatus === 'CONCILIADO_PIX';

                return (
                  <tr key={booking.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-bold text-white">#{booking.id}</td>
                    <td className="py-3 px-3 font-medium text-gray-200">{booking.ownerName}</td>
                    <td className="py-3 px-3">
                      {booking.commissionRate === 0.09 ? (
                        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          PRO (9%)
                        </span>
                      ) : (
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          P2P (18%)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-300">R$ {booking.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-3 text-rose-400 font-semibold">- R$ {booking.commissionAmount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-emerald-400 font-extrabold">R$ {netPayout.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      {isConciliated ? (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          PIX Enviado
                        </span>
                      ) : (
                        <button
                          onClick={() => actions.processPayoutAndNfe(booking.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-md"
                        >
                          Executar Repasse PIX
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {booking.nfeNumber ? (
                        <span className="text-gray-300 font-mono text-[11px] flex items-center justify-end gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          {booking.nfeNumber}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[10px]">Aguardando Repasse</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
