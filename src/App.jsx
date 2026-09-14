import React, { useState, useEffect } from 'react';
import { useTrocaJaStore } from './services/store';
import PersonaBar from './components/layout/PersonaBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationToast from './components/layout/NotificationToast';
import PwaInstallBanner from './components/layout/PwaInstallBanner';
import PwaQrModal from './components/layout/PwaQrModal';
import WelcomeScreenModal from './components/layout/WelcomeScreenModal';
import ItemGrid from './components/marketplace/ItemGrid';
import ItemDetailModal from './components/marketplace/ItemDetailModal';
import CheckoutModal from './components/marketplace/CheckoutModal';
import KycModal from './components/user/KycModal';
import CreateListingModal from './components/user/CreateListingModal';
import VistoriaModal from './components/user/VistoriaModal';
import OpenDisputeModal from './components/user/OpenDisputeModal';
import SecureChatModal from './components/chat/SecureChatModal';
import AdminDashboard from './components/admin/AdminDashboard';
import MyRentalsView from './components/user/MyRentalsView';
import AuthModal from './components/auth/AuthModal';

export default function App() {
  const { actions, activePersona, state } = useTrocaJaStore();
  const [activeTab, setActiveTab] = useState('marketplace');

  // ── SEGURANÇA: controle de autenticação ───────────────────────────────────
  // isAuthenticated só vira true depois de login bem-sucedido nesta sessão.
  // O usuário NÃO pode fechar a tela de boas-vindas sem se autenticar.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [authRole, setAuthRole] = useState(null); // 'client' | 'admin' | null

  // Modals state
  const [detailItem, setDetailItem] = useState(null);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [vistoriaTarget, setVistoriaTarget] = useState(null);
  const [disputeBooking, setDisputeBooking] = useState(null);

  const handleStartCheckout = (item, days, startDate, endDate) => {
    setCheckoutInfo({ item, days, startDate, endDate });
  };

  // Chamado depois que o AuthModal confirma login com sucesso
  const handleAuthSuccess = () => {
    setAuthRole(null);
    setIsAuthenticated(true);
    setShowWelcome(false);
  };

  // Escolhe o portal na tela de boas-vindas → abre o AuthModal correspondente
  const handleSelectPortal = (portalRole) => {
    setAuthRole(portalRole);
    // NÃO fecha o WelcomeScreenModal; ele fica atrás do AuthModal
    // O showWelcome só vira false após login bem-sucedido
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 relative">
      {/* PWA Install Banner (visível mesmo antes do login) */}
      <PwaInstallBanner onOpenQrModal={() => setIsQrModalOpen(true)} />

      {/* Conteúdo principal – só renderizado após autenticação */}
      {isAuthenticated && (
        <>
          {/* Sticky Top Persona Selector Bar */}
          <PersonaBar />

          {/* Main Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenKyc={() => setIsKycOpen(true)}
            onOpenCreateItem={() => setIsCreateItemOpen(true)}
            onOpenAuth={(role) => setAuthRole(role)}
          />

          {/* Main App Content View Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 mb-12 md:mb-0">
            {activeTab === 'marketplace' && (
              <ItemGrid onSelectItem={(item) => setDetailItem(item)} />
            )}

            {activeTab === 'my-rentals' && (
              <MyRentalsView
                onOpenVistoria={(b, stage) => setVistoriaTarget({ booking: b, stage })}
                onOpenDispute={(b) => setDisputeBooking(b)}
                onAddReview={actions.addReview}
              />
            )}

            {activeTab === 'chat' && (
              <SecureChatModal onStartCheckout={handleStartCheckout} />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard />
            )}
          </main>

          {/* Footer */}
          <Footer onResetData={actions.resetToDefault} />
        </>
      )}

      {/* Floating Real-Time Notifications */}
      <NotificationToast />

      {/* ── TELA DE BOAS-VINDAS (bloqueante – sem botão X) ─────────────────── */}
      {showWelcome && !isAuthenticated && (
        <WelcomeScreenModal
          onSelectPortal={handleSelectPortal}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />
      )}

      {/* ── QR CODE MODAL ────────────────────────────────────────────────────── */}
      {isQrModalOpen && (
        <PwaQrModal onClose={() => setIsQrModalOpen(false)} />
      )}

      {/* ── AUTH MODAL (login / cadastro) ────────────────────────────────────── */}
      {authRole && (
        <AuthModal
          defaultRole={authRole}
          onClose={() => {
            setAuthRole(null);
            // Se ainda não autenticado, volta a mostrar welcome
            if (!isAuthenticated) setShowWelcome(true);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Modais pós-login */}
      {isAuthenticated && (
        <>
          {detailItem && (
            <ItemDetailModal
              item={detailItem}
              onClose={() => setDetailItem(null)}
              onStartCheckout={(item, days, startDate, endDate) => {
                setDetailItem(null);
                handleStartCheckout(item, days, startDate, endDate);
              }}
              onOpenChat={() => {
                setDetailItem(null);
                setActiveTab('chat');
              }}
            />
          )}

          {checkoutInfo && (
            <CheckoutModal
              item={checkoutInfo.item}
              days={checkoutInfo.days}
              startDate={checkoutInfo.startDate}
              endDate={checkoutInfo.endDate}
              onClose={() => setCheckoutInfo(null)}
              onSuccess={(newBooking) => {
                setCheckoutInfo(null);
                setActiveTab('my-rentals');
              }}
            />
          )}

          {isKycOpen && (
            <KycModal onClose={() => setIsKycOpen(false)} />
          )}

          {isCreateItemOpen && (
            <CreateListingModal onClose={() => setIsCreateItemOpen(false)} />
          )}

          {vistoriaTarget && (
            <VistoriaModal
              booking={vistoriaTarget.booking}
              stage={vistoriaTarget.stage}
              onClose={() => setVistoriaTarget(null)}
            />
          )}

          {disputeBooking && (
            <OpenDisputeModal
              booking={disputeBooking}
              onClose={() => setDisputeBooking(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
