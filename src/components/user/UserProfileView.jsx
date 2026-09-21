import React from 'react';
import { ShieldCheck, Star, Clock, CheckCircle2, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { useTrocaJaStore } from '../../services/store';

export default function UserProfileView({ onOpenCreateItem, onSelectItem }) {
  const { activePersona } = useTrocaJaStore();

  const myUserListings = [
    {
      id: 'my-item-1',
      title: 'Esmerilhadeira Makita',
      pricePerDay: 45.00,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80',
      category: 'Ferramentas'
    },
    {
      id: 'my-item-2',
      title: 'Cortador de Grama',
      pricePerDay: 80.00,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=400&auto=format&fit=crop&q=80',
      category: 'Jardim'
    },
    {
      id: 'my-item-3',
      title: 'Maleta de Ferramentas',
      pricePerDay: 30.00,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
      category: 'Ferramentas'
    }
  ];

  return (
    <div className="bg-slate-900 text-white min-h-full p-4 space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="font-extrabold text-lg text-white tracking-tight">Perfil do Usuário</h2>
        <span className="text-xs text-gray-400 font-semibold block">TrocaJá Marketplace</span>
      </div>

      {/* User Info Avatar Box (1:1 Figma Match) */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="relative">
          <img
            src={activePersona.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
            alt={activePersona.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-xl"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-900 shadow-md">
            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-xl text-white">{activePersona.name || 'Carlos Menezes'}</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Membro desde 2024 • <span className="text-amber-400 font-bold">★ 4.8</span>
          </p>
        </div>

        <div className="pt-1">
          <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/40 uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Identidade Verificada
          </span>
        </div>
      </div>

      {/* Metrics Row (1:1 Figma Match: 47 Locações | 4.8 Avaliações | 2h Resposta) */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 grid grid-cols-3 divide-x divide-slate-800 text-center shadow-md">
        <div className="px-2">
          <span className="font-black text-lg text-white block">47</span>
          <span className="text-[11px] text-gray-400 font-medium">Locações</span>
        </div>

        <div className="px-2">
          <span className="font-black text-lg text-white block">4.8</span>
          <span className="text-[11px] text-gray-400 font-medium">Avaliações</span>
        </div>

        <div className="px-2">
          <span className="font-black text-lg text-white block">2h</span>
          <span className="text-[11px] text-gray-400 font-medium">Resposta</span>
        </div>
      </div>

      {/* Meus Anúncios (3) Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-white">Meus Anúncios (3)</h4>
          <button 
            onClick={onOpenCreateItem}
            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Anúncio</span>
          </button>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {myUserListings.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 group hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col"
            >
              <div className="h-20 w-full overflow-hidden bg-slate-800 relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <h5 className="font-bold text-[11px] text-gray-200 line-clamp-1">{item.title}</h5>
                <span className="text-xs font-black text-emerald-400 mt-1 block">
                  R$ {item.pricePerDay.toFixed(0)}/dia
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TrocaJá Pro Upgrade Banner Card (1:1 Figma Match) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 rounded-2xl p-4 border border-emerald-500/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[220px]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <h4 className="font-black text-white text-base">TrocaJá Pro</h4>
            </div>
            <p className="text-xs text-emerald-100 font-medium leading-tight">
              Crie anúncios ilimitados, ganhe selo de destaque e taxas de comissão reduzidas.
            </p>
          </div>

          <button className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow-lg transition-all uppercase tracking-wider flex-shrink-0">
            Upgrade
          </button>
        </div>
      </div>

    </div>
  );
}
