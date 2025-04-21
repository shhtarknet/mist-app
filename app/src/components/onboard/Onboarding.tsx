import React from 'react';
import { MistContainer } from './MistContainer';
import { StepIndicator } from './StepIndicator';
import { StepContent } from './StepContent';
import { ActionButton } from './ActionButton';
import { StepNavigation } from './StepNavigation';
import { Header } from '../Header';
import { useCore } from '../../lib/useCore';

const Onboarding = () => {
	const [currentStep, setCurrentStep] = React.useState(1);
	const { connectStarknet } = useCore();

	const handleNext = async () => {
		switch (currentStep) {
			case 1:
				break;
			case 2:
				// Generate keys logic
				await connectStarknet();
				break;
			case 3:
				// Continue to Mist logic
				break;
			default:
				break;
		}
		setCurrentStep(prev => Math.min(prev + 1, 3));
	};

	const handleBack = () => {
		setCurrentStep(prev => Math.max(prev - 1, 1));
	};

	return (
		<MistContainer>
			<Header
				clean
				title="Welcome to Mist"
				tagline="Simplified Confidential Transactions"
			/>

			<div className="p-6">
				<StepIndicator currentStep={currentStep} totalSteps={3} />

				<div className='pt-4' />

				<StepContent currentStep={currentStep} />

				<div className='pt-4' />

				<ActionButton
					currentStep={currentStep}
					onClick={handleNext}
				/>

				<StepNavigation
					currentStep={currentStep}
					totalSteps={3}
					onBack={handleBack}
				/>
			</div>
		</MistContainer>
	);
};

export default Onboarding;