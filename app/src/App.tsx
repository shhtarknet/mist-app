import { X, Check } from 'lucide-react';
import { CoreProvider, useCore } from './lib/useCore';
import { Header } from './components/Header';
import { BalanceSection } from './components/BalanceSection';
import { Footer } from './components/Footer';
import { TransferModal } from './components/TransferModal';
import CreateKeyModal from './components/CreateKeyModal';
import StarknetModal from './components/StarknetModal';

// Component for Notification
const Notification = () => {
  const { notification, setNotification } = useCore();

  if (!notification) return null;

  return (
    <div className={`absolute top-0 left-0 right-0 p-3 rounded-lg shadow-lg backdrop-blur-md bg-opacity-90 transform -translate-y-full mb-4 flex items-center justify-between ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className="flex items-center">
        {notification.type === 'success' ? <Check size={18} className="mr-2 text-white" /> : <X size={18} className="mr-2 text-white" />}
        <span className="text-white">{notification.message}</span>
      </div>
      <button onClick={() => setNotification(null)} className="text-white">
        <X size={18} />
      </button>
    </div>
  );
};

const AppContent = () => {
  const { starknet } = useCore();

  return <div className="relative w-full max-w-md">
    <Notification />
    {starknet ?
      <>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <Header />
          <BalanceSection />
          <Footer />
        </div>

        <TransferModal />
        <CreateKeyModal />
      </> :
      <StarknetModal />}
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