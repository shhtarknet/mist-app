import { X } from 'lucide-react';
import { CoreProvider, useCore } from './lib/useCore';
import { Header } from './components/Header';
import { BalanceSection } from './components/BalanceSection';
import { Footer } from './components/Footer';
import { TransferModal } from './components/TransferModal';
import Onboarding from './components/onboard/Onboarding';
import MyKeysModal from './components/MyKeysModal';

// Component for Notification
const Notification = () => {
  const { notification, setNotification } = useCore();

  if (!notification) return null;

  return (
    <div className={`z-50 absolute top-0 left-0 right-0 p-3 rounded-lg shadow-lg backdrop-blur-md bg-opacity-90 mb-4 flex items-center justify-between ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className="flex items-center">
        <span className="text-white">{notification.message}</span>
      </div>
      <button onClick={() => setNotification(null)} className="text-white">
        <X size={18} />
      </button>
    </div>
  );
};

const AppContent = () => {
  const { isLoading, starknet, showOnboarding, privKey, showCreateKeyModal } = useCore();

  return <div className="relative w-full max-w-md">
    {/* {privKey.toString(36)} */}
    {isLoading ?
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div> :
      showOnboarding ?
        <Onboarding /> :
        starknet ?
          (privKey < 2n) ?
            <Onboarding step={2} /> :
            <>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <Header />
                <BalanceSection />
                <Footer />
              </div>
              <TransferModal />
              {showCreateKeyModal && <MyKeysModal />}
            </> :
          <Onboarding step={1} />
    }
    <Notification />
  </div>;
}

// Main App Component
const App = () => {
  return (
    <CoreProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
        <AppContent />
      </div>
    </CoreProvider>
  );
};

export default App;