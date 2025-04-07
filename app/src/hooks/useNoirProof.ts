import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UltraHonkBackend, reconstructHonkProof } from '@aztec/bb.js';
import { ProgramCompilationArtifacts } from "@noir-lang/noir_wasm"
import { InputMap, Noir } from '@noir-lang/noir_js';
import { transferCircuit } from '../circuits/transfer';
import * as bsgs from "baby-giant-wasm";
// import * as bsgs from "babyjubjub-utils";

// declare helper functions
export function flattenFieldsAsArray(fields) {
  const flattenedPublicInputs = fields.map(hexToUint8Array);
  return flattenUint8Arrays(flattenedPublicInputs);
}

function flattenUint8Arrays(arrays) {
  const totalLength = arrays.reduce((acc, val) => acc + val.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

function hexToUint8Array(hex) {
  const sanitisedHex = BigInt(hex).toString(16).padStart(64, '0');

  const len = sanitisedHex.length / 2;
  const u8 = new Uint8Array(len);

  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(sanitisedHex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return u8;
}

// import initNoirC from "@noir-lang/noirc_abi";
// import initACVM from "@noir-lang/acvm_js";
// import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
// import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

export function useNoirProof() {
  useEffect(() => {
    bsgs.greet();
    const start = Date.now();
    const r = bsgs.grumpkin_log_test(23452345n)
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms, result: ${r}`);
    window.bsgs = bsgs;
  }, []);

  // useEffect(() => {
  //   Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))])
  //     .then(r => console.log("WASMs loaded", r))
  //     .catch(e => console.error("Failed to load WASMs", e));
  // }, []);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = useCallback(async (params: InputMap) => {
    setIsGenerating(true);
    const keccak = true;
    const proofType = keccak ? 'Keccak' : "Poseidon";
    try {
      const programCompilation = { ...transferCircuit, name: '' } as ProgramCompilationArtifacts;

      const noir = new Noir(programCompilation.program);
      const backend = new UltraHonkBackend(programCompilation.program.bytecode);

      console.log(`Generating ${proofType} witness...`);
      const { witness } = await noir.execute(params);

      console.log(`Generating ${proofType} proof...`);
      const proof = await backend.generateProof(witness, { keccak });

      const isValid = await backend.verifyProof(proof, { keccak });
      console.log(`${proofType} Proof is ${isValid ? "valid ✅" : "invalid ⛔️"}...`);

      console.log('Bytecode len: ', programCompilation.program.bytecode.length);

      const rawproof = reconstructHonkProof(flattenFieldsAsArray(proof.publicInputs), proof.proof);
      return rawproof;
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