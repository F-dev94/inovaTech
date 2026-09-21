import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export default function DamageResolutionView({ onBack, onAccept, onDispute }) {
  const [severityCategory, setSeverityCategory] = useState('Moderado');
  const [isAccepted, setIsAccepted] = useState(false);

  const depositAmount = 500.00;
  const damageFee = 200.00;
  const refundAmount = depositAmount - damageFee;

  return (
    <div className="bg-slate-900 text-white min-h-full p-4 space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button 
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-gray-300 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="font-extrabold text-base text-white">Resolução de Danos</h2>
          <span className="text-xs text-gray-400 font-semibold block">Contrato #9421</span>
        </div>

        <div className="w-8"></div>
      </div>

      {/* Stepper Progress Bar (1:1 Figma Match) */}
      <div className="flex items-center justify-between px-6 text-[10px] font-bold text-gray-400">
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span className="text-emerald-300">Vistoria</span>
        </div>

        <div className="h-0.5 flex-1 bg-emerald-500/40 mx-1"></div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span className="text-emerald-300">Análise</span>
        </div>

        <div className="h-0.5 flex-1 bg-emerald-500/40 mx-1"></div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></div>
          <span className="text-emerald-400 font-extrabold">Decisão</span>
        </div>

        <div className="h-0.5 flex-1 bg-slate-800 mx-1"></div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          <span>Repasse</span>
        </div>
      </div>

      {/* Evidências de Vistoria (1:1 Figma Match) */}
      <div className="space-y-2.5">
        <h4 className="font-extrabold text-xs text-gray-300">Evidências de Vistoria</h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Photo 1: Retirada Ok */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
            <div className="h-28 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=400&auto=format&fit=crop&q=80"
                alt="Retirada Ok" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-center bg-slate-950">
              <span className="font-bold text-gray-300 text-[11px]">Retirada (Ok)</span>
            </div>
          </div>

          {/* Photo 2: Devolvido Dano */}
          <div className="bg-rose-950/30 rounded-2xl overflow-hidden border-2 border-rose-500">
            <div className="h-28 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80"
                alt="Devolvido Dano" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-center bg-rose-500/20">
              <span className="font-bold text-rose-300 text-[11px]">Devolvido (Dano)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categoria de Gravidade (1:1 Figma Match: Sem dano | Leve | Moderado (active) | Grave) */}
      <div className="space-y-2">
        <h4 className="font-extrabold text-xs text-gray-300">Categoria de Gravidade</h4>

        <div className="grid grid-cols-4 gap-1.5">
          {['Sem dano', 'Leve', 'Moderado', 'Grave'].map((cat) => {
            const isSelected = severityCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSeverityCategory(cat)}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cálculo de Retenção Card (1:1 Figma Match) */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-md">
        <h4 className="font-extrabold text-xs text-gray-200">Cálculo de Retenção</h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-gray-400">
            <span>Valor da Garantia (Caução)</span>
            <span className="font-bold text-white">R$ {depositAmount.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex justify-between items-center text-rose-400">
            <span>Dano Moderado (Taxa de 40%)</span>
            <span className="font-bold">- R$ {damageFee.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
            <span className="font-bold text-white">Valor a Devolver (Locatário)</span>
            <span className="font-black text-emerald-400 text-base">
              R$ {refundAmount.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (1:1 Figma Match) */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => {
            setIsAccepted(true);
            if (onAccept) onAccept();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isAccepted ? 'Decisão Aceita!' : 'Aceitar decisão'}</span>
        </button>

        <button
          onClick={onDispute}
          className="w-full bg-slate-950 hover:bg-slate-800 text-gray-300 hover:text-white font-bold text-xs py-3 rounded-2xl border border-slate-800 flex items-center justify-center gap-2 transition-all"
        >
          <span>Contestar Decisão</span>
        </button>
      </div>

    </div>
  );
}
