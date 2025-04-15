import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { connect, disconnect } from 'get-starknet';
import { AccountInterface, Contract, TypedContractV2 } from 'starknet';
import toast from 'react-hot-toast';
import { VerifierABI, CoreABI } from './abi.ts';


// Create a context to hold our Starknet state
interface StarknetContextType {
  account: AccountInterface | null;
  verifier: TypedContractV2<typeof VerifierABI> | null;
  core: TypedContractV2<typeof CoreABI> | null;
  isConnecting: boolean;
  isConnected: boolean;
  verify: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const StarknetContext = createContext<StarknetContextType | undefined>(undefined);
const VERIFIER_ADDRESS = '';
const CORE_ADDRESS = '0x0483bbdb1b9bdc2cb233302675954836e8a8b5f4ab45bd1a1ee338ae6f996d29';

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
  const [verifier, setVerifier] = useState<TypedContractV2<typeof VerifierABI> | null>(null);
  const [core, setCore] = useState<TypedContractV2<typeof CoreABI> | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);


  function prepareContracts(account: AccountInterface | AccountInterface,) {
    const contractVerifier = new Contract(VerifierABI, VERIFIER_ADDRESS, account);
    setVerifier(contractVerifier.typedv2(VerifierABI));
    const contractCore = new Contract(CoreABI, CORE_ADDRESS, account);
    setCore(contractCore.typedv2(CoreABI));

  }

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const starknet = await connect({ modalMode: 'neverAsk' });
        if (starknet?.isConnected) {
          setAccount(starknet.account);
          prepareContracts(starknet.account)
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
      prepareContracts(starknet.account)
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
    core,
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
export function useStarknet(): StarknetContextType {
  const context = useContext(StarknetContext);

  if (context === undefined) {
    throw new Error('useStarknet must be used within a StarknetProvider');
  }

  return context;
}