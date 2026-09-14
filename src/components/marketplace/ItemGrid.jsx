import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import ItemCard from './ItemCard';
import { Search, MapPin, SlidersHorizontal, Sparkles, ShieldCheck, Award } from 'lucide-react';

export default function ItemGrid({ onSelectItem }) {
  const { state, actions } = useTrocaJaStore();
  const [onlyPro, setOnlyPro] = useState(false);

  const categories = [
    'TODOS',
    'Ferramentas',
    'Eventos & Áudio',
    'Drones & Filmagem',
    'Réplicas & Tático'
  ];

  // Filtering items by search query, distance, category, and pro badge
  const filteredItems = state.items.filter((item) => {
    // Distance filter (RF03 - Geolocation search)
    if (item.distanceKm > state.filterDistanceKm) return false;

    // Category filter
    if (state.filterCategory !== 'TODOS' && !item.category.includes(state.filterCategory)) {
      return false;
    }

    // Only PRO filter
    if (onlyPro && !item.ownerIsPro) return false;

    // Search query filter
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !catMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Distance Geolocation Control Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Main Search Input */}
          <div className="lg:col-span-6 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              placeholder="O que você precisa alugar hoje? (ex: Betoneira, Serra, Drone, Kit Som)..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Distance Filter Slider (RF03 Geolocation) */}
          <div className="lg:col-span-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-gray-300">Raio de Geolocalização</span>
                <span className="text-indigo-400 font-bold">{state.filterDistanceKm} km de você</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={state.filterDistanceKm}
                onChange={(e) => actions.setFilterDistanceKm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* PRO Lojista Toggle Filter */}
          <div className="lg:col-span-2 flex items-center justify-end">
            <button
              onClick={() => setOnlyPro(!onlyPro)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                onlyPro
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-gray-400 hover:border-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Apenas Lojistas PRO</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 mr-1 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Categorias:
          </span>
          {categories.map((cat) => {
            const isActive = state.filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => actions.setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-gray-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Counter & Status */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Exibindo <strong className="text-white">{filteredItems.length}</strong> itens disponíveis com disponibilidade confirmada no calendário
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Caução Garantida TrocaJá em todos os itens
        </span>
      </div>

      {/* Grid of Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-gray-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum item encontrado</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Tente aumentar o raio de geolocalização ({state.filterDistanceKm} km) ou limpar os termos de busca.
          </p>
          <button
            onClick={() => {
              actions.setSearchQuery('');
              actions.setFilterCategory('TODOS');
              actions.setFilterDistanceKm(50);
              setOnlyPro(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
          >
            Redefinir Filtros
          </button>
        </div>
      )}
    </div>
  );
}
