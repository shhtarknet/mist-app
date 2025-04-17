import { Eye, EyeOff, Lock } from 'lucide-react';
import { useCore } from '../lib/useCore';
import { EncryptedBalanceView } from './EncryptedBalanceView';
import { ActionButtons } from './ActionButtons';

export const BalanceSection = () => {
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

