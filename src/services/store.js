import { useState, useEffect } from 'react';
import {
  INITIAL_PERSONAS,
  INITIAL_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_DISPUTES,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES
} from './mockData';
import { calculatePricing, calculateCautionRetention, detectChatBypass, detectThreatRating } from './rulesEngine';

const STORE_KEY = 'trocaja_state_v4';

function getStoredState() {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse state from localStorage', e);
    }
  }
  return {
    personas: INITIAL_PERSONAS.map(p => ({ ...p, password: '1a2b3c' })), // Strict default password
    activePersonaId: 'carlos',
    items: INITIAL_ITEMS,
    bookings: INITIAL_BOOKINGS,
    disputes: INITIAL_DISPUTES,
    reviews: INITIAL_REVIEWS,
    messages: INITIAL_MESSAGES,
    notifications: [
      {
        id: 'notif-1',
        title: '🔒 Autenticação Rígida Ativa',
        message: 'Senha padrão "1a2b3c" habilitada em todas as contas ativas do Supabase/Local.',
        time: 'Há 1 min',
        type: 'success'
      }
    ],
    filterDistanceKm: 10,
    filterCategory: 'TODOS',
    searchQuery: ''
  };
}

let memoryState = getStoredState();
const listeners = new Set();

function saveState(newState) {
  memoryState = { ...memoryState, ...newState };
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(memoryState));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
  listeners.forEach(listener => listener(memoryState));
}

