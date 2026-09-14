import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, QrCode } from 'lucide-react';

export default function PwaInstallBanner({ onOpenQrModal }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (onOpenQrModal) {
      onOpenQrModal();
    } else {
      alert('📱 Para instalar o TrocaJá no seu celular:\n\n• No Android/Chrome: Toque nos 3 pontos no topo e selecione "Adicionar à tela inicial" ou "Instalar aplicativo".\n• No iPhone/Safari: Toque no botão Compartilhar (quadrado com seta) e selecione "Adicionar à Tela de Início".');
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-slate-900/90 border-b border-indigo-500/30 text-white py-2 px-4 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xs block">
              Instale o App TrocaJá no seu Celular (PWA)
            </span>
            <span className="text-[10px] text-indigo-200">
              Acesso rápido sem ocupar memória da loja de aplicativos!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQrModal}
            className="bg-indigo-700 hover:bg-indigo-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm border border-indigo-400/40"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Ver QR Code</span>
          </button>

          <button
            onClick={handleInstallClick}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar / Instalar PWA</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
