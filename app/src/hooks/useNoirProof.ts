import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UltraHonkBackend } from '@aztec/bb.js';
import { ProgramCompilationArtifacts } from "@noir-lang/noir_wasm"
import { InputMap, Noir } from '@noir-lang/noir_js';
import compiledArtifacts from '../circuits/transfer.json';


import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

interface EmbeddedCurvePoint {
  x: string;
  y: string;
  is_infinite: boolean;
}

interface SecretValues {
  priv_key: string;
  bal: string;
  amt: string;
  rnd: string;
}

interface ReceiverData {
  pub_key: EmbeddedCurvePoint;
  bal_ct: EmbeddedCurvePoint[];
}

interface ProofData {
  _s: SecretValues;
  s_pub_key: EmbeddedCurvePoint;
  sender_bal_ct: EmbeddedCurvePoint[];
  r: ReceiverData;
}

export function useNoirProof() {
  useEffect(() => {
    Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))])
      .then(r => console.log("WASMs loaded", r))
      .catch(e => console.error("Failed to load WASMs", e));
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = useCallback(async (params: InputMap) => {
    setIsGenerating(true);
    try {
      const programCompilation = { ...compiledArtifacts, name: '' } as ProgramCompilationArtifacts;

      const noir = new Noir(programCompilation.program);
      const backend = new UltraHonkBackend(programCompilation.program.bytecode);

      console.log("Generating witness... ⏳");
      const { witness } = await noir.execute(params);
      console.log("Generated witness... ✅");

      console.log("Generating proof... ⏳");
      const proof = await backend.generateProof(witness);
      console.log("Generated proof... ✅");
      console.log("Results", proof.proof);

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