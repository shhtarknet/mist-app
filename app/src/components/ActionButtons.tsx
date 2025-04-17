import { Send, ArrowDownCircle } from 'lucide-react';
import { useCore } from '../lib/useCore';

export const ActionButtons = () => {
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

