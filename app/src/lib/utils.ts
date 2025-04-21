import { CipherText } from "./types";
import * as curveWasm from "baby-giant-wasm";

export function decryptBalance(balEnc: CipherText, privateKey: string): string {

	console.log(balEnc, privateKey);

	if (0n == BigInt(balEnc.c2.x)) {
		return '0.00';
	}

	const bal = curveWasm.elgamal_decrypt(
		BigInt(privateKey).toString(),
		BigInt(balEnc.c1.x).toString(),
		BigInt(balEnc.c1.y).toString(),
		BigInt(balEnc.c2.x).toString(),
		BigInt(balEnc.c2.y).toString(),
	);
	console.log('bal:', bal);

	return bal.substring(0, bal.length - 2) + '.' + bal.substring(bal.length - 2);
}