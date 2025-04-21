import { Wallet, Key, Lock } from "lucide-react";
import { OnboardComponentProps } from "../../lib/types";

export const StepContent = ({ currentStep, children }: OnboardComponentProps) => {
	// If custom content is provided, render that instead of default content
	if (children) {
		return <div className="mb-6">{children}</div>;
	}

	// Default currentStep content
	const stepContents = [
		{
			icon: <Key size={40} className="text-blue-600" />,
			title: "Step 1: Generate Encryption Keys",
			description: "Once your wallet is connected, we'll generate an ElGamal encryption key pair to protect your transactions."
		},
		{
			icon: <Wallet size={40} className="text-blue-600" />,
			title: "Step 2: Connect Your Wallet",
			description: "To get started, connect your digital wallet to secure your account and enable transactions."
		},
		{
			icon: <Lock size={40} className="text-blue-600" />,
			title: "All Set!",
			description: "Your wallet is connected and your encryption keys are ready. You can now use Mist for private, secure transactions."
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
			</div>
		</div>
	);
};

