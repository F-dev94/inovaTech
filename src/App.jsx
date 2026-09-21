import React, { useState } from 'react';
import { useTrocaJaStore } from './services/store';

// Layout Components
import PersonaBar from './components/layout/PersonaBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationToast from './components/layout/NotificationToast';
import PwaInstallBanner from './components/layout/PwaInstallBanner';
import PwaQrModal from './components/layout/PwaQrModal';
import WelcomeScreenModal from './components/layout/WelcomeScreenModal';
import FigmaPrototypeMenu from './components/layout/FigmaPrototypeMenu';
import MobileDeviceSimulator from './components/layout/MobileDeviceSimulator';

// Views
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
import UserProfileView from './components/user/UserProfileView';
import FinancialDashboardView from './components/user/FinancialDashboardView';

export default function App() {
  const { actions, activePersona, state } = useTrocaJaStore();
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'my-rentals' | 'chat' | 'admin' | 'profile' | 'finance'

  // Security & Auth State
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

  const handleAuthSuccess = () => {
    setAuthRole(null);
    setIsAuthenticated(true);
    setShowWelcome(false);
  };

  const handleSelectPortal = (portalRole) => {
    setAuthRole(portalRole);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 relative">
      {/* PWA Install Banner */}
      <PwaInstallBanner onOpenQrModal={() => setIsQrModalOpen(true)} />

      {/* Main Authenticated Application */}
      {isAuthenticated && (
        <>
          {/* Figma Prototype Menu */}
          <FigmaPrototypeMenu 
            currentScreen={activeTab}
            onSelectScreen={setActiveTab}
            isMobileSimulator={true} // Hardcoded for now, could be state
            onToggleMobileSimulator={() => {}}
            themeMode="dark"
            onToggleTheme={() => {}}
          />
          <MobileDeviceSimulator 
            currentScreen={activeTab}
            onSelectScreen={setActiveTab}
            isSimulatorActive={true}
          >
            {/* Sticky Top Persona Selector Bar (10 Personas Switcher) */}
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
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 mb-16 md:mb-0">
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

            {activeTab === 'profile' && (
              <UserProfileView
                onOpenCreateItem={() => setIsCreateItemOpen(true)}
                onSelectItem={(item) => setDetailItem(item)}
              />
            )}

            {activeTab === 'finance' && (
              <FinancialDashboardView />
            )}
          </main>

          {/* Footer */}
          <Footer onResetData={actions.resetToDefault} />
          </MobileDeviceSimulator>
        </>
      )}

      {/* Floating Notifications */}
      <NotificationToast />

      {/* Blocking Welcome Screen before login */}
      {showWelcome && !isAuthenticated && (
        <WelcomeScreenModal
          onSelectPortal={handleSelectPortal}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />
      )}

      {/* QR Code PWA Modal */}
      {isQrModalOpen && (
        <PwaQrModal onClose={() => setIsQrModalOpen(false)} />
      )}

      {/* Auth Modal (Login / Cadastro) */}
      {authRole && (
        <AuthModal
          defaultRole={authRole}
          onClose={() => {
            setAuthRole(null);
            if (!isAuthenticated) setShowWelcome(true);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Modals pós-login */}
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
