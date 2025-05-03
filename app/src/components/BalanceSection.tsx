import { Coins, Eye, EyeOff } from 'lucide-react';
import { useCore } from '../lib/useCore';
import { EncryptedBalanceView } from './EncryptedBalanceView';
import { ActionButtons } from './ActionButtons';

export const BalanceSection = () => {

  const { balance, showEncrypted, setShowEncrypted } = useCore();

  return (
    <div className="px-6 pt-4 pb-8 flex flex-col items-center justify-center relative">

      <div className="text-center w-full h-36 flex flex-col items-center">
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
          <div className="flex flex-col items-center m-auto">
            {/* <div className='h-8' /> */}
            {/* <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-blue-100 border border-blue-200">
              <BadgeDollarSign size={26} className="text-blue-600" />
            </div> */}
            <div className="flex flex-col justify-center m-auto">
              <div className="text-5xl font-light text-gray-800">
                {/* <Coins /> */}
                {balance}
              </div>
              <div className="ml-2 text-lg text-gray-500">TOKENS</div>
            </div>
          </div>
        ) : (
          <EncryptedBalanceView />
        )}
      </div>

      <ActionButtons />
    </div >
  );
};

