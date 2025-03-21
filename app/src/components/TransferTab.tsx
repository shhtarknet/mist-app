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

function addEmPtToOb(obj: InputMap, key: string, x: string, y: string) {
  obj[key + '.x'] = x;
  obj[key + '.y'] = y;
  obj[key + '.is_infinite'] = false;
}

function witnessData() {
  const data = {
    '_s.priv_key': '0x04d73359c9166e49aafaf9a4852eaa4dceb2c26878196b10e9048004ff5cc20c',
    '_s.bal': '0xffff',
    '_s.amt': '0x1234',
    '_s.rnd': '0x030cffca80ca4344e54e436fc5a03ae8e884b8f3edcb780702599e1951e8aa62',
  };
  addEmPtToOb(data, 's_pub_key', '0x1c0c2cd4806bd818498f4ef58836794d4ab61417de6e61ee198f7de25898e50e', '0x11da5b03a2d88adb959d5f04f8e03455e59e36b68feabd6170930cd7d473ee92');
  addEmPtToOb(data, 'sender_bal_ct.0', '0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318', '0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5');
  addEmPtToOb(data, 'sender_bal_ct.1', '0x2a0401ac9eec19b4f5472f48793db9f20b3946e3eaab8d3ecbbc3ec69bcbe9e5', '0x03c577df3d7845a6f5875e1e1eb8604871ae24a8b650cfd0a4bc70ab55a682e4');

  addEmPtToOb(data, 'r.pub_key', '0x0257eb9d702cfdf9ad18ce614cc49eb6ee4a2260f78c6ba88eb0e72789d456a7', '0x1729aef9320951bfdb39ad3c520577666fdabe318ce1c545e081f2be92573342');
  addEmPtToOb(data, 'r.bal_ct.0', '0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318', '0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5');
  addEmPtToOb(data, 'r.bal_ct.1', '0x2837ae6b3eb38bb368e52e4f2db26967710d7f4f46a1a963bd53ad59f1617fe8', '0x1583f4b6db398339d0632fd7211c518ee6bf24db94ae0f0635a5760515d57e9c');
}