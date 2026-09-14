import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { MessageSquare, Send, ShieldAlert, Lock, CheckCircle2, AlertTriangle, Repeat, PhoneOff } from 'lucide-react';

export default function SecureChatModal({ onStartCheckout }) {
  const { state, actions, activePersona } = useTrocaJaStore();
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    actions.sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              Chat Seguro com Monitoramento Anti-Vazamento
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/40">
                IA Ativa
              </span>
            </h3>
            <p className="text-gray-400 text-xs">
              Conversa direta entre Locador e Locatário. Negociações fora do app anulam o Seguro e a Caução.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {state.messages.map((msg) => {
            const isMe = msg.senderId === activePersona.id;
            return (
              <div key={msg.id} className="space-y-2">
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-400 font-semibold mb-1">
                    {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* AI Bypass Warning Banner if triggered */}
                {msg.isBypassDetected && (
                  <div className="bg-rose-950/70 border border-rose-500/50 p-3 rounded-xl max-w-lg mx-auto text-xs space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{msg.bypassReason}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-snug">
                      {msg.warningMessage}
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const targetItem = state.items[0];
                          onStartCheckout(targetItem, 2, '2026-09-15', '2026-09-17');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Repeat className="w-3 h-3" />
                        <span>Converter para Reserva Protegida no App</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Preset Prompt Shortcuts for Simulation */}
        <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-[11px] overflow-x-auto">
          <span className="text-gray-400 font-semibold px-2">Testar Mensagens:</span>
          <button
            onClick={() => setInputText('Olá! Gostaria de reservar para este fim de semana.')}
            className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-2.5 py-1 rounded-lg whitespace-nowrap"
          >
            "Reserva normal"
          </button>
          <button
            onClick={() => setInputText('Me passa seu PIX 1699887766 pra pagar por fora com desconto?')}
            className="bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-500/40 px-2.5 py-1 rounded-lg whitespace-nowrap font-bold"
          >
            "🔥 Simular Vazamento (PIX Por Fora)"
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escreva sua mensagem com segurança aqui..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
