import React, { useState } from 'react';
import { processKycBiometrics } from '../../services/kycService';
import { X, ShieldCheck, Camera, FileCheck, CheckCircle2, Zap, Upload } from 'lucide-react';

export default function KycModal({ onClose }) {
  const [docType, setDocType] = useState('CNH_DIGITAL');
  const [docNumber, setDocNumber] = useState('44.891.204-8');
  const [docPhotoName, setDocPhotoName] = useState('Documento_CNH.jpg');
  const [selfiePhotoName, setSelfiePhotoName] = useState('Selfie_Liveness.png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDocFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocPhotoName(file.name);
    }
  };

  const handleSelfieFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfiePhotoName(file.name);
    }
  };

  const handleRunKyc = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const res = await processKycBiometrics({
      documentType: docType,
      documentNumber: docNumber,
      selfieDataUrl: selfiePhotoName,
      documentPhotoUrl: docPhotoName
    });

    setIsProcessing(false);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">KYC & Biometria Facial Instantânea</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-indigo-950/50 p-3.5 rounded-xl border border-indigo-500/30 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-xs">Redução de tempo de 24-48h para &lt; 3s</h4>
              <p className="text-gray-300 text-[11px] mt-0.5">
                Validação biometria facial + leitura OCR de documento com inteligência artificial para liberar anúncios e reservas instantaneamente.
              </p>
            </div>
          </div>

          {result ? (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-2.5 py-1 rounded-md border border-emerald-500/40">
                  {result.status} (Precisão: {result.confidenceScore})
                </span>
                <h4 className="font-bold text-white text-sm mt-2">{result.message}</h4>
                <p className="text-[11px] text-gray-400 mt-1 font-mono">
                  Hash Biométrico: {result.biometricHash}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Concluir e Voltar ao App
              </button>
            </div>
          ) : (
            <form onSubmit={handleRunKyc} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="CNH_DIGITAL">CNH Digital (Brasil)</option>
                  <option value="RG_DIGITAL">RG Digital com Biometria</option>
                  <option value="PASSAPORTE">Passaporte</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Número do Documento / CPF
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  placeholder="000.000.000-00"
                />
              </div>

              {/* Photo Upload from Phone Gallery or Camera for Doc & Selfie */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <input
                    type="file"
                    id="docPhotoInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDocFileUpload}
                  />
                  <label
                    htmlFor="docPhotoInput"
                    className="bg-slate-950 hover:bg-slate-800 p-3 rounded-xl border border-dashed border-slate-700 text-center space-y-1 cursor-pointer block"
                  >
                    <FileCheck className="w-5 h-5 text-indigo-400 mx-auto" />
                    <span className="font-bold text-gray-300 block text-[11px]">Foto RG/CNH</span>
                    <span className="text-[10px] text-emerald-400 font-semibold truncate block">
                      {docPhotoName}
                    </span>
                  </label>
                </div>

                <div>
                  <input
                    type="file"
                    id="selfiePhotoInput"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handleSelfieFileUpload}
                  />
                  <label
                    htmlFor="selfiePhotoInput"
                    className="bg-slate-950 hover:bg-slate-800 p-3 rounded-xl border border-dashed border-slate-700 text-center space-y-1 cursor-pointer block"
                  >
                    <Camera className="w-5 h-5 text-emerald-400 mx-auto animate-pulse" />
                    <span className="font-bold text-gray-300 block text-[11px]">Selfie Liveness</span>
                    <span className="text-[10px] text-emerald-400 font-semibold truncate block">
                      {selfiePhotoName}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full gradient-emerald hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Validando Biometria em IA...</span>
                  </>
                ) : (
                  <span>Executar KYC Automático em Segundos</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
