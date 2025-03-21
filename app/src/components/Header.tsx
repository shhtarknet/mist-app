import React from 'react';
import { Lock } from 'lucide-react';
import { useStarknet } from '../hooks/useStarknet';

export function Header() {
  const { isConnected, isConnecting, connect, disconnect, account } = useStarknet();

  return (
    <header className="bg-gray-900 text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-6 h-6" />
          <h1 className="text-xl font-bold">Confidential ERC20</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? `Connected: ${account?.address.slice(0, 6)}...${account?.address.slice(-4)}` : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isConnecting
                ? 'bg-gray-500 cursor-not-allowed'
                : isConnected
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}