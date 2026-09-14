// Rules Engine & Security Algorithms for TrocaJá Marketplace

/**
 * Calculate pricing breakdown for a booking
 */
export function calculatePricing({ pricePerDay, days, isPro, isBoosted = false }) {
  const subtotal = pricePerDay * days;
  
  // Commission rates: 18% for P2P, 9% for TrocaJá-Pro merchants
  const commissionRate = isPro ? 0.09 : 0.18;
  const commissionAmount = subtotal * commissionRate;
  
  // TrocaJá Insurance Fee: 6% of subtotal or minimum R$ 12,00
  const insuranceFee = Math.max(12.00, subtotal * 0.06);
  
  // Optional boosting fee if owner paid to feature
  const boostingFee = isBoosted ? 15.00 : 0.00;
  
  // Net payout for owner: subtotal - commission
  const netOwnerPayout = subtotal - commissionAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    commissionRate,
    commissionAmount: Number(commissionAmount.toFixed(2)),
    insuranceFee: Number(insuranceFee.toFixed(2)),
    boostingFee: Number(boostingFee.toFixed(2)),
    netOwnerPayout: Number(netOwnerPayout.toFixed(2))
  };
}

/**
 * Caution Deposit Dispute Rules Engine (RF07)
 * Parametrizado por categoria de item e gravidade do laudo de vistoria
 */
export function calculateCautionRetention({ category, damageLevel, depositAmount, itemPricePerDay }) {
  let retentionPct = 0;
  let rationale = '';

  const damageUpper = (damageLevel || '').toUpperCase();
  const catUpper = (category || '').toUpperCase();

  switch (damageUpper) {
    case 'LEVE':
      // Dano estético superficial ou sujeira pesada fora do padrão
      retentionPct = catUpper.includes('DRONE') || catUpper.includes('ELETRÔNICO') ? 20 : 15;
      rationale = 'Regra Caução: Dano estético/superficial. Retenção recomendada para limpeza técnica e polimento.';
      break;

    case 'MODERADA':
      // Peça de reposição trocável (ex: cabo descascado, disco quebrado, estojo danificado)
      retentionPct = catUpper.includes('FERRAMENTA') ? 35 : 45;
      rationale = 'Regra Caução: Dano moderado com necessidade de substituição de componente consumível.';
      break;

    case 'SEVERA':
      // Dano estrutural grave ou falha de funcionamento por mau uso
      retentionPct = catUpper.includes('DRONE') ? 85 : 75;
      rationale = 'Regra Caução: Dano severo no motor/carcaça com redução drástica do valor do bem.';
      break;

    case 'PERDA_TOTAL':
    case 'NAO_DEVOLVIDO':
      retentionPct = 100;
      rationale = 'Regra Caução: Perda total ou não devolução do equipamento dentro do prazo contratado.';
      break;

    default:
      retentionPct = 25;
      rationale = 'Regra Caução Padrão: Avaria sob investigação inicial.';
  }

  const retentionAmount = Number(((depositAmount * retentionPct) / 100).toFixed(2));
  const refundAmount = Number((depositAmount - retentionAmount).toFixed(2));

  return {
    damageLevel: damageUpper,
    category,
    suggestedRetentionPct: retentionPct,
    suggestedRetentionAmount: retentionAmount,
    suggestedRefundAmount: refundAmount,
    rationale,
    ruleId: `RULE-CAT-${retentionPct}-${Date.now().toString().slice(-4)}`
  };
}

/**
 * Anti-Leakage / Bypass Chat Detector (RF09 & Antivazamento)
 * Identifica padrões de pagamento PIX por fora e compartilhamento de contatos
 */
export function detectChatBypass(messageText) {
  if (!messageText) return { isBypass: false };

  const text = messageText.toLowerCase();

  // Expressões indicativas de vazamento de receita
  const bypassKeywords = [
    'por fora', 'pix direto', 'pix por fora', 'chama no whats', 'chama no zap',
    'chama no whatsapp', 'pagar por fora', 'sem comissao', 'desconto por fora',
    'meu pix', 'chave pix', 'sem taxa', 'transferencia direta', 'dinheiro em maos'
  ];

  // Regex para números de telefone (ex: 16 99999-9999, 16999999999, (16) 98888-7777)
  const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\s?\d{4}[-\s]?\d{4}|\d{4}[-\s]?\d{4})/;

  // Check keyword matches
  const keywordFound = bypassKeywords.find(word => text.includes(word));
  const phoneFound = phoneRegex.test(text);

  if (keywordFound || phoneFound) {
    return {
      isBypass: true,
      reason: keywordFound
        ? `Menção expressa a negociação externa ("${keywordFound}")`
        : 'Tentativa de compartilhamento de telefone/contato direto detectada',
      warningMessage: '🚨 ALERTA DE SEGURANÇA TROCAJÁ: Transações realizadas fora da plataforma perdem o Seguro Proteção contra danos, a Garantia de Retenção de Caução e a Vistoria Digital Auditável. Mantenha seu pagamento dentro do app para sua segurança!'
    };
  }

  return { isBypass: false };
}

/**
 * Blackmail / Threat Rating Detector (RF09)
 * Detecta se uma avaliação negativa de 1 estrela é usada como chantagem
 */
export function detectThreatRating({ rating, comment, bookingHasDispute }) {
  if (rating > 2 || !comment) return { isThreat: false };

  const text = comment.toLowerCase();
  const threatKeywords = [
    'se não devolver', 'se nao devolver', 'vou dar 1 estrela', 'vou dar nota baixa',
    'devolver a caução', 'devolver a caucao', 'vou negativar', 'chantagem', 'meu dinheiro de volta'
  ];

  const match = threatKeywords.find(word => text.includes(word));

  if (match || (rating === 1 && bookingHasDispute)) {
    return {
      isThreat: true,
      reason: match
        ? `Avaliação condicionada a reembolso ("${match}")`
        : 'Nota 1 estrela atribuída durante disputa de caução pendente.',
      actionTaken: 'FLAGGED_FOR_SAFETY_REVIEW',
      alertNote: '⚠️ Sinalização Automática: Esta avaliação foi sinalizada para análise do time de Confiança e Segurança por suspeita de uso da nota como chantagem.'
    };
  }

  return { isThreat: false };
}
