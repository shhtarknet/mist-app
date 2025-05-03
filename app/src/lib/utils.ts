import { Uint256 } from "starknet";
import { CipherText, GCipherText, GPoint, Point } from "./types";
import * as curveWasm from "baby-giant-wasm";

export function decryptBalance(balEnc: CipherText, privateKey: string): string {

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

	const bal = curveWasm.grumpkin_bsgs_str(x, y).toString();

	return bal.substring(0, bal.length - 2) + '.' + bal.substring(bal.length - 2);
}

export function generatePrivateKey() {
	return generateRnd()
}

export function generateRnd() {
	const bitSize = 2 ** 45; // 253 bit numbers

	return BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * 2 ** 16)).toString(16)
}

export function emPt(x: string, y: string): Point {
	return { x, y }
}

export type ContractValue = number | bigint | Uint256;

export const conv = {
	point: function ({ x, y }: GPoint<ContractValue>): Point {
		return {
			x: String(x),
			y: String(y)
		}
	},

	// Convert contract bal_ct to stringified values for all x and y properties
	ciphertext: function (balCt: GCipherText<ContractValue>): CipherText {
		return {
			c1: conv.point(balCt.c1),
			c2: conv.point(balCt.c2),
		};
	},
	ciphertextFromAr: function (balCt: Point[]): CipherText {
		const [c1, c2] = balCt;
		return { c1, c2 };
	},
};

// Curve generator point, used for defaults
export const GEN_PT: Point = { x: BigInt('0x01').toString(), y: BigInt('0x02cf135e7506a45d632d270d45f1181294833fc48d823f272c').toString() };

export const CORE_ADDRESS = '0x0631d6f36fcc043440cb096897924206ab61333d87af5e4d74912d6b27c849ae';
