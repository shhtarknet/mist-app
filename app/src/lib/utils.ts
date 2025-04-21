import { CipherText } from "./types";
import * as curveWasm from "baby-giant-wasm";

export function decryptBalance(balEnc: CipherText, privateKey: string): string {

	console.log(balEnc, privateKey);

	if (0n == BigInt(balEnc.c2.x)) {
		return '0.00';
	}

	const balECPointEncoded = curveWasm.elgamal_decrypt(
		BigInt(privateKey).toString(),
		BigInt(balEnc.c1.x).toString(),
		BigInt(balEnc.c1.y).toString(),
		BigInt(balEnc.c2.x).toString(),
		BigInt(balEnc.c2.y).toString(),
	);

	const [x, y] = balECPointEncoded.split('|');

	console.log('Encoded balance Pt:', x, y);

	const bal = curveWasm.grumpkin_bsgs_str(x, y).toString();

	console.log('Balance:', bal);

	return bal.substring(0, bal.length - 2) + '.' + bal.substring(bal.length - 2);
}

export function generatePrivateKey() {
	const bitSize = 2 ** 48;

	return BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * 2 ** 16)).toString(16)
}