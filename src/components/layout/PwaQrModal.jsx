import React, { useEffect, useRef, useState } from 'react';
import { X, QrCode, Smartphone, CheckCircle2, Download, Copy, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

/**
 * PwaQrModal — Exibe um QR Code REAL gerado pela biblioteca `qrcode`
 * apontando para a URL atual do app (ou localhost:5173 em dev).
 * Permite copiar o link e baixar o QR como imagem PNG.
 */
export default function PwaQrModal({ onClose }) {
  const canvasRef = useRef(null);
  const [appUrl, setAppUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    // Usa a URL real do app em produção; localhost em dev
    const url = window.location.href.split('?')[0].split('#')[0] || 'http://localhost:5173/';
    setAppUrl(url);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 2,
        color: {
          dark: '#0f172a',  // dark slate
          light: '#ffffff'  // branco
        },
        errorCorrectionLevel: 'H'
      }, (err) => {
        if (!err) setQrGenerated(true);
      });
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'TrocaJa-QRCode-PWA.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-6">

        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">QR Code PWA — Baixar App no Celular</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-3.5 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
            📲 <strong>Instalação Rápida PWA</strong>: Aponte a câmera do seu celular para o QR Code abaixo
            para abrir e instalar o TrocaJá na sua tela inicial sem usar a App Store!
          </div>

          {/* QR Code Real gerado pelo canvas */}
          <div className="flex flex-col items-center gap-2">
            <div className={`bg-white p-3 rounded-2xl shadow-xl border-4 transition-all duration-500 ${
              qrGenerated ? 'border-emerald-500/80 opacity-100' : 'border-slate-300 opacity-50'
            }`}>
              <canvas ref={canvasRef} className="rounded-xl block" />
            </div>

            {qrGenerated ? (
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> QR Code Real Gerado com Sucesso
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 font-mono">Gerando QR Code...</span>
            )}
          </div>

          {/* URL do App */}
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[11px] font-mono text-gray-300 truncate bg-slate-950 p-2 rounded-lg border border-slate-800 text-left">
              {appUrl || 'Carregando URL...'}
            </p>
            <button
              onClick={handleCopyLink}
              title="Copiar link"
              className={`p-2 rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 3 Step Instruction Guide */}
          <div className="space-y-2 text-left text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <p className="font-bold text-gray-300 mb-2">Como instalar no celular:</p>
            <div className="flex items-start gap-2 text-gray-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span><strong className="text-white">Android/Chrome:</strong> Abra a câmera e escaneie o código, depois toque em <strong>"Adicionar à tela inicial"</strong>.</span>
            </div>
            <div className="flex items-start gap-2 text-gray-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span><strong className="text-white">iPhone/Safari:</strong> Escaneie o código, abra no Safari, toque em <strong>Compartilhar</strong> (⬆) → <strong>"Adicionar à Tela de Início"</strong>.</span>
            </div>
            <div className="flex items-start gap-2 text-gray-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>O TrocaJá abrirá como <strong className="text-white">app nativo</strong> sem precisar da App Store!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadQr}
              disabled={!qrGenerated}
              className="gradient-emerald hover:opacity-90 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar QR Code
            </button>
            <button
              onClick={() => window.open(appUrl, '_blank')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir Link
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-300 text-xs py-1 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
