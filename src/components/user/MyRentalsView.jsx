import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { Camera, ShieldAlert, Star, CheckCircle2, Clock, FileText, AlertTriangle, Eye } from 'lucide-react';
import VistoriaCompareModal from './VistoriaCompareModal';

export default function MyRentalsView({ onOpenVistoria, onOpenDispute, onAddReview }) {
  const { state, activePersona } = useTrocaJaStore();
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [compareBooking, setCompareBooking] = useState(null);

  // Filter bookings for active user (either renter or owner)
  const myBookings = state.bookings.filter(
    b => b.renterId === activePersona.id || b.ownerId === activePersona.id
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewBookingId) return;

    onAddReview({
      bookingId: reviewBookingId,
      revieweeName: activePersona.userRole === 'locatario' ? 'Carlos Menezes' : 'Bianca Ferreira',
      rating: Number(reviewRating),
      comment: reviewComment
    });

    setReviewBookingId(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base">
            Minhas Reservas & Vistorias Digitais ({activePersona.name})
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Acompanhe o status do aluguel, execute o check-in/check-out de vistoria e abra disputas de caução.
          </p>
        </div>
      </div>

      {myBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {myBookings.map((b) => (
            <div key={b.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={b.itemImage}
                    alt={b.itemTitle}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-400 block">Reserva #{b.id}</span>
                    <h4 className="font-bold text-white text-sm">{b.itemTitle}</h4>
                    <p className="text-gray-400 text-xs">
                      Período: {b.startDate} até {b.endDate} ({b.days} dias)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === 'EM_DISPUTA'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : b.status === 'FINALIZADA'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {b.status}
                  </span>
                  <p className="text-xs font-extrabold text-emerald-400 mt-1">
                    Total Pago: R$ {b.totalPaid.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Inspection Status Check-in / Check-out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-300 block">📸 Vistoria Retirada (Check-in)</span>
                    <span className="text-[11px] text-gray-400">
                      {b.inspectionPickup ? `Registrada às ${new Date(b.inspectionPickup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Pendente de envio'}
                    </span>
                  </div>
                  {!b.inspectionPickup ? (
                    <button
                      onClick={() => onOpenVistoria(b, 'pickup')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg"
                    >
                      Enviar Fotos
                    </button>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-300 block">📸 Vistoria Devolução (Check-out)</span>
                    <span className="text-[11px] text-gray-400">
                      {b.inspectionReturn ? `Registrada às ${new Date(b.inspectionReturn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Pendente de envio'}
                    </span>
                  </div>
                  {!b.inspectionReturn ? (
                    <button
                      onClick={() => onOpenVistoria(b, 'return')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg"
                    >
                      Enviar Fotos
                    </button>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* Action Buttons: Dispute & Review & Compare */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setCompareBooking(b)}
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Comparar Vistorias Lado a Lado</span>
                </button>

                {b.status !== 'EM_DISPUTA' && (
                  <button
                    onClick={() => onOpenDispute(b)}
                    className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Abrir Disputa de Caução</span>
                  </button>
                )}

                <button
                  onClick={() => setReviewBookingId(b.id)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ml-auto"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Avaliar Experiência</span>
                </button>
              </div>

              {/* Review Writing Form with Threat Anti-Blackmail Protection */}
              {reviewBookingId === b.id && (
                <form onSubmit={handleReviewSubmit} className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Avaliar Locação #{b.id}</span>
                    <button type="button" onClick={() => setReviewBookingId(null)} className="text-gray-400 text-xs">Cancelar</button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">Nota:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Escreva seu comentário sincero sobre o estado do equipamento e pontualidade..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />

                  <p className="text-[10px] text-indigo-300">
                    🛡️ Detecção de Chantagem Ativa: Avaliações com ameaças ou notas baixas condicionadas a devolução de caução são sinalizadas automaticamente para revisão do time de Confiança e Segurança.
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2 rounded-xl"
                  >
                    Publicar Avaliação
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Nenhuma reserva encontrada para o perfil ativo.</p>
      )}

      {compareBooking && (
        <VistoriaCompareModal
          booking={compareBooking}
          onClose={() => setCompareBooking(null)}
        />
      )}
    </div>
  );
}
