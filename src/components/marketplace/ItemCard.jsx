import React from 'react';
import { MapPin, ShieldAlert, Sparkles, Star, Award } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80';

export default function ItemCard({ item, onClick }) {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col h-full border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/10"
    >
      {/* Thumbnail & Badges Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent pointer-events-none"></div>

        {/* Top Badges Layer */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
          <div className="flex flex-wrap gap-1.5 max-w-[70%]">
            {item.ownerIsPro ? (
              <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Award className="w-3 h-3" />
                Lojista PRO (9%)
              </span>
            ) : (
              <span className="bg-slate-900/90 backdrop-blur-md text-indigo-300 font-extrabold text-[10px] px-2.5 py-1 rounded-lg border border-indigo-500/30 shadow-md">
                Locador P2P
              </span>
            )}

            {item.isBoosted && (
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Destaque
              </span>
            )}
          </div>

          {/* Sensitive Item Badge (Drones & Réplicas/Airsoft/Armas de Pressão) */}
          {item.isSensitive && (
            <span className="bg-rose-950/95 border border-rose-500/80 text-rose-200 font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg shadow-rose-950/80 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              🔒 Supervisão Reforçada T&S
            </span>
          )}
        </div>

        {/* Bottom Distance & Rating Badges Layer */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/60 text-[11px] font-medium">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="text-gray-200 truncate max-w-[120px]">
              {item.distanceKm} km • {item.location?.split(',')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating || '4.8'}</span>
            <span className="text-gray-400 font-normal">({item.reviewsCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-slate-900/90">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">
            {item.category}
          </span>
          <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight">
            {item.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Deposit Summary */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Diária a partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-400">
                R$ {item.pricePerDay.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400">/dia</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 block font-medium">Caução Garantida</span>
            <span className="text-xs font-bold text-indigo-300">
              R$ {item.depositAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
