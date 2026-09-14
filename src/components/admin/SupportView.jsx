import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, ShieldCheck, Send, User, Check, X } from 'lucide-react';

export default function SupportView() {
  const { state, actions, activePersona } = useTrocaJaStore();
  const [activeTicketId, setActiveTicketId] = useState('TCK-901');
  const [ticketMessages, setTicketMessages] = useState([
    {
      id: 'm1',
      ticketId: 'TCK-901',
      sender: 'Bianca Ferreira (Cliente)',
      text: 'Olá Camila! Tive uma dúvida sobre a devolução da caução de R$ 350 da serra circular. Como funciona a retenção?',
      time: '14:20'
    },
    {
      id: 'm2',
      ticketId: 'TCK-901',
      sender: 'Camila Torres (Atendente Suporte)',
      text: 'Oi Bianca! No TrocaJá a caução é calculada pelo Motor de Regras após o envio da vistoria de devolução. Se o item estiver sem avarias, o valor é devolvido 100% via PIX automaticamente.',
      time: '14:22'
    },
    {
      id: 'm3',
      ticketId: 'TCK-902',
      sender: 'Diego Farias (Cliente)',
      text: 'Boa tarde! Preciso alterar o horário de retirada do kit de som com o Antenor. Vocês conseguem intermediar?',
      time: '14:35'
    }
  ]);
  const [replyText, setReplyText] = useState('');

  const tickets = [
    { id: 'TCK-901', user: 'Bianca Ferreira', clientPersonaId: 'bianca', subject: 'Dúvida sobre devolução de caução', time: 'Há 5 min', status: 'EM_ATENDIMENTO', sla: '12 min restante' },
    { id: 'TCK-902', user: 'Diego Farias', clientPersonaId: 'diego', subject: 'Divergência de horário para retirada', time: 'Há 18 min', status: 'EM_ATENDIMENTO', sla: '5 min restante' }
  ];

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];
  const currentChatMsgs = ticketMessages.filter(m => m.ticketId === activeTicketId);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      ticketId: activeTicketId,
      sender: 'Camila Torres (Atendente Suporte)',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTicketMessages(prev => [...prev, newMsg]);
    setReplyText('');

    actions.pushNotification(
      '💬 Resposta do Suporte Enviada',
      `Camila enviou mensagem para ${activeTicket.user} no chamado #${activeTicketId}.`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Camila Torres Header Persona Context */}
      <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Painel Atendente de Suporte (Visão Camila Torres)
          </h3>
          <p className="text-gray-300 text-xs mt-0.5">
            Atendimento direto com o cliente pelo sistema com critérios fixos de resolução e SLA.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/40">
            SLA Médio: 12 min
          </span>
        </div>
      </div>

      {/* Main Support Workspace Grid (Tickets + Live Chat Window) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets Queue List */}
        <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-white text-sm">Fila de Chamados Ativos</h4>

          <div className="space-y-3">
            {tickets.map((tck) => {
              const isSelected = tck.id === activeTicketId;
              return (
                <div
                  key={tck.id}
                  onClick={() => setActiveTicketId(tck.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{tck.id} • {tck.user}</span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {tck.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs font-medium mt-1">{tck.subject}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2.5 mt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      SLA: {tck.sla}
                    </span>
                    <span className="text-indigo-400 font-bold text-[10px]">
                      {isSelected ? '✓ Selecionado' : 'Atender Chamado →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Direct Customer Support Chat Window (FIXED USER FEEDBACK) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
          {/* Support Chat Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-xs">
                {activeTicket.user.charAt(0)}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">
                  Atendimento Direto: {activeTicket.user} (#{activeTicket.id})
                </h4>
                <p className="text-gray-400 text-[10px]">{activeTicket.subject}</p>
              </div>
            </div>

            <button
              onClick={() => alert(`✅ Chamado #${activeTicket.id} resolvido com sucesso por Camila Torres!`)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-all"
            >
              Concluir Chamado
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
            {currentChatMsgs.map((msg) => {
              const isSupport = msg.sender.includes('Camila') || msg.sender.includes('Suporte');
              return (
                <div key={msg.id} className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-400 font-semibold mb-1">
                    {msg.sender} • {msg.time}
                  </span>
                  <div
                    className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                      isSupport
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box for Camila Torres */}
          <form onSubmit={handleSendReply} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Escreva uma resposta para ${activeTicket.user}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 text-xs shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Responder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
