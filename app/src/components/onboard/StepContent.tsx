import { Wallet, Key, Lock } from "lucide-react";
import { StepContentProps } from "../../lib/types";

export const StepContent = ({ currentStep, postContent }: StepContentProps) => {
	// Default currentStep content
	const stepContents = [
		{
			icon: <Wallet size={40} className="text-blue-600" />,
			title: "Step 1: Connect Your Wallet",
			description: "To get started, connect your wallet to make transactions."
		},
		{
			icon: <Key size={40} className="text-blue-600" />,
			title: "Step 2: Encryption Keys",
			description: "Encryption keys for private balance, keep the private key safe to avoid losing your funds."
		},
		{
			icon: <Lock size={40} className="text-blue-600" />,
			title: "All Set!",
			description: "Your wallet is connected and your encryption keys are ready. You can now use Mist for confidential transactions."
		}
	];

	const content = stepContents[currentStep - 1];

	return (
		<div className="mb-6">
			<div className="text-center">
				<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					{content.icon}
				</div>
				<h3 className="text-lg font-medium mb-2">{content.title}</h3>
				<p className="text-sm text-gray-600 mb-4">
					{content.description}
				</p>
				{postContent}
			</div>
		</div>
	);
};

