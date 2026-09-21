import React from 'react';
import { Search, Calendar, MessageSquare, User, Wifi, Battery, Signal } from 'lucide-react';

export default function MobileDeviceSimulator({ 
  children, 
  currentScreen, 
  onSelectScreen,
  isSimulatorActive = true 
}) {
  if (!isSimulatorActive) {
    return <div className="w-full">{children}</div>;
  }

  // Active bottom tab detection
  const getActiveTab = () => {
    if (['explore', 'detail', 'payment', 'create'].includes(currentScreen)) return 'explore';
    if (['damage'].includes(currentScreen)) return 'rentals';
    if (['finance'].includes(currentScreen)) return 'rentals';
    if (['profile'].includes(currentScreen)) return 'profile';
    return 'explore';
  };

  const activeTab = getActiveTab();

  return (
    <div className="w-full flex justify-center py-6 px-2 bg-slate-950/40 min-h-[calc(100vh-60px)]" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
      {/* Smartphone Frame Outer Container */}
      <div className="w-full max-w-[390px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 ring-1 ring-slate-700/50 my-auto min-h-[780px]">
        
        {/* Mobile Top Status Bar (iOS / Android Style) */}
        <div className="bg-slate-950 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none z-30 border-b border-slate-800/40">
          <span className="font-bold text-xs tracking-tight font-mono text-gray-200">9:41</span>
          
          {/* Dynamic Island / Camera Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Screen Body Content Container */}
        <div className="flex-1 bg-slate-900 overflow-hidden relative scrollbar-none flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar (Figma Prototype Match) */}
        <div className="bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around z-30 select-none">
          <button
            onClick={() => onSelectScreen('explore')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'explore' 
                ? 'text-emerald-400 font-extrabold scale-105' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold">Explorar</span>
          </button>

          <button
            onClick={() => onSelectScreen('damage')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'rentals' 
                ? 'text-emerald-400 font-extrabold scale-105' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold">Reservas</span>
          </button>

          <button
            onClick={() => onSelectScreen('finance')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'finance' 
                ? 'text-emerald-400 font-extrabold scale-105' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold">Ganhos</span>
          </button>

          <button
            onClick={() => onSelectScreen('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'profile' 
                ? 'text-emerald-400 font-extrabold scale-105' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </div>

        {/* iPhone Bottom Home Bar Indicator */}
        <div className="bg-slate-950 pb-1.5 flex justify-center z-30">
          <div className="w-32 h-1 bg-gray-600/70 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
