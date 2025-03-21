import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStarknet } from '../hooks/useStarknet';
import { useNoirProof } from '../hooks/useNoirProof';

export function TransferTab() {
  const { isConnected, account } = useStarknet();
  const { generateProof, isGenerating } = useNoirProof();
  const [showKey, setShowKey] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    privateKey: '',
    randomValue: Math.random().toString(36).substring(2),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Generate Noir proof
      const proof = await generateProof(formData);

      // TODO: Send transaction with proof to Starknet
      const tx = await account?.execute({
        contractAddress: '0x...', // Contract address
        entrypoint: 'transfer_with_proof',
        calldata: [proof], // Format proof data according to contract requirements
      });

      await account?.waitForTransaction(tx.transaction_hash);
      toast.success('Transfer completed successfully!');
    } catch (error) {
      console.error('Transfer failed:', error);
      toast.error('Transfer failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700">
            Private Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              id="privateKey"
              name="privateKey"
              value={formData.privateKey}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showKey ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="randomValue" className="block text-sm font-medium text-gray-700">
            Random Value
          </label>
          <input
            type="text"
            id="randomValue"
            name="randomValue"
            value={formData.randomValue}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly
          />
        </div>

        <button
          type="submit"
          disabled={!isConnected || isGenerating}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!isConnected
            ? 'bg-gray-400 cursor-not-allowed'
            : isGenerating
              ? 'bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {!isConnected ? 'Connect Wallet to Transfer' : isGenerating ? 'Generating Proof...' : 'Transfer'}
        </button>
      </div>
    </form>
  );
}
