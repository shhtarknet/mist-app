import { Copy, Send, ArrowDownCircle, Eye, EyeOff, X, Check, Shield, Lock } from 'lucide-react';
import { CoreProvider, useCore } from './lib/useCore';

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

// Component for Header Section
const Header = () => {
  return (
    <div className="p-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="mr-3 bg-blue-100 p-2 rounded-lg">
          <Shield size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">CipherMist</h1>
          <p className="text-xs text-gray-500 mt-1">Encrypted ElGamal Transfer Protocol</p>
        </div>
      </div>
    </div>
  );
};

// Component for Encrypted Balance View
const EncryptedBalanceView = () => {
  const { balanceCipherText, truncateHash } = useCore();

  return (
    <div className="bg-gray-100 rounded-lg p-3 max-w-full overflow-hidden border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C1.x:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceCipherText.c1.x)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C1.y:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceCipherText.c1.y)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">C2.x:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceCipherText.c2.x)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">C2.y:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-700">{truncateHash(balanceCipherText.c2.y)}</span>
          <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
            <Copy size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for Balance Section
const BalanceSection = () => {
  const { balance, showEncrypted, setShowEncrypted } = useCore();

  return (
    <div className="px-6 py-8 flex flex-col items-center justify-center relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowEncrypted(!showEncrypted)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={showEncrypted ? "Show Decrypted Balance" : "Show Encrypted Balance"}
        >
          {showEncrypted ? <EyeOff size={18} className="text-blue-600" /> : <Eye size={18} className="text-blue-600" />}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
          {showEncrypted ? "Encrypted Balance" : "Your Balance"}
        </p>

        {!showEncrypted ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-blue-100 border border-blue-200">
              <Lock size={26} className="text-blue-600" />
            </div>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-800">{balance}</span>
              <span className="ml-2 text-lg text-gray-500">ETH</span>
            </div>
          </div>
        ) : (
          <EncryptedBalanceView />
        )}
      </div>

      <ActionButtons />
    </div>
  );
};

// Component for Action Buttons
const ActionButtons = () => {
  const { setShowTransfer, requestTestFunds } = useCore();

  return (
    <div className="w-full mt-8 space-y-3">
      <button
        onClick={() => setShowTransfer(true)}
        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors shadow-lg shadow-blue-200"
      >
        <Send size={18} className="mr-2" />
        Transfer Funds
      </button>

      <button
        onClick={requestTestFunds}
        className="w-full py-3 px-4 rounded-xl bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center transition-colors"
      >
        <ArrowDownCircle size={18} className="mr-2" />
        Request Test Funds
      </button>
    </div>
  );
};

// Component for Footer
const Footer = () => {
  return (
    <div className="p-4 border-t border-gray-200 text-center">
      <p className="text-xs text-gray-500">Secured with ElGamal Encryption</p>
    </div>
  );
};

// Component for Transfer Modal
const TransferModal = () => {
  const {
    showTransfer,
    setShowTransfer,
    transferAmount,
    setTransferAmount,
    recipient,
    setRecipient,
    handleTransfer
  } = useCore();

  if (!showTransfer) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Transfer Funds</h2>
          <button onClick={() => setShowTransfer(false)} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount (ETH)</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors"
              >
                <Send size={18} className="mr-2" />
                Send Transaction
              </button>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">Transaction will be encrypted using ElGamal</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <CoreProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
        <div className="relative w-full max-w-md">
          <Notification />

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <Header />
            <BalanceSection />
            <Footer />
          </div>

          <TransferModal />
        </div>
      </div>
    </CoreProvider>
  );
};

export default App;