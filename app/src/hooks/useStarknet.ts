import { useCallback, useEffect, useState } from 'react';
import { connect, disconnect } from 'get-starknet';
import { AccountInterface, Provider } from 'starknet';
import toast from 'react-hot-toast';

export function useStarknet(shouldConnect: boolean = false) {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
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
        const starknet = await connect({ showList: false });
        if (starknet?.isConnected) {
          setAccount(starknet.account);
          setProvider(starknet.provider);
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    if (shouldConnect) {
      checkConnection();
    }
  }, [shouldConnect]);

  return {
    account,
    provider,
    isConnecting,
    isConnected: !!account,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}