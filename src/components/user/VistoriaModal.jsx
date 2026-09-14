import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { X, Camera, ShieldCheck, Upload, AlertCircle, CheckCircle2, CheckSquare, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';

export default function VistoriaModal({ booking, stage = 'pickup', onClose }) {
  const { actions } = useTrocaJaStore();
  const isPickup = stage === 'pickup';

  // Interactive Checklist State
  const [checklist, setChecklist] = useState({
    motorTested: true,
    cablesIntact: isPickup ? true : false,
    accessoriesComplete: true,
    structureClean: true,
    noCracks: isPickup ? true : false
  });

  const [cleanlinessLevel, setCleanlinessLevel] = useState(isPickup ? 'EXCELENTE' : 'SUJO_COM_AVARIA');
  const [notes, setNotes] = useState(
    isPickup
      ? 'Equipamento entregue em perfeito estado, testado em tomada de 220V com o locatário presente. Acompanha maleta e disco novo.'
      : 'Devolução realizada com marcas profundas na carcaça, cabo elétrico descascado e lâmina de corte com dente quebrado.'
  );

  const [uploadedPhotos, setUploadedPhotos] = useState([
    booking.itemImage,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
  ]);

  const [signatureConfirmed, setSignatureConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Photo Upload from Gallery for Inspection
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos(prev => [event.target.result, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveVistoria = async (e) => {
    e.preventDefault();

    if (!signatureConfirmed) {
      alert('⚠️ Por favor, confirme a checagem presencial com a outra parte antes de assinar o laudo.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    actions.saveInspection({
      bookingId: booking.id,
      stage,
      notes,
      cleanlinessLevel,
      checklist,
      photos: uploadedPhotos
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Laudo de Vistoria de Estado — {isPickup ? 'Empréstimo (Check-in)' : 'Devolução (Check-out)'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveVistoria} className="p-6 space-y-5">
          {/* Booking & Item Overview */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <img
              src={booking.itemImage}
              alt={booking.itemTitle}
              className="w-14 h-14 rounded-xl object-cover border border-slate-800"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-indigo-400 block">Reserva #{booking.id}</span>
              <h4 className="font-bold text-white text-xs truncate">{booking.itemTitle}</h4>
              <p className="text-gray-400 text-[11px]">
                Locatário: {booking.renterName} • Locador: {booking.ownerName}
              </p>
            </div>
          </div>

          {/* Interactive Inspection Checklist */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Checklist Técnico de Conservação & Componentes
              </span>
              <span className="text-[10px] text-indigo-300 font-semibold">
                {Object.values(checklist).filter(Boolean).length}/5 Verificados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => toggleChecklistItem('motorTested')}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                  checklist.motorTested ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-slate-900 border-slate-800 text-gray-400'
                }`}
              >
                <input type="checkbox" checked={checklist.motorTested} readOnly className="accent-emerald-500" />
                <span>Motor / Elétrica Funcionando</span>
              </label>

              <label
                onClick={() => toggleChecklistItem('cablesIntact')}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                  checklist.cablesIntact ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}
              >
                <input type="checkbox" checked={checklist.cablesIntact} readOnly className="accent-emerald-500" />
                <span>Cabos & Fiação sem Cortes</span>
              </label>

              <label
                onClick={() => toggleChecklistItem('accessoriesComplete')}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                  checklist.accessoriesComplete ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-slate-900 border-slate-800 text-gray-400'
                }`}
              >
                <input type="checkbox" checked={checklist.accessoriesComplete} readOnly className="accent-emerald-500" />
                <span>Maleta & Acessórios Completos</span>
              </label>

              <label
                onClick={() => toggleChecklistItem('noCracks')}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                  checklist.noCracks ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}
              >
                <input type="checkbox" checked={checklist.noCracks} readOnly className="accent-emerald-500" />
                <span>Estrutura sem Trincas / Quebras</span>
              </label>
            </div>
          </div>

          {/* Photo Upload from Phone Gallery for Vistoria */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 font-bold flex items-center gap-1">
                <Camera className="w-4 h-4 text-emerald-400" />
                Fotos do Laudo de Vistoria (Galeria / Câmera)
              </label>
              <span className="text-emerald-400 text-[10px] font-bold">{uploadedPhotos.length} Fotos Anexadas</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                id="vistoriaPhotosInput"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label
                htmlFor="vistoriaPhotosInput"
                className="w-full bg-slate-950 hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 font-extrabold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>📸 Tirar Foto ou Selecionar da Galeria do Celular</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {uploadedPhotos.map((photoUrl, idx) => (
                <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-md">
                  <img src={photoUrl} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-slate-950/90 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold">
                    ✓ Foto {idx + 1} Registrada
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Observations */}
          <div>
            <label className="text-xs text-gray-300 font-bold block mb-1">
              Observações & Parecer do Laudo de Vistoria
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          {/* Digital Signature Confirmation Checkbox */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
            <input
              type="checkbox"
              id="signConfirm"
              checked={signatureConfirmed}
              onChange={(e) => setSignatureConfirmed(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="signConfirm" className="text-[11px] text-gray-300 font-semibold cursor-pointer">
              Confirmo a vistoria presencial do item no momento da {isPickup ? 'retirada' : 'devolução'} com hash de assinatura digital.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-emerald hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Salvando Laudo Digital de Estado...</span>
            ) : (
              <span>Assinar e Gravar Vistoria de Estado Auditável</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
