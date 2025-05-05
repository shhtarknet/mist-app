import { CircleDotDashed, Send } from "lucide-react";
import { useCore } from "../lib/useCore";
import { Modal } from "./Modal";

export const TransferModal = () => {
  const {
    showTransfer,
    setShowTransfer,
    transferAmount,
    setTransferAmount,
    recipient,
    setRecipient,
    handleTransfer,
    isGeneratingProof
  } = useCore();

  if (!showTransfer) return null;

  return (

    <Modal
      footer="Transaction will be encrypted using ElGamal"
      header="Transfer Funds"
      onClose={() => { setShowTransfer(false) }}>
      <form onSubmit={async e => {
        e.preventDefault();
        handleTransfer();
        setShowTransfer(false);
      }} className="p-6">
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
              {isGeneratingProof ?
                <>
                  <CircleDotDashed size={18} className="mr-2 animate-spin" />
                  Generating proof
                </> :
                <>
                  <Send size={18} className="mr-2" />
                  Send Transaction
                </>
              }
            </button>
          </div>
        </div>
      </form>
    </Modal >
  );
};

