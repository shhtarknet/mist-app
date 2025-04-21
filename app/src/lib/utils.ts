import { CipherText } from "./types";

export function decryptBalance(balEnc: CipherText, privateKey: string): string {
	const dummy = BigInt(balEnc.c1.x) + 1n;
	const fmt = ((dummy + BigInt(privateKey)) / dummy + 125n).toString()

	return fmt.substring(0, fmt.length - 2) + '.' + fmt.substring(fmt.length - 2);
}