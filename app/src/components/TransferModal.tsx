import { Send, X } from "lucide-react";
import { useCore } from "../lib/useCore";

export const TransferModal = () => {
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount (USDT)</label>
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

