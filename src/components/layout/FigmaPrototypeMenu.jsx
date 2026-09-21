import React, { useState } from 'react';
import { 
  Smartphone, Monitor, Sun, Moon, Sparkles, ChevronDown, 
  Search, LogIn, ShieldCheck, Package, CreditCard, 
  AlertTriangle, DollarSign, User, PlusCircle, Shield
} from 'lucide-react';

export default function FigmaPrototypeMenu({ 
  currentScreen, 
  onSelectScreen, 
  isMobileSimulator, 
  onToggleMobileSimulator,
  themeMode,
  onToggleTheme
}) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const screens = [
    { id: 'explore', label: '1. Explorar (Home)', icon: Search, badge: 'Grid Figma' },
    { id: 'login', label: '2. Login & Cadastro', icon: LogIn, badge: 'Auth' },
    { id: 'kyc', label: '3. Verificação de Identidade (KYC)', icon: ShieldCheck, badge: 'Passo 2/3' },
    { id: 'detail', label: '4. Detalhes do Produto (SUP)', icon: Package, badge: 'R$ 80/dia' },
    { id: 'payment', label: '5. Pagamento PIX', icon: CreditCard, badge: 'R$ 388,80' },
    { id: 'damage', label: '6. Resolução de Danos (Vistoria)', icon: AlertTriangle, badge: 'Contrato #9421' },
    { id: 'finance', label: '7. Painel Financeiro', icon: DollarSign, badge: 'R$ 2.847,00' },
    { id: 'profile', label: '8. Perfil do Usuário', icon: User, badge: 'Carlos Menezes' },
    { id: 'create', label: '9. Cadastrar Anúncio', icon: PlusCircle, badge: 'Novo Item' },
    { id: 'admin', label: '10. Painel Gestor / Admin', icon: Shield, badge: 'Operacional' },
  ];

  const activeScreenObj = screens.find(s => s.id === currentScreen) || screens[0];
  const ActiveIcon = activeScreenObj.icon;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left: Menu Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-md transition-all border border-emerald-400/40"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-emerald-100 hidden sm:inline">Navegação do Protótipo:</span>
            <ActiveIcon className="w-4 h-4 text-white" />
            <span className="font-bold">{activeScreenObj.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpenMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Items */}
          {isOpenMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpenMenu(false)} 
              />
              <div className="absolute left-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Telas do Protótipo Figma</span>
                  <span>10 Modos</span>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                  {screens.map((screen) => {
                    const Icon = screen.icon;
                    const isActive = currentScreen === screen.id;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => {
                          onSelectScreen(screen.id);
                          setIsOpenMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-semibold text-xs transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white font-bold shadow-md'
                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                          <span className="truncate">{screen.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold flex-shrink-0 ml-1 ${
                          isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-gray-400'
                        }`}>
                          {screen.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center: Quick Screen Pills Horizontal (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-0.5">
          {screens.slice(0, 6).map((screen) => {
            const Icon = screen.icon;
            const isActive = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => onSelectScreen(screen.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{screen.label.split('.')[1].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Simulator Frame & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Mobile Simulator Toggle */}
          <button
            onClick={onToggleMobileSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
              isMobileSimulator
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                : 'bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Alternar entre formato de aplicativo celular e visualização em tela cheia"
          >
            {isMobileSimulator ? (
              <>
                <Smartphone className="w-4 h-4 text-slate-950" />
                <span>Simulador Celular ON</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Visualização Tela Cheia</span>
              </>
            )}
          </button>

          {/* Theme Light / Dark Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 px-2.5 py-1.5 rounded-xl font-semibold text-xs transition-all"
            title="Alternar tema visual"
          >
            {themeMode === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Tema Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Tema Escuro</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
