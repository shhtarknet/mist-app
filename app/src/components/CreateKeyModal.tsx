import { Key } from "lucide-react";
import { useCore } from "../lib/useCore";

const CreateKeyModal = () => {
	const { showCreateKeyModal, createNewKeyPair } = useCore();

	if (!showCreateKeyModal) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">Welcome to CipherMist</h2>
					<p className="text-sm text-gray-600 mt-2">
						Before you can start using your encrypted wallet, you need to generate a key pair for the ElGamal encryption protocol.
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

					<button
						onClick={createNewKeyPair}
						className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors"
					>
						<Key size={18} className="mr-2" />
						Generate My Key Pair
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateKeyModal;