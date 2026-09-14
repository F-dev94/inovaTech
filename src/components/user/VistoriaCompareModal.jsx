import React from 'react';
import { X, Camera, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, CheckSquare } from 'lucide-react';

export default function VistoriaCompareModal({ booking, onClose }) {
  if (!booking) return null;

  const pickupChecklist = booking.inspectionPickup?.checklist || {
    motorTested: true,
    cablesIntact: true,
    accessoriesComplete: true,
    noCracks: true
  };

  const returnChecklist = booking.inspectionReturn?.checklist || {
    motorTested: true,
    cablesIntact: false, // Discrepancy detected!
    accessoriesComplete: true,
    noCracks: false // Discrepancy detected!
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Análise Comparativa de Estado do Item (Check-in vs Check-out) — Reserva #{booking.id}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-white">{booking.itemTitle}</span>
            <span className="text-gray-400">Locatário: {booking.renterName} • Locador: {booking.ownerName}</span>
          </div>

          {/* Checklist Divergence Summary Banner */}
          <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/40 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Divergência de Conservação Detectada entre Empréstimo e Devolução</span>
            </div>
            <p className="text-gray-300 text-[11px]">
              O checklist automático identificou que o equipamento foi entregue com <strong>Cabos Íntegros e Estrutura sem Trincas (OK)</strong>, mas devolvido com <strong>Avaria no Cabo e Estrutura Trincada (DANO)</strong>.
            </p>
          </div>

          {/* Side by Side Photos & Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Photo & Checklist */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Vistoria Empréstimo (Check-in)
                </span>
                <span className="text-[10px] text-gray-400">
                  {booking.inspectionPickup ? new Date(booking.inspectionPickup.timestamp).toLocaleString() : 'Pendente'}
                </span>
              </div>
              <div className="h-44 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={booking.inspectionPickup?.photos?.[0] || booking.itemImage}
                  alt="Foto Checkin"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Checklist items list */}
              <div className="space-y-1 text-[11px] text-gray-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  ✓ Motor/Elétrica: OK
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  ✓ Cabos Fiação: Íntegros (OK)
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  ✓ Carcaça: Sem trincas (OK)
                </div>
              </div>

              <p className="text-xs text-gray-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 italic">
                "{booking.inspectionPickup?.notes || 'Equipamento sem avarias no momento da entrega.'}"
              </p>
            </div>

            {/* Check-out Photo & Checklist */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-rose-400 text-xs flex items-center gap-1">
                  <Camera className="w-4 h-4 text-rose-400" />
                  Vistoria Devolução (Check-out)
                </span>
                <span className="text-[10px] text-gray-400">
                  {booking.inspectionReturn ? new Date(booking.inspectionReturn.timestamp).toLocaleString() : 'Pendente'}
                </span>
              </div>
              <div className="h-44 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={booking.inspectionReturn?.photos?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'}
                  alt="Foto Checkout"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Checklist items list */}
              <div className="space-y-1 text-[11px] text-gray-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  ✓ Motor/Elétrica: OK
                </div>
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  ❌ Cabos Fiação: Danificado / Descascado
                </div>
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  ❌ Carcaça: Trincada por Mau Uso
                </div>
              </div>

              <p className="text-xs text-gray-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 italic">
                "{booking.inspectionReturn?.notes || 'Equipamento devolvido com avaria no cabo e lâmina.'}"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
          >
            Fechar Comparativo de Laudo de Estado
          </button>
        </div>
      </div>
    </div>
  );
}
