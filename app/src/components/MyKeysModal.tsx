import { Key } from "lucide-react";
import { useCore } from "../lib/useCore";
import { disconnect } from "@starknet-io/get-starknet";
import { Modal } from "./Modal";

const MyKeysModal = () => {
	const { showCreateKeyModal, setShowCreateKeyModal, account, privKey } = useCore();

	if (!showCreateKeyModal) return null;

	return (
		<Modal
			header="Create key pair"
			// footer="Yo yoyo"
			onClose={() => setShowCreateKeyModal(false)}
		>

			<div className="flex items-center justify-center mb-6">
				<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
					<Key size={48} className="text-blue-600" />
				</div>
			</div>

			<div className="bg-gray-100 p-4 rounded-lg mb-6">
				<h3 className="text-sm font-medium text-gray-700 mb-2">About ElGamal Encryption</h3>
				<p className="text-xs text-gray-600">
					ElGamal is a public-key cryptosystem used to secure your transactions. Your public key can be shared,
					while your private key must be kept secret.
				</p>
			</div>

			<div className="mb-3">
				<label className="block text-xs font-medium text-gray-600 mb-1">Account address</label>
				<input
					type="text"
					value={account?.address}
					className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
			<div className="mb-3">
				<label className="block text-xs font-medium text-gray-600 mb-1">Your private key</label>
				<input
					onFocus={(e => e.target.type = "text")}
					onBlur={(e => e.target.type = "password")}
					type="password"
					value={privKey.toString(16)}
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
			<button
				className="w-full mt-3 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium flex items-center justify-center transition-colors"
				onClick={async () => await disconnect()}
			>
				Disconnect wallet
			</button>

		</Modal>
	);
};

export default MyKeysModal;