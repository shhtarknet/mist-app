import { Send, ArrowDownCircle } from 'lucide-react';
import { useCore } from '../lib/useCore';

export const ActionButtons = () => {
  const { setShowTransfer, requestTestFunds, balance } = useCore();

  const primaryBtn = 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200';
  const secondaryBtn = 'bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-50 ';

  return (
    <div className="w-full mt-8 space-y-3">
      <button
        onClick={() => setShowTransfer(true)}
        className={"w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors shadow-lg " + (+balance > 0 ? primaryBtn : secondaryBtn)}
      >
        <Send size={18} className="mr-2" />
        Transfer Funds
      </button>

      <button
        onClick={requestTestFunds}
        className={"w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors " + (+balance > 0 ? secondaryBtn : primaryBtn)}
      >
        <ArrowDownCircle size={18} className="mr-2" />
        Request Test Funds
      </button>
    </div>
  );
};

