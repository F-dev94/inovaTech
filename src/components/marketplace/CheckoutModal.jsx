import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { X, QrCode, CreditCard, ShieldCheck, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { calculatePricing } from '../../services/rulesEngine';

export default function CheckoutModal({ item, days, startDate, endDate, onClose, onSuccess }) {
  const { actions, activePersona } = useTrocaJaStore();
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!item) return null;

  const pricing = calculatePricing({
    pricePerDay: item.pricePerDay,
    days,
    isPro: item.ownerIsPro,
    isBoosted: item.isBoosted
  });

  const totalPayable = pricing.subtotal + pricing.insuranceFee + item.depositAmount;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simulate gateway response delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsProcessing(false);

    const booking = actions.createBooking({
      item,
      startDate,
      endDate,
      days,
      paymentMethod: paymentMethod === 'PIX' ? 'PIX (In-App)' : 'Cartão de Crédito'
    });

    setIsConfirmed(true);
    setTimeout(() => {
      onSuccess(booking);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-6">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Checkout Seguro TrocaJá</h3>
          </div>
          {!isProcessing && !isConfirmed && (
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        {isConfirmed ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Reserva Confirmada!</h3>
            <p className="text-sm text-gray-300">
              O pagamento de <strong className="text-emerald-400">R$ {totalPayable.toFixed(2)}</strong> foi processado com retenção automática da taxa da plataforma.
            </p>
            <p className="text-xs text-indigo-300 bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/30">
              📸 Próximo passo: Realizar a <strong>Vistoria Digital (Check-in)</strong> no momento da retirada do item com o locador.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Item Summary */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                <p className="text-gray-400 text-[11px]">{days} dias • {startDate} até {endDate}</p>
                <span className="text-indigo-400 font-semibold text-[11px]">
                  Locador: {item.ownerName} ({item.ownerIsPro ? 'Lojista PRO' : 'P2P'})
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-bold block">
                Selecione o Método de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'PIX'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-slate-950/60 border-slate-800 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-xs block text-white">PIX no App</span>
                    <span className="text-[10px] text-gray-400">Aprovação Instantânea</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 text-gray-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-xs block text-white">Cartão de Crédito</span>
                    <span className="text-[10px] text-gray-400">Até 3x sem juros</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Simulated PIX QR Code or Card Inputs */}
            {paymentMethod === 'PIX' ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                  {/* Simulated QR Pattern */}
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${i % 2 === 0 ? 'bg-slate-950' : 'bg-emerald-600'} rounded-sm`}
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">
                  pix-trocaja-hash-{Math.random().toString(36).substring(2, 9)}
                </p>
              </div>
            ) : (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Número do Cartão (4532 **** **** 8890)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  defaultValue="4532 8912 7741 8890"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    defaultValue="12/28"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    defaultValue="891"
                  />
                </div>
              </div>
            )}

            {/* Retained Commission Breakdown Summary */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal Diárias:</span>
                <span>R$ {pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Seguro Proteção TrocaJá:</span>
                <span>R$ {pricing.insuranceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-indigo-300 font-medium">
                <span>Caução Garantida (Bloqueio):</span>
                <span>R$ {item.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-semibold pt-1 border-t border-slate-800">
                <span>Comissão Retida Automática:</span>
                <span>{item.ownerIsPro ? '9% (PRO Lojista)' : '18% (P2P)'} → R$ {pricing.commissionAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full gradient-emerald hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Processando Checkout Seguro...</span>
                </>
              ) : (
                <>
                  <span>Pagar R$ {totalPayable.toFixed(2)} via {paymentMethod}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
