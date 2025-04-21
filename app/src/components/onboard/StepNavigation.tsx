import { StepNavigationProps } from "../../lib/types";

export const StepNavigation = ({ currentStep, totalSteps, onBack }: StepNavigationProps) => {
	return (
		<div className="flex justify-between mt-4">
			<button
				className={`text-sm text-gray-500 hover:text-gray-700 transition-colors ${currentStep === 1 ? "invisible" : ''}`}
				onClick={onBack}
			>
				Back
			</button>
			<div className="text-sm text-gray-500">
				Step {currentStep} of {totalSteps || 3}
			</div>
		</div>
	);
};

