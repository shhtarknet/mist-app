import { KeyRound, Wallet } from 'lucide-react';

function decryptBalance() {
	balanceCipherText
}

export default function HomeTab() {
	const balanceCipherText = {
		c1: { x: 0x01n, y: 0x02cf135e7506a45d632d270d45f1181294833fc48d823f272cn },
		c2: {
			x: 0x2b2498a183dcc09a383386afdb675194b6119738bdb97b63e470644e87e8ec2bn,
			y: 0x2c0878f1e4f3d042322a228806f39091db24037fbd87602442619c73107a372bn,
		},
	};
	const privateKey = 1;

	return (
		<div className="flex flex-col items-center justify-center py-12 px-4">
			<Wallet className="w-16 h-16 text-gray-400 mb-4" />
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Key Generation</h2>
			<p className="text-gray-600 text-center max-w-md">
				Key generation functionality is coming soon. This feature will allow you to generate secure keys
				for private transfers.
			</p>
		</div>
	);
}