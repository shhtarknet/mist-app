// This script compiles the transfer circuit and writes the compiled code to a file.
// Usage: pnpm node compile.js output.txt

import { compile, createFileManager } from "@noir-lang/noir_wasm"
import { writeFile } from 'fs/promises';

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