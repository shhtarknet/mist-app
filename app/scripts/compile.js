// This script compiles the transfer circuit and writes the compiled code to a file.
// Usage: pnpm node compile.js output.txt

import { compile, createFileManager } from "@noir-lang/noir_wasm"
import { writeFile } from 'fs/promises';
// import from lib
import { reconstructHonkProof } from '@aztec/bb.js';

// declare helper functions
function flattenFieldsAsArray(fields) {
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

(async () => {
	const args = process.argv.slice(2);

	// Check if a file path was provided
	if (args.length === 0) {
		console.error('Please provide an output file path.');
		console.error('Usage: pnpm node test.js output.txt');
		process.exit(1);
	}

	// Get the file path from command-line arguments
	const outputPath = args[0];

	const transferPath = outputPath + '/transfer.json'

	const fm = createFileManager(import.meta.dirname + '/../../circuits/transfer/');
	const myCompiledCode = await compile(fm);
	await writeFile(transferPath, JSON.stringify(myCompiledCode));

	console.log();
	console.log('\x1b[32m%s\x1b[0m', 'Written to ' + transferPath);  //cyan
})();