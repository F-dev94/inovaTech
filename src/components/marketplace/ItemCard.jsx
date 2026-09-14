import React from 'react';
import { MapPin, ShieldAlert, Sparkles, Star, Award, CheckCircle } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col h-full border border-slate-800 hover:border-indigo-500/50"
    >
      {/* Thumbnail & Badges Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.ownerIsPro ? (
            <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
              <Award className="w-3 h-3" />
              Lojista PRO (9%)
            </span>
          ) : (
            <span className="bg-indigo-900/90 backdrop-blur-md text-indigo-200 font-bold text-[10px] px-2.5 py-1 rounded-md border border-indigo-500/30">
              Locador P2P
            </span>
          )}

          {item.isBoosted && (
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md animate-pulse-subtle">
              <Sparkles className="w-3 h-3" />
              Destaque
            </span>
          )}
        </div>

        {/* Sensitive Item Badge */}
        {item.isSensitive && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-bold text-[10px] px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              Moderação Exigida
            </span>
          </div>
        )}

        {/* Bottom Distance Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white z-10">
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-700/60 text-[11px]">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span className="font-medium text-gray-200">{item.distanceKm} km • {item.location.split(',')[0]}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
            <span className="text-gray-400 font-normal">({item.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1">
            {item.category}
          </span>
          <h3 className="font-bold text-gray-100 text-sm group-hover:text-indigo-300 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price & Deposit Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block">Diária a partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-emerald-400">
                R$ {item.pricePerDay.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400">/dia</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Caução Garantida</span>
            <span className="text-xs font-semibold text-indigo-300">
              R$ {item.depositAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
