import { InputMap } from "@noir-lang/noir_js";
import { useNoirProof } from "../lib/useNoirProof";
import { useEffect, useState } from "react";
import * as Garaga from "garaga";
import { transferVK } from '../circuits/transfer';
import { Point, TransferProofWitnessData } from "../lib/types";

function emPt(x: string, y: string): Point {
	return { x, y }
	// return { x, y, is_infinite: '0' }
}

export default function ProofPlayground() {
	const { generateProof, isGenerating } = useNoirProof();
	const [proof, setProof] = useState<Uint8Array>();

	useEffect(() => {
		Garaga.init().then(() => {
			// Garaga.honk
			// setProof(reconstructHonkProof(flattenFieldsAsArray(transferProof.publicInputs), transferProof.proof));
		});
	}, []);

	useEffect(() => {
		if (proof) {
			try {
				const vk = Garaga.parseHonkVerifyingKeyFromBytes(transferVK);
				const honk_proof = Garaga.parseHonkProofFromBytes(proof);
				const calldata = Garaga.getHonkCallData(honk_proof, vk, 0);
				console.log('calldata', calldata.length);
				console.log(calldata.map(bi => bi.toString()).join(', '));
			} catch (e) {
				console.error(e);
			}
		}
	}, [proof]);

	return (
		<div className='m-20 text-center'>
			<button
				className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded'
				onClick={async () => {
					const data: TransferProofWitnessData = {
						_s: {
							priv_key: '0x04d73359c9166e49aafaf9a4852eaa4dceb2c26878196b10e9048004ff5cc20c',
							bal: '0xffff',
							amt: '0x1234',
							rnd: '0x030cffca80ca4344e54e436fc5a03ae8e884b8f3edcb780702599e1951e8aa62',
						},
						s: {
							pub_key:
								emPt('0x1c0c2cd4806bd818498f4ef58836794d4ab61417de6e61ee198f7de25898e50e', '0x11da5b03a2d88adb959d5f04f8e03455e59e36b68feabd6170930cd7d473ee92',),
							bal_ct: [
								emPt('0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318', '0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5',),
								emPt('0x2a0401ac9eec19b4f5472f48793db9f20b3946e3eaab8d3ecbbc3ec69bcbe9e5', '0x03c577df3d7845a6f5875e1e1eb8604871ae24a8b650cfd0a4bc70ab55a682e4',),
							],
						},
						r: {
							pub_key:
								emPt('0x0257eb9d702cfdf9ad18ce614cc49eb6ee4a2260f78c6ba88eb0e72789d456a7', '0x1729aef9320951bfdb39ad3c520577666fdabe318ce1c545e081f2be92573342',),
							bal_ct: [
								emPt('0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318', '0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5',),
								emPt('0x2837ae6b3eb38bb368e52e4f2db26967710d7f4f46a1a963bd53ad59f1617fe8', '0x1583f4b6db398339d0632fd7211c518ee6bf24db94ae0f0635a5760515d57e9c',),
							]
						}
					};

					const proof = await generateProof(data);
					setProof(proof);
				}
				}>
				{proof ? 'Proof generated' : isGenerating ? 'Generating proof...' : 'Test proof gen'}

			</button>
		</div >
	);
}