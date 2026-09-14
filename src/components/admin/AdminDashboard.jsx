import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import SupportView from './SupportView';
import SafetyView from './SafetyView';
import FinancialView from './FinancialView';
import HeadDashboard from './HeadDashboard';
import { Headphones, ShieldCheck, DollarSign, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { activePersona } = useTrocaJaStore();
  const [subTab, setSubTab] = useState(
    activePersona.userRole === 'suporte'
      ? 'support'
      : activePersona.userRole === 'seguranca'
      ? 'safety'
      : activePersona.userRole === 'financeiro'
      ? 'financial'
      : 'head'
  );

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setSubTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'support'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Suporte (Camila)</span>
        </button>

        <button
          onClick={() => setSubTab('safety')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'safety'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confiança & Segurança (Lucas)</span>
        </button>

        <button
          onClick={() => setSubTab('financial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'financial'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financeiro (Patrícia)</span>
        </button>

        <button
          onClick={() => setSubTab('head')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'head'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Diretoria & Head (Renata)</span>
        </button>
      </div>

      {/* Render Sub-View */}
      {subTab === 'support' && <SupportView />}
      {subTab === 'safety' && <SafetyView />}
      {subTab === 'financial' && <FinancialView />}
      {subTab === 'head' && <HeadDashboard />}
    </div>
  );
}
