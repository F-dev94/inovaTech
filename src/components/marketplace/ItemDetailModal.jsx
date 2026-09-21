import React, { useState } from 'react';
import { X, Calendar, MapPin, ShieldCheck, Award, ShieldAlert, MessageSquare, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculatePricing } from '../../services/rulesEngine';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80';

export default function ItemDetailModal({ item, onClose, onStartCheckout, onOpenChat }) {
  const [days, setDays] = useState(2);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-17');

  if (!item) return null;

  const pricing = calculatePricing({
    pricePerDay: item.pricePerDay,
    days,
    isPro: item.ownerIsPro,
    isBoosted: item.isBoosted
  });

  const totalCheckout = pricing.subtotal + pricing.insuranceFee + item.depositAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Container: Max 50% width on desktop (max-w-2xl) with max-h-[90vh] */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Sticky Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black tracking-wider text-emerald-400">
              {item.category}
            </span>
            {item.ownerIsPro ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                Lojista PRO (9% Comissão)
              </span>
            ) : (
              <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                Locador P2P (18%)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs scrollbar-none">
          
          {/* Main Hero Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center">
            <img
              src={item.image || FALLBACK_IMAGE}
              alt={item.title}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
              className="w-full h-full object-contain bg-slate-950"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 flex items-center gap-1.5 text-xs text-gray-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.location} ({item.distanceKm} km)</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight">{item.title}</h2>
            <p className="text-gray-300 text-xs mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* SUPERVISÃO REFORÇADA T&S BANNER (Airsoft & Drones) */}
          {item.isSensitive && (
            <div className="bg-rose-950/60 border-2 border-rose-500/70 p-4 rounded-2xl space-y-1.5 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-200 font-black text-xs">
                <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
                <span>🔒 ITEM SOB SUPERVISÃO REFORÇADA (CONFIA & SEGURANÇA T&S)</span>
              </div>
              <p className="text-gray-200 text-[11px] leading-relaxed">
                Este equipamento (<strong className="text-white">Drones / Réplicas & Armas de Pressão Airsoft</strong>) possui trava de segurança obrigatória. Exige licença ANAC ou nota fiscal validada pelo analista de segurança antes do envio. A transação e caução são auditadas em tempo real.
              </p>
            </div>
          )}

          {/* Owner Info Box */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600/30 flex items-center justify-center font-bold text-emerald-300 border border-emerald-500/40">
                {item.ownerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">{item.ownerName}</h4>
                <p className="text-gray-400 text-[11px]">
                  {item.ownerIsPro ? 'Lojista Parceiro Verificado' : 'Locador Amador (P2P)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChat(item)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat no App</span>
            </button>
          </div>

          {/* Período de Reserva & Simulação */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Simulação & Período de Locação</span>
            </h3>

            <div>
              <label className="text-gray-400 font-semibold block mb-1">
                Duração da Locação
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      days === d
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-900 text-gray-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {d} {d === 1 ? 'dia' : 'dias'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Data Retirada</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Data Devolução</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2 text-xs bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-gray-300">
                <span>Aluguel ({days} x R$ {item.pricePerDay.toFixed(2)})</span>
                <span className="font-semibold text-white">R$ {pricing.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-emerald-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Seguro Proteção TrocaJá
                </span>
                <span className="font-semibold">R$ {pricing.insuranceFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-indigo-300">
                <span>Caução Garantida (Devolvível PIX)</span>
                <span className="font-semibold">R$ {item.depositAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-gray-200">Total Checkout</span>
                <span className="text-lg font-black text-emerald-400">
                  R$ {totalCheckout.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onStartCheckout(item, days, startDate, endDate);
              }}
              className="w-full gradient-emerald hover:opacity-90 text-white font-black text-xs py-3 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Reservar e Pagar no App via PIX</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
