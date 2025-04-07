import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { connect, disconnect } from 'get-starknet';
import { AccountInterface, Contract } from 'starknet';
import toast from 'react-hot-toast';
import { VerifierABI } from './abi.ts';


// Create a context to hold our Starknet state
interface StarknetContextType {
  account: AccountInterface | null;
  verifier: Contract | null;
  isConnecting: boolean;
  isConnected: boolean;
  verify: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const StarknetContext = createContext<StarknetContextType | undefined>(undefined);
const VERIFIER_ADDRESS = '';

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
  const [verifier, setVerifier] = useState<Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const starknet = await connect({ modalMode: 'neverAsk' });
        if (starknet?.isConnected) {
          setAccount(starknet.account);
          setVerifier(new Contract(VerifierABI, VERIFIER_ADDRESS, starknet.account));
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    if (autoConnect) {
      checkConnection();
    }
  }, [autoConnect]);

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const starknet = await connect();

      if (!starknet) {
        throw new Error('Failed to connect to Starknet');
      }

      await starknet.enable();
      setAccount(starknet.account);
      setVerifier(new Contract(VerifierABI, VERIFIER_ADDRESS, starknet.account));
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setAccount(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, []);

  const contextValue: StarknetContextType = {
    account,
    verifier,
    isConnecting,
    verify: async () => { },
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