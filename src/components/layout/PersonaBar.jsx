import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { Users, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PersonaBar() {
  const { state, activePersona, actions } = useTrocaJaStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900/90 border-b border-indigo-500/20 backdrop-blur-md sticky top-0 z-40 text-xs shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Active Persona Banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-indigo-200 font-medium">Modo de Simulação Ativo:</span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{activePersona.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activePersona.isPro ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {activePersona.badge}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] truncate max-w-md hidden sm:block">
                "{activePersona.quote}"
              </p>
            </div>
          </div>
        </div>

        {/* Switch Persona Dropdown Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-all shadow-sm text-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Alternar Persona ({state.personas.length})</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Persona Selector Grid */}
      {isOpen && (
        <div className="bg-slate-950/95 border-b border-indigo-500/30 p-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-200">
          {state.personas.map((p) => {
            const isActive = p.id === activePersona.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  actions.setActivePersona(p.id);
                  setIsOpen(false);
                }}
                className={`text-left p-3 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-indigo-900/40 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs truncate">{p.name}</h4>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </div>
                    <p className="text-indigo-300 font-medium text-[11px] mt-0.5">{p.role}</p>
                    <p className="text-gray-400 text-[10px] line-clamp-2 mt-1 italic">
                      "{p.quote}"
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
