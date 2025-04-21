import { Wallet, Wallet2 } from "lucide-react";
import { useCore } from "../lib/useCore";
import { useEffect } from "react";

const StarknetModal = () => {
	const { connectStarknet, keyPair, setShowOnboarding } = useCore();
	useEffect(() => {
		if (keyPair.pubX) {
			setShowOnboarding(true);
		}
	}, [keyPair.pubX, setShowOnboarding]);
	return (
		<div className="flex items-center justify-center z-10 p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">Welcome to Mist</h2>
					<p className="text-sm text-gray-600 mt-2">
						Mist is a private payments platform.
					</p>

				</div>

				<div className="p-6">
					<div className="flex items-center justify-center mb-6">
						<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
							<Wallet size={48} className="text-blue-600" />
						</div>
					</div>
					<p className="text-sm text-center text-gray-600 mb-4">
						Please connect your wallet to continue.
					</p>

					<button
						className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-colors"
						onClick={() => connectStarknet()}
					>
						<Wallet2 size={18} className="mr-2" />
						Connect wallet
					</button>

				</div>
			</div>
		</div >
	);
};

export default StarknetModal;