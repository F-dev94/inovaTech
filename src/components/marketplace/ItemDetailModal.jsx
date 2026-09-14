import React, { useState } from 'react';
import { X, Calendar, MapPin, ShieldCheck, Award, AlertTriangle, MessageSquare, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculatePricing } from '../../services/rulesEngine';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Header Modal Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
              {item.category}
            </span>
            {item.ownerIsPro && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                Lojista PRO (9% Comissão)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Image & Owner Info */}
          <div className="md:col-span-7 space-y-4">
            <div className="relative h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-xs text-gray-200">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{item.location} ({item.distanceKm} km)</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white">{item.title}</h2>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">{item.description}</p>
            </div>

            {/* Sensitive Item Moderation Notice */}
            {item.isSensitive && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Item com Trava de Categoria Sensível</span>
                </div>
                <p className="text-gray-300 text-xs">
                  Este item exige nota fiscal/registro verificado pelo analista de Confiança e Segurança antes de ser liberado para entrega.
                </p>
              </div>
            )}

            {/* Owner Info Box */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center font-bold text-indigo-300 border border-indigo-500/40">
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
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-500/30 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat no App</span>
              </button>
            </div>
          </div>

          {/* Right Column - Booking & Transparent Cost Simulator */}
          <div className="md:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Simulação & Período de Reserva</span>
              </h3>

              {/* Date & Days Selector */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1">
                    Duração da Locação
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5, 7].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          days === d
                            ? 'bg-indigo-600 text-white'
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Data Devolução</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown (Transparent Rules) */}
              <div className="mt-5 space-y-2.5 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
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
                  <span>Caução Garantida (Devolvível)</span>
                  <span className="font-semibold">R$ {item.depositAmount.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
                  <span className="font-bold text-gray-200">Total Checkout</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    R$ {totalCheckout.toFixed(2)}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 italic mt-1">
                  *Comissão da plataforma ({item.ownerIsPro ? '9% Lojista PRO' : '18% P2P'}) já embutida de forma transparente no valor.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onStartCheckout(item, days, startDate, endDate);
                }}
                className="w-full gradient-emerald hover:opacity-90 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Reservar e Pagar no App</span>
              </button>

              <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Sem pagamentos por fora. Vistoria digital e repasse via PIX garantidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
