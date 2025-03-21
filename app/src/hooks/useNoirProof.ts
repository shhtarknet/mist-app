import { useCallback, useState } from 'react';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import toast from 'react-hot-toast';

interface TransferParams {
  recipient: string;
  amount: string;
  privateKey: string;
  randomValue: string;
}

export function useNoirProof() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = useCallback(async (params: TransferParams) => {
    setIsGenerating(true);
    try {
      // Initialize Barretenberg backend
      const backend = new BarretenbergBackend(window.navigator.hardwareConcurrency);
      
      // TODO: Replace with actual circuit once available
      const circuit = new Noir([], backend);
      
      // Generate proof with input parameters
      const proof = await circuit.generateFinalProof({
        recipient: params.recipient,
        amount: params.amount,
        private_key: params.privateKey,
        random_value: params.randomValue,
      });

      return proof;
    } catch (error) {
      console.error('Failed to generate proof:', error);
      toast.error('Failed to generate proof');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateProof,
    isGenerating,
  };
}