import { Key } from "lucide-react";
import { useCore } from "../lib/useCore";
import { useState } from "react";

const CreateKeyModal = () => {
	const { showCreateKeyModal, setShowCreateKeyModal, setupKeyPair, keyPair, showNotification } = useCore();
	const bitSize = 2 ** 48;
	const [privateKey, setSeed] = useState(
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * bitSize)).toString(16) +
		BigInt(Math.floor(Math.random() * 2 ** 16)).toString(16)
	);

	if (!showCreateKeyModal && keyPair.pubX) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">Welcome to CipherMist</h2>
					<p className="text-sm text-gray-600 mt-2">
						Before you can start using your encrypted wallet, you need to generate a key pair for the encryption protocol.
					</p>
				</div>

				<div className="p-6">
					<div className="flex items-center justify-center mb-6">
						<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
							<Key size={48} className="text-blue-600" />
						</div>
					</div>

					<div className="bg-gray-100 p-4 rounded-lg mb-6">
						<h3 className="text-sm font-medium text-gray-700 mb-2">About ElGamal Encryption</h3>
						<p className="text-xs text-gray-600">
							ElGamal is a public-key cryptosystem used to secure your transactions. Your public key can be shared,
							while your private key must be kept secret. All your wallet operations will be encrypted.
						</p>
					</div>

					{keyPair.pubX ?
						<>
							<div className="mb-3">
								<label className="block text-xs font-medium text-gray-600 mb-1">Your public key</label>
								<input
									type="text"
									value={keyPair.pubX}
									className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<div className="mb-3">
								<label className="block text-xs font-medium text-gray-600 mb-1">Your private key</label>
								<input
									onFocus={(e => e.target.type = "text")}
									onBlur={(e => e.target.type = "password")}
									type="password"
									value={keyPair.privateKey}
									placeholder="0x..."
									className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<button
								className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors"
								onClick={() => setShowCreateKeyModal(false)}
							>
								Done
							</button>
						</> :
						<form onSubmit={(e) => {
							e.preventDefault();
							if (privateKey.length < 64) {
								alert("Please key in a 64 digit hexadecimal private key");
								return;
							}
							setupKeyPair(BigInt('0x' + privateKey));
							showNotification('Key pair generated successfully');

						}}>
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">Private Key</label>
								<textarea
									value={privateKey}
									onChange={(e) => setSeed(e.target.value)}
									placeholder="0x..."
									className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
									minLength={64}
								/>
							</div>

							<button
								className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors"
							>
								<Key size={18} className="mr-2" />
								Setup Key Pair
							</button>
						</form>}
				</div>
			</div>
		</div >
	);
};

export default CreateKeyModal;