import { Wallet, Key, ArrowRight } from "lucide-react";

interface ActionButtonProps {
	currentStep: number;
	onClick: () => void;
	label?: string;
	icon?: JSX.Element;
	color?: string;
}

export const ActionButton = ({ currentStep, onClick, label, icon, color }: ActionButtonProps) => {
	// Default settings based on currentStep
	let buttonLabel = label;
	let buttonIcon = icon;
	let buttonColor = color || "bg-blue-600 hover:bg-blue-700";

	if (currentStep === 1) {
		buttonLabel = "Connect Wallet";
		buttonIcon = <Wallet size={18} className="mr-2" />;
	} else if (currentStep === 2) {
		buttonLabel = "Generate Keys";
		buttonIcon = <Key size={18} className="mr-2" />;
	} else {
		buttonLabel = "Continue to Mist";
		buttonIcon = <ArrowRight size={18} className="mr-2" />;
		buttonColor = "bg-green-600 hover:bg-green-700";
	}
	if (label) {
		buttonLabel = label;
	}

	return (
		<button
			className={`w-full py-3 px-4 rounded-xl ${buttonColor} text-white font-medium flex items-center justify-center transition-colors`}
			onClick={onClick}
		>
			{buttonIcon}
			{buttonLabel}
		</button>
	);
};

