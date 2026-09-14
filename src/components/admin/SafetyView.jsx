import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, Calculator, History, Sparkles } from 'lucide-react';
import { calculateCautionRetention } from '../../services/rulesEngine';

export default function SafetyView() {
  const { state, actions, activePersona } = useTrocaJaStore();
  const [selectedDispute, setSelectedDispute] = useState(state.disputes[0] || null);
  const [overrideRetentionPct, setOverrideRetentionPct] = useState('');
  const [analystNotes, setAnalystNotes] = useState('');

  const pendingSensitiveItems = state.items.filter(i => i.isSensitive && i.sensitiveDocStatus === 'EM_ANALISE');

  const handleResolveDispute = (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    const finalPct = overrideRetentionPct !== '' ? Number(overrideRetentionPct) : selectedDispute.suggestedRetentionPct;

    actions.resolveDispute({
      disputeId: selectedDispute.id,
      finalRetentionPct: finalPct,
      analystNotes: analystNotes || 'Decisão aprovada com base na vistoria digital e histórico do usuário.'
    });

    setOverrideRetentionPct('');
    setAnalystNotes('');
    alert('✅ Decisão gravada com sucesso na Trilha de Auditoria imutável!');
  };

  return (
    <div className="space-y-6">
      {/* Header Context for Lucas Andrade */}
      <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm">
            Módulo Confiança & Segurança (Visão Lucas Andrade)
          </h3>
          <p className="text-gray-300 text-xs mt-0.5">
            Motor de regras de caução parametrizado com decisão auditável sem remover o julgamento humano.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/40">
            {state.disputes.filter(d => d.status === 'EM_ANALISE').length} Disputas em Aberto
          </span>
        </div>
      </div>

      {/* Sensitive Item Moderation Queue (RF02) */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Fila de Moderação por Categoria Sensível (Drones / Réplicas)
        </h4>

        {pendingSensitiveItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSensitiveItems.map((item) => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{item.title}</span>
                  <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    DOCUMENTO PENDENTE
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{item.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <a
                    href={item.sensitiveDocUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-semibold text-xs hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Doc Anexo</span>
                  </a>

                  <div className="flex gap-2">
                    <button
                      onClick={() => actions.moderateSensitiveItem(item.id, 'APROVADO')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-lg"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => actions.moderateSensitiveItem(item.id, 'REJEITADO')}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-lg"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Nenhum item sensível aguardando moderação no momento. Todos os cadastros com documentos aprovados.
          </p>
        )}
      </div>

      {/* Rules Engine Caution Dispute Resolution Hub (RF07) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Disputes List */}
        <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            Disputas de Caução Pendentes
          </h4>

          <div className="space-y-3">
            {state.disputes.map((disp) => {
              const isSelected = selectedDispute && selectedDispute.id === disp.id;
              return (
                <div
                  key={disp.id}
                  onClick={() => setSelectedDispute(disp)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>#{disp.id} • {disp.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      disp.status === 'RESOLVIDA' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {disp.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 font-medium truncate">{disp.itemTitle}</p>
                  <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                    <span>Locatário: {disp.renterName}</span>
                    <span className="text-indigo-300 font-semibold">Caução: R$ {disp.totalDeposit.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Rules Engine Calculator & Audit Trail */}
        <div className="lg:col-span-7 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-5">
          {selectedDispute ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-white text-base">
                    Julgamento da Disputa #{selectedDispute.id}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Avaria reportada: <strong className="text-rose-400">{selectedDispute.reportedDamageLevel}</strong>
                  </p>
                </div>
                <span className="text-xs text-indigo-400 font-bold bg-indigo-950 p-2 rounded-lg border border-indigo-500/30">
                  Total Caução: R$ {selectedDispute.totalDeposit.toFixed(2)}
                </span>
              </div>

              {/* Rules Engine Suggestion Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Sugestão do Motor de Regras (Rules Engine)
                  </span>
                  <span className="bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded text-xs">
                    {selectedDispute.suggestedRetentionPct}% Retenção (R$ {selectedDispute.suggestedRetentionAmount.toFixed(2)})
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedDispute.description}
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                  Devolução sugerida ao locatário: R$ {selectedDispute.suggestedRefundAmount.toFixed(2)}
                </div>
              </div>

              {/* Decision Form & Override */}
              {selectedDispute.status === 'EM_ANALISE' ? (
                <form onSubmit={handleResolveDispute} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-gray-300 font-bold block mb-1">
                        Percentual de Retenção Decidido (%)
                      </label>
                      <input
                        type="number"
                        placeholder={`Sugerido: ${selectedDispute.suggestedRetentionPct}%`}
                        value={overrideRetentionPct}
                        onChange={(e) => setOverrideRetentionPct(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-bold block mb-1">
                        Analista Responsável
                      </label>
                      <input
                        type="text"
                        disabled
                        value={activePersona.name}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 font-bold block mb-1">
                      Parecer e Justificativa para a Trilha de Auditoria
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Descreva a fundamentação técnica baseada nas fotos de entrada e saída..."
                      value={analystNotes}
                      onChange={(e) => setAnalystNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full gradient-emerald hover:opacity-90 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all"
                  >
                    Gravar Decisão e Atualizar Trilha Imutável
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Disputa Resolvida e Auditada</span>
                  </div>
                  <p className="text-gray-300">
                    Retenção final: <strong>{selectedDispute.finalRetentionPct}%</strong> (R$ {selectedDispute.finalRetentionAmount?.toFixed(2)})
                  </p>
                </div>
              )}

              {/* Audit Logs Trail */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  Trilha de Auditoria Imutável (Audit Trail)
                </h5>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedDispute.auditLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-0.5">
                      <div className="flex justify-between font-semibold text-indigo-300">
                        <span>{log.author} — {log.action}</span>
                        <span className="text-gray-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-300">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400">Selecione uma disputa para visualizar o julgamento do motor de regras.</p>
          )}
        </div>
      </div>
    </div>
  );
}
