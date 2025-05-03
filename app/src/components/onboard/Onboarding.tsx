import React, { useState } from 'react';
import { MistContainer } from './MistContainer';
import { StepIndicator } from './StepIndicator';
import { StepContent } from './StepContent';
import { ActionButton } from './ActionButton';
import { StepNavigation } from './StepNavigation';
import { Header } from '../Header';
import { useCore } from '../../lib/useCore';
import { generatePrivateKey } from '../../lib/utils';

interface OnboardingProps {
	step?: 1 | 2 | 3;
}

const Onboarding = ({ step }: OnboardingProps) => {
	const [currentStep, setCurrentStep] = useState<number>(step || 1);
	const { connectStarknet, setShowOnboarding, keyPair, setupKeyPair } = useCore();
	const [privKey, setPrivKey] = useState(keyPair.privateKey.toString(16));

	const handleNext = async () => {
		switch (currentStep) {
			case 1:
				try {
					if (await connectStarknet()) {
						setCurrentStep(!keyPair.privateKey ? 2 : 3);
					}
				} catch (error) {
					console.error("Error connecting to Starknet:", error);
				}
				break;
			case 2:
				if (privKey.length < 60) {
					alert("Please key in a greater than 60 digit hexadecimal private key");
					return;
				}
				if (confirm(
					"Have you safely stored your private key?\n" +
					"You won't be able to recover your funds if you lose it."
				)) {
					if (prompt("What is your private key?")?.replace('0x', '') === privKey) {
						if (setupKeyPair(BigInt('0x' + privKey))) {
							setCurrentStep(prev => Math.min(prev + 1, 3));
						}
					}
				}
				break;
			case 3:
				setShowOnboarding(false)
				break;
			default:
				break;
		}
	};

	const handleBack = () => {
		setCurrentStep(prev => Math.max(prev - 1, 1));
	};

	const isNewAccount = 2n > keyPair.pubX;

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

				<StepContent currentStep={currentStep}
					postContent={currentStep === 2 ?
						<div className='text-left'>
							<label className="block text-xs font-medium text-gray-600 m-1">
								{isNewAccount ?
									"Register Private Key" :
									"Private Key matching your Public Key"}
								{!(privKey && privKey != '0') && <button
									className="text-xs float-right text-blue-600 hover:underline ml-2"
									onClick={() => setPrivKey(generatePrivateKey())}
								>Generate</button>}
							</label>
							<textarea
								value={'0x' + privKey}
								onChange={(e) => setPrivKey(e.target.value.replace(/0x/ig, ''))}
								placeholder="0x..."
								className="block text-sm w-full font-mono bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
								minLength={64}
							/>
						</div>
						: <div className='pt-4' />} />

				<ActionButton
					label={currentStep === 2 ? (isNewAccount ? "Register New Keys" : "Match Keys") : undefined}
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