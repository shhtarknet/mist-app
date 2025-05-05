// This script compiles the transfer circuit and writes the compiled code to a file.
// Usage: pnpm node compile.js output.txt

import { compile, createFileManager } from "@noir-lang/noir_wasm"
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
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


	const fm = createFileManager(import.meta.dirname + '/../../circuits/transfer/');
	const compiledCode = await compile(fm);

	// circuits / transfer / target / vk.bin
	// const vk = await fm.readFile('target/vk.bin');

	const noir = new Noir(compiledCode.program);
	const { witness } = await noir.execute(transferParams);

	const backend = new UltraHonkBackend(compiledCode.program.bytecode);
	console.log('Bytecode len: ', compiledCode.program.bytecode.length);
	let proof = await backend.generateProof(witness, { keccak: true });
	const rawproof = reconstructHonkProof(flattenFieldsAsArray(proof.publicInputs), proof.proof);
	// bb.js doesn't allow setting keccak for getting vk (fixed in newer version)
	// const vk = await backend.api.acirWriteVkUltraKeccakHonk.bind(backend.api)(backend.acirUncompressedBytecode, backend.circuitOptions.recursive);
	const vk = await backend.api.acirWriteVkUltraKeccakHonk(backend.acirUncompressedBytecode)

	await writeFile(
		outputPath + '/transfer.ts',
		"// Auto-generated file" +
		`\nexport const transferWitness = new Uint8Array([\n${witness}\n]);\n` +
		`\nexport const transferVK = new Uint8Array([\n${vk}\n]);\n` +
		`\nexport const transferProof = {` +
		`\n\tpublicInputs: ${JSON.stringify(proof.publicInputs)},` +
		`\n\tproof: new Uint8Array([\n${proof.proof}\n]),` +
		`\n};\n` +
		`\nexport const transferCircuit = ${JSON.stringify(compiledCode)};`
	);

	console.log('\x1b[32m%s\x1b[0m', 'Transfer circuit params: ' + outputPath + '/transfer.ts');

})();

const transferParams = {
	"_s": {
		"priv_key": "0x04d73359c9166e49aafaf9a4852eaa4dceb2c26878196b10e9048004ff5cc20c",
		"bal": "0xffff",
		"amt": "0x1234",
		"rnd": "0x030cffca80ca4344e54e436fc5a03ae8e884b8f3edcb780702599e1951e8aa62"
	},
	"s": {
		"pub_key": {
			"x": "0x1c0c2cd4806bd818498f4ef58836794d4ab61417de6e61ee198f7de25898e50e",
			"y": "0x11da5b03a2d88adb959d5f04f8e03455e59e36b68feabd6170930cd7d473ee92",
		},
		"bal_ct": [
			{
				"x": "0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318",
				"y": "0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5",
			}, {
				"x": "0x2a0401ac9eec19b4f5472f48793db9f20b3946e3eaab8d3ecbbc3ec69bcbe9e5",
				"y": "0x03c577df3d7845a6f5875e1e1eb8604871ae24a8b650cfd0a4bc70ab55a682e4",
			}
		],
	},
	"r": {
		"pub_key": {
			"x": "0x0257eb9d702cfdf9ad18ce614cc49eb6ee4a2260f78c6ba88eb0e72789d456a7",
			"y": "0x1729aef9320951bfdb39ad3c520577666fdabe318ce1c545e081f2be92573342",
		},
		"bal_ct": [
			{
				"x": "0x13e15bc67dbb21616fb9cb47bb4462f39c36d1727df4f1d05e4c18ae9f8f6318",
				"y": "0x12cdc1e67b00d986285279d79f7b4f276abe22ecda25a83c5e311cb41045d6a5",
			}, {
				"x": "0x2837ae6b3eb38bb368e52e4f2db26967710d7f4f46a1a963bd53ad59f1617fe8",
				"y": "0x1583f4b6db398339d0632fd7211c518ee6bf24db94ae0f0635a5760515d57e9c",
			}
		]
	}
};