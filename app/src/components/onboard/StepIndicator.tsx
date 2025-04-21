import React from "react";
import { Check, Wallet2, KeyRoundIcon, Lock } from "lucide-react";
import { OnboardComponentProps } from "../../lib/types";

export const StepIndicator = ({ currentStep, totalSteps }: OnboardComponentProps) => {
	// Default to 3 steps if totalSteps is not provided
	const steps = totalSteps || 3;

	// Icons for each step
	const stepIcons = [
		<Wallet2 size={16} />,
		<KeyRoundIcon size={16} />,
		<Lock size={16} />
	];

	// Labels for each step
	const stepLabels = ["Wallet", "Key pair", "Secure"];

	return (
		<div className="flex items-center justify-between mb-6">
			{Array.from({ length: steps }).map((_, index) => (
				<React.Fragment key={index}>
					{/* Step Circle */}
					<div className={`flex flex-col items-center ${currentStep >= index + 1 ? "text-blue-600" : "text-gray-400"}`}>
						<div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= index + 1 ? "bg-blue-100" : "bg-gray-100"}`}>
							{currentStep > index + 1 ? <Check size={16} /> : stepIcons[index]}
						</div>
						<span className="text-xs mt-1">{stepLabels[index]}</span>
					</div>

					{/* Connector Line (except after the last step) */}
					{index < steps - 1 && (
						<div className={`w-16 h-1 ${currentStep > index + 1 ? "bg-blue-200" : "bg-gray-200"}`}></div>
					)}
				</React.Fragment>
			))}
		</div>
	);
};

