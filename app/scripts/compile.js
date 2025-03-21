import { compile, createFileManager } from "@noir-lang/noir_wasm"

async function getCircuit() {
	const fm = createFileManager(import.meta.dirname + '/../../circuits/transfer/');
	const myCompiledCode = await compile(fm);
	console.log(JSON.stringify(myCompiledCode))

	return myCompiledCode;
}

(async () => {
	const circuit = await getCircuit();
})();