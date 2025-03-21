import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { connect, disconnect } from 'get-starknet';
import { AccountInterface, RpcProvider } from 'starknet';
import toast from 'react-hot-toast';

// Create a context to hold our Starknet state
interface StarknetContextType {
  account: AccountInterface | null;
  provider: RpcProvider | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const StarknetContext = createContext<StarknetContextType | undefined>(undefined);

// Provider props interface
interface StarknetProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

// StarknetProvider component that will wrap your app
export function StarknetProvider({
  children,
  autoConnect = false
}: StarknetProviderProps) {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [provider, setProvider] = useState<RpcProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const starknet = await connect();

      if (!starknet) {
        throw new Error('Failed to connect to Starknet');
      }

      await starknet.enable();
      setAccount(starknet.account);
      setProvider(starknet.provider);
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      setAccount(null);
      setProvider(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setAccount(null);
      setProvider(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const starknet = await connect({ modalMode: 'neverAsk' });
        if (starknet?.isConnected) {
          setAccount(starknet.account);
          setProvider(starknet.provider);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    if (autoConnect) {
      checkConnection();
    }
  }, [autoConnect]);

  const contextValue: StarknetContextType = {
    account,
    provider,
    isConnecting,
    isConnected: !!account,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };

  return (
    <StarknetContext.Provider value={contextValue} >
      {children}
    </StarknetContext.Provider>
  );
}

// Custom hook to use the Starknet context
export function useStarknet() {
  const context = useContext(StarknetContext);

  if (context === undefined) {
    throw new Error('useStarknet must be used within a StarknetProvider');
  }

  return context;
}