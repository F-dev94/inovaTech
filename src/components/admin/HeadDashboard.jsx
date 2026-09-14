import React from 'react';
import { useTrocaJaStore } from '../../services/store';
import { TrendingUp, ShieldAlert, Award, Smile, Users, DollarSign, Activity } from 'lucide-react';

export default function HeadDashboard() {
  const { state } = useTrocaJaStore();

  const totalGMV = state.bookings.reduce((acc, b) => acc + b.totalPaid, 0);
  const totalCommission = state.bookings.reduce((acc, b) => acc + b.commissionAmount, 0);
  const proCount = state.items.filter(i => i.ownerIsPro).length;
  const p2pCount = state.items.filter(i => !i.ownerIsPro).length;

  return (
    <div className="space-y-6">
      {/* Header Executive Context (Renata Bicalho / Thiago Prado / Marina Kessler) */}
      <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm">
            Dashboard de Gestão & Indicadores de Sucesso (Visão Diretoria Executiva)
          </h3>
          <p className="text-gray-300 text-xs mt-0.5">
            Monitoramento de KPIs de vazamento de receita, NPS operacional e volume de disputas auditáveis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
            Series A Ready
          </span>
        </div>
      </div>

      {/* Primary KPI Grid (Section 9 Success Criteria) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NPS Score Gauge */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="font-semibold">NPS Operacional</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">74</span>
            <span className="text-xs text-emerald-300 font-bold">▲ Meta de 61 Atingida</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Aumento significativo após automação da caução e clareza na vistoria.
          </p>
        </div>

        {/* Leaked Revenue Counter */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="font-semibold">Receita Vazada Bloqueada</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">R$ 14.300</span>
            <span className="text-xs text-gray-400">/mês</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Retida por detecção de bypass em chat e incentivo de seguro no app.
          </p>
        </div>

        {/* Onboarding KYC Speed */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="font-semibold">Tempo Médio de KYC</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400">1.8s</span>
            <span className="text-xs text-emerald-400 font-bold">▼ De 24-48h manuais</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Validação biométrica automática com aprovação instantânea.
          </p>
        </div>

        {/* Total GMV */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="font-semibold">Volume Transacionado (GMV)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">R$ {totalGMV.toFixed(0)}</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Comissão média da plataforma: R$ {totalCommission.toFixed(2)}
          </p>
        </div>
      </div>

      {/* P2P vs PRO Distribution & Store Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Parceiros Comerciais TrocaJá-Pro (Ribeirão Preto & Região)
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Lojas Parceiras Assinantes:</span>
              <span className="text-amber-400 font-bold">1.240 Lojistas</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800">
              <div className="bg-amber-500 h-full w-[78%]" title="Lojistas PRO (9%)"></div>
              <div className="bg-indigo-600 h-full w-[22%]" title="Pessoa Física (18%)"></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Lojistas PRO (78% do catálogo) — 9% Comissão
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                P2P (22% do catálogo) — 18% Comissão
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Engajamento da Base de Usuários Cadastrados
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-gray-400 block text-[11px]">Total Usuários Cadastrados</span>
              <span className="text-xl font-bold text-white">58.420</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-gray-400 block text-[11px]">Taxa de Reincidência de Reservas</span>
              <span className="text-xl font-bold text-emerald-400">84.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
