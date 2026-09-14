import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { X, ShieldAlert, AlertTriangle, Calculator, Sparkles } from 'lucide-react';
import { calculateCautionRetention } from '../../services/rulesEngine';

export default function OpenDisputeModal({ booking, onClose }) {
  const { actions } = useTrocaJaStore();
  const [damageLevel, setDamageLevel] = useState('MODERADA');
  const [description, setDescription] = useState(
    'Equipamento devolvido com dente de corte quebrado e cabo elétrico descascado por mau uso.'
  );

  if (!booking) return null;

  const retentionCalc = calculateCautionRetention({
    category: 'Ferramentas',
    damageLevel,
    depositAmount: booking.depositAmount,
    itemPricePerDay: booking.dailyRate
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    actions.openDispute({
      bookingId: booking.id,
      reportedDamageLevel: damageLevel,
      description
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-sm">Abrir Disputa de Caução #{booking.id}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-bold block mb-1">
              Classificação do Nível de Avaria
            </label>
            <select
              value={damageLevel}
              onChange={(e) => setDamageLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="LEVE">Avaria Leve (Superficial / Sujeira fora do padrão)</option>
              <option value="MODERADA">Avaria Moderada (Peça trocável / Danos parciais)</option>
              <option value="SEVERA">Avaria Severa (Motor queimado / Carcaça destruída)</option>
              <option value="PERDA_TOTAL">Perda Total / Equipamento Não Devolvido</option>
            </select>
          </div>

          {/* Rules Engine Live Preview Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Cálculo Sugerido pelo Motor de Regras:
              </span>
              <span className="bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded text-[11px]">
                {retentionCalc.suggestedRetentionPct}% Retenção
              </span>
            </div>
            <div className="text-xs text-gray-300 flex justify-between pt-1">
              <span>Retenção sugerida: <strong className="text-rose-400">R$ {retentionCalc.suggestedRetentionAmount.toFixed(2)}</strong></span>
              <span>Devolução: <strong className="text-emerald-400">R$ {retentionCalc.suggestedRefundAmount.toFixed(2)}</strong></span>
            </div>
            <p className="text-[10px] text-gray-500 italic mt-1">{retentionCalc.rationale}</p>
          </div>

          <div>
            <label className="text-xs text-gray-300 font-bold block mb-1">
              Relato da Disputa e Evidências
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all"
          >
            Encaminhar para Análise de Confiança e Segurança
          </button>
        </form>
      </div>
    </div>
  );
}