export function useTrocaJaStore() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    const handleChange = (newState) => setState(newState);
    listeners.add(handleChange);
    return () => listeners.delete(handleChange);
  }, []);

  const activePersona = state.personas.find(p => p.id === state.activePersonaId) || state.personas[0];

  const pushNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Agora mesmo',
      type
    };
    saveState({ notifications: [newNotif, ...state.notifications] });
  };

  const actions = {
    pushNotification,

    // Register New User (NNOVO CADASTRO DE CLIENTE / LOJISTA)
    registerUser: ({ name, email, password, userRole, cpf, phone, pixKey, city, isPro }) => {
      const newPersonaId = `user-${Date.now()}`;
      const newPersona = {
        id: newPersonaId,
        name,
        email,
        password: password || '1a2b3c',
        role: userRole === 'lojista' ? 'Parceiro Comercial PRO' : userRole === 'locador' ? 'Locador Amador (P2P)' : 'Locatário Eventual',
        badge: isPro ? 'Lojista PRO (9%)' : 'Cliente Verificado',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        details: `${userRole} • ${city || 'Ribeirão Preto/SP'} • CPF: ${cpf || '000.000.000-00'}`,
        quote: 'Novo cadastro realizado com dados completos para transações no TrocaJá.',
        metrics: { itemsRented: 0, totalSpent: 0, activeBooking: 0 },
        isPro: Boolean(isPro),
        userRole,
        cpf,
        phone,
        pixKey,
        city
      };

      saveState({
        personas: [...state.personas, newPersona],
        activePersonaId: newPersonaId
      });

      pushNotification(
        '🎉 Novo Cadastro Concluído!',
        `Bem-vindo(a), ${name}! Sua conta de ${userRole} foi criada com sucesso com senha de acesso.`,
        'success'
      );

      return newPersona;
    },

    // Strict Password Verification Handler
    verifyAndLogin: (personaId, enteredPassword) => {
      const targetUser = state.personas.find(p => p.id === personaId || p.email === personaId);

      if (!targetUser) {
        return { success: false, error: 'Usuário não encontrado!' };
      }

      const requiredPassword = targetUser.password || '1a2b3c';

      if (enteredPassword !== requiredPassword) {
        return { success: false, error: `Senha incorreta! A senha exata de acesso é "${requiredPassword}".` };
      }

      saveState({ activePersonaId: targetUser.id });
      pushNotification(
        '🔐 Login Efetuado',
        `Acesso autenticado com sucesso como ${targetUser.name} (${targetUser.role}).`,
        'success'
      );

      return { success: true, user: targetUser };
    },

    // Persona switching
    setActivePersona: (personaId) => {
      const p = state.personas.find(item => item.id === personaId);
      saveState({ activePersonaId: personaId });
      pushNotification(
        '👤 Persona Alternada',
        `Você agora está navegando como ${p ? p.name : personaId} (${p ? p.role : ''}).`,
        'info'
      );
    },

    // Search and Distance Filter
    setSearchQuery: (query) => saveState({ searchQuery: query }),
    setFilterCategory: (category) => saveState({ filterCategory: category }),
    setFilterDistanceKm: (distKm) => saveState({ filterDistanceKm: distKm }),

    // Create New Item / Listing (with sensitive category check - RF02)
    createItem: (itemData) => {
      const newItem = {
        id: `item-${Date.now()}`,
        ownerId: activePersona.id,
        ownerName: activePersona.name,
        ownerIsPro: activePersona.isPro,
        commissionRate: activePersona.isPro ? 0.09 : 0.18,
        rating: 5.0,
        reviewsCount: 0,
        availableCalendar: ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
        ...itemData
      };
      saveState({ items: [newItem, ...state.items] });
      pushNotification(
        '📦 Anúncio Publicado',
        `Seu item "${newItem.title}" foi publicado com taxa de comissão de ${activePersona.isPro ? '9% (PRO)' : '18% (P2P)'}.`,
        'success'
      );
      return newItem;
    },

    // Update Sensitive Doc Status (Safety Analyst Action)
    moderateSensitiveItem: (itemId, status) => {
      const updatedItems = state.items.map(item =>
        item.id === itemId ? { ...item, sensitiveDocStatus: status } : item
      );
      saveState({ items: updatedItems });
      pushNotification(
        '🛡️ Moderação Concluída',
        `Status da categoria sensível atualizado para "${status}".`,
        status === 'APROVADO' ? 'success' : 'warning'
      );
    },

    // Create Booking & Checkout (RF05)
    createBooking: ({ item, startDate, endDate, days, paymentMethod }) => {
      const pricing = calculatePricing({
        pricePerDay: item.pricePerDay,
        days,
        isPro: item.ownerIsPro,
        isBoosted: item.isBoosted
      });

      const newBooking = {
        id: `res-${Date.now().toString().slice(-4)}`,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image,
        renterId: activePersona.id,
        renterName: activePersona.name,
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        startDate,
        endDate,
        dailyRate: item.pricePerDay,
        days,
        subtotal: pricing.subtotal,
        insuranceFee: pricing.insuranceFee,
        commissionRate: pricing.commissionRate,
        commissionAmount: pricing.commissionAmount,
        depositAmount: item.depositAmount,
        totalPaid: Number((pricing.subtotal + pricing.insuranceFee + pricing.commissionAmount + item.depositAmount).toFixed(2)),
        paymentMethod,
        status: 'CONFIRMADA',
        inspectionPickup: null,
        inspectionReturn: null,
        createdAt: new Date().toISOString()
      };

      saveState({ bookings: [newBooking, ...state.bookings] });
      pushNotification(
        '🎉 Reserva Confirmada (RF05)',
        `Pagamento de R$ ${newBooking.totalPaid.toFixed(2)} processado no app. Comissão (${item.ownerIsPro ? '9%' : '18%'}) retida automaticamente.`,
        'success'
      );
      return newBooking;
    },

    // Save Digital Inspection Report (RF06 - Check-in / Check-out photos)
    saveInspection: ({ bookingId, stage, notes, photos }) => {
      const updatedBookings = state.bookings.map(b => {
        if (b.id === bookingId) {
          const inspectionField = stage === 'pickup' ? 'inspectionPickup' : 'inspectionReturn';
          const updated = {
            ...b,
            [inspectionField]: {
              timestamp: new Date().toISOString(),
              notes,
              photos
            }
          };
          if (stage === 'return' && b.status !== 'EM_DISPUTA') {
            updated.status = 'AGUARDANDO_CONCILIACAO';
          }
          return updated;
        }
        return b;
      });
      saveState({ bookings: updatedBookings });
      pushNotification(
        '📸 Vistoria Digital Registrada (RF06)',
        `Fotos e laudo de ${stage === 'pickup' ? 'Retirada' : 'Devolução'} salvos no registro imutável da reserva.`,
        'info'
      );
    },

    // Open Caution Deposit Dispute (RF07)
    openDispute: ({ bookingId, reportedDamageLevel, description }) => {
      const booking = state.bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const item = state.items.find(i => i.id === booking.itemId) || { category: 'Geral', pricePerDay: booking.dailyRate };
      
      const retentionCalc = calculateCautionRetention({
        category: item.category,
        damageLevel: reportedDamageLevel,
        depositAmount: booking.depositAmount,
        itemPricePerDay: booking.dailyRate
      });

      const newDispute = {
        id: `disp-${Date.now().toString().slice(-4)}`,
        bookingId,
        itemTitle: booking.itemTitle,
        category: item.category,
        openedBy: activePersona.id,
        openedByName: `${activePersona.name} (${activePersona.userRole})`,
        renterName: booking.renterName,
        totalDeposit: booking.depositAmount,
        reportedDamageLevel,
        description,
        suggestedRetentionPct: retentionCalc.suggestedRetentionPct,
        suggestedRetentionAmount: retentionCalc.suggestedRetentionAmount,
        suggestedRefundAmount: retentionCalc.suggestedRefundAmount,
        finalRetentionPct: null,
        finalRetentionAmount: null,
        status: 'EM_ANALISE',
        assignedAnalyst: 'lucas',
        assignedAnalystName: 'Lucas Andrade (T&S)',
        auditLogs: [
          {
            timestamp: new Date().toISOString(),
            author: `${activePersona.name} (${activePersona.role})`,
            action: 'Disputa Aberta',
            details: `Avaria reportada: ${reportedDamageLevel}. Relato: "${description}".`
          },
          {
            timestamp: new Date().toISOString(),
            author: 'Sistema TrocaJá (Rules Engine)',
            action: 'Sugestão Automática de Retenção',
            details: `${retentionCalc.rationale} Retenção recomendada: ${retentionCalc.suggestedRetentionPct}% (R$ ${retentionCalc.suggestedRetentionAmount.toFixed(2)}).`
          }
        ]
      };

      // Update booking status
      const updatedBookings = state.bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'EM_DISPUTA' } : b
      );

      saveState({
        disputes: [newDispute, ...state.disputes],
        bookings: updatedBookings
      });

      pushNotification(
        '⚠️ Disputa de Caução Aberta (RF07 / RF12)',
        `Motor de Regras sugere retenção de ${retentionCalc.suggestedRetentionPct}% (R$ ${retentionCalc.suggestedRetentionAmount.toFixed(2)}). Encaminhado para análise humana.`,
        'warning'
      );

      return newDispute;
    },

    // Resolve Dispute with Human Decision & Audit Log (RF07)
    resolveDispute: ({ disputeId, finalRetentionPct, analystNotes }) => {
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (!dispute) return;

      const finalRetentionAmount = Number(((dispute.totalDeposit * finalRetentionPct) / 100).toFixed(2));
      const finalRefundAmount = Number((dispute.totalDeposit - finalRetentionAmount).toFixed(2));

      const newAuditLog = {
        timestamp: new Date().toISOString(),
        author: `${activePersona.name} (Analista T&S)`,
        action: 'Decisão Final Auditada',
        details: `Decisão de retenção: ${finalRetentionPct}% (R$ ${finalRetentionAmount.toFixed(2)} ao locador, R$ ${finalRefundAmount.toFixed(2)} devolvido). Parecer: "${analystNotes}"`
      };

      const updatedDisputes = state.disputes.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            finalRetentionPct,
            finalRetentionAmount,
            finalRefundAmount,
            status: 'RESOLVIDA',
            auditLogs: [...d.auditLogs, newAuditLog]
          };
        }
        return d;
      });

      // Update booking status to finalizada & pending payout
      const updatedBookings = state.bookings.map(b => {
        if (b.id === dispute.bookingId) {
          return { ...b, status: 'FINALIZADA', payoutStatus: 'PENDENTE_PIX' };
        }
        return b;
      });

      saveState({
        disputes: updatedDisputes,
        bookings: updatedBookings
      });

      pushNotification(
        '⚖️ Disputa Resolvida e Auditada (RF07)',
        `Decisão de ${finalRetentionPct}% de retenção de caução gravada com sucesso na Trilha de Auditoria imutável.`,
        'success'
      );
    },

    // Process PIX Payout & Auto NF-e Emission for PRO partners (RF08)
    processPayoutAndNfe: (bookingId) => {
      const booking = state.bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const nfeNum = `NFE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const updatedBookings = state.bookings.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            payoutStatus: 'CONCILIADO_PIX',
            nfeNumber: b.commissionRate === 0.09 ? nfeNum : 'ISENTO_P2P',
            nfeUrl: b.commissionRate === 0.09 ? `https://trocaja.app/nfe/${nfeNum}.pdf` : null,
            payoutProcessedAt: new Date().toISOString()
          };
        }
        return b;
      });

      saveState({ bookings: updatedBookings });

      pushNotification(
        '💸 Repasse PIX & Nota Fiscal Emitidos (RF08)',
        `Repasse efetuado via PIX. ${booking.commissionRate === 0.09 ? `Nota Fiscal ${nfeNum} gerada automaticamente.` : 'Locação P2P isenta de NF.'}`,
        'financial'
      );
    },

    // Add Review with Threat Detection (RF09)
    addReview: ({ bookingId, revieweeName, rating, comment }) => {
      const booking = state.bookings.find(b => b.id === bookingId);
      const threatCheck = detectThreatRating({
        rating,
        comment,
        bookingHasDispute: booking && booking.status === 'EM_DISPUTA'
      });

      const newReview = {
        id: `rev-${Date.now()}`,
        bookingId,
        reviewerName: activePersona.name,
        revieweeName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        isThreatFlagged: threatCheck.isThreat,
        threatReason: threatCheck.reason || null
      };

      saveState({ reviews: [newReview, ...state.reviews] });

      if (threatCheck.isThreat) {
        pushNotification(
          '🚨 Avaliação Sinalizada por Suspeita de Ameaça (RF09)',
          `Comentário de ${rating} estrela foi bloqueado temporariamente para auditoria de chantagem de reembolso.`,
          'warning'
        );
      } else {
        pushNotification(
          '⭐ Avaliação Publicada',
          `Sua avaliação de ${rating} estrelas foi publicada no perfil de ${revieweeName}.`,
          'success'
        );
      }

      return newReview;
    },

    // Send Chat Message with Anti-Bypass Check (Anti-vazamento)
    sendMessage: (text) => {
      const bypassCheck = detectChatBypass(text);
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: activePersona.id,
        senderName: activePersona.name,
        text,
        timestamp: new Date().toISOString(),
        isBypassDetected: bypassCheck.isBypass,
        bypassReason: bypassCheck.reason || null,
        warningMessage: bypassCheck.warningMessage || null
      };

      saveState({ messages: [...state.messages, newMsg] });

      if (bypassCheck.isBypass) {
        pushNotification(
          '🚨 Alerta Anti-Vazamento em Tempo Real',
          'Tentativa de PIX por fora detectada! Lembre-se: pagamentos externos perdem a garantia de caução e a cobertura do seguro.',
          'warning'
        );
      }

      return newMsg;
    },

    // Dismiss notification
    dismissNotification: (notifId) => {
      saveState({ notifications: state.notifications.filter(n => n.id !== notifId) });
    },

    // Reset State to Default Mock Data
    resetToDefault: () => {
      localStorage.removeItem(STORE_KEY);
      saveState({
        personas: INITIAL_PERSONAS.map(p => ({ ...p, password: '1a2b3c' })),
        activePersonaId: 'carlos',
        items: INITIAL_ITEMS,
        bookings: INITIAL_BOOKINGS,
        disputes: INITIAL_DISPUTES,
        reviews: INITIAL_REVIEWS,
        messages: INITIAL_MESSAGES,
        notifications: [
          {
            id: 'notif-1',
            title: '🔒 Dados de Simulação Restaurados',
            message: 'Todas as entidades e personas foram resetadas com a senha padrão "1a2b3c".',
            time: 'Agora mesmo',
            type: 'info'
          }
        ],
        filterDistanceKm: 10,
        filterCategory: 'TODOS',
        searchQuery: ''
      });
    }
  };

  return { state, activePersona, actions };
}
