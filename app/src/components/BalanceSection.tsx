import { Copy, Eye, EyeOff, Lock } from 'lucide-react';
import { useCore } from '../lib/useCore';
import { EncryptedBalanceView } from './EncryptedBalanceView';
import { ActionButtons } from './ActionButtons';

export const BalanceSection = () => {

  const { balance, showEncrypted, setShowEncrypted, keyPair, truncateHash } = useCore();

  return (
    <div className="px-6 py-8 flex flex-col items-center justify-center relative">

      <div className="text-center w-full">
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowEncrypted(!showEncrypted)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title={showEncrypted ? "Show Decrypted Balance" : "Show Encrypted Balance"}
          >
            {showEncrypted ? <EyeOff size={18} className="text-blue-600" /> : <Eye size={18} className="text-blue-600" />}
          </button>
        </div>
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
              <span className="ml-2 text-lg text-gray-500">USDT</span>
            </div>

            {keyPair.pubX.toString() && (
              <div className="mt-4 bg-gray-100 p-3 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">Public Key:</span>
                  <div className="flex items-center">
                    <span className="text-xs font-mono text-gray-700">{truncateHash(keyPair.pubX.toString(16))}</span>
                    <button className="ml-1 text-gray-500 hover:text-blue-600" title="Copy">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  Using ElGamal encryption for secure transactions
                </div>
              </div>
            )}
          </div>
        ) : (
          <EncryptedBalanceView />
        )}
      </div>

      <ActionButtons />
    </div>
  );
};

