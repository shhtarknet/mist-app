import { useState } from 'react';
import { MistContainer } from './MistContainer';
import { StepIndicator } from './StepIndicator';
import { StepContent } from './StepContent';
import { ActionButton } from './ActionButton';
import { StepNavigation } from './StepNavigation';
import { Header } from '../Header';
import { useCore } from '../../lib/useCore';
import { generatePrivateKey } from '../../lib/utils';
import { LoadingOverlay } from './LoadingOverlay.tsx';

interface OnboardingProps {
	step?: 1 | 2 | 3;
}

const Onboarding = ({ step }: OnboardingProps) => {
	const [currentStep, setCurrentStep] = useState<number>(step || 1);
	const { connectStarknet, setShowOnboarding, privKey: _privKey, account, pubKey, setupKeyPair } = useCore();
	const privKeyStr = localStorage.getItem('privK_' + account?.address);
	const [privKey, setPrivKey] = useState<string>(_privKey == 0n ? privKeyStr || '' : _privKey.toString(16));
	const isNewAccount = 2n > pubKey;
	const [noKey, setNoKey] = useState(isNewAccount && ['', '0'].includes(privKey));
	const [processingMsg, setProcessingMsg] = useState('');

	const handleNext = async () => {
		switch (currentStep) {
			case 1:
				try {
					if (await connectStarknet()) {
						setCurrentStep(_privKey < 2n ? 2 : 3);
					}
				} catch (error) {
					console.error("Error connecting to Starknet:", error);
				}
				break;
			case 2:
				if (noKey) {
					setPrivKey(generatePrivateKey());
					setNoKey(false);
					return;
				}
				if (privKey.length < 60) {
					alert("Please key in a greater than 60 digit hexadecimal private key");
					return;
				}
				if (confirm(
					"Have you safely stored your private key?\n" +
					"You won't be able to recover your funds if you lose it."
				)) {
					if (location.host.includes('localhost') || prompt("Key in your private key to proceed.")?.replace('0x', '') === privKey) {
						setProcessingMsg("Please send the transaction from your wallet...");
						if (await setupKeyPair(BigInt('0x' + privKey), pubKey, account?.address || '')) {
							setCurrentStep(prev => Math.min(prev + 1, 3));
						}
						setProcessingMsg('');
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

	return (
		<MistContainer>
			<Header
				clean
				title="Welcome to Mist"
				tagline="Simplified Confidential Transactions"
			/>

			<div className="p-6">
				<LoadingOverlay processingMsg={processingMsg} />
				<StepIndicator currentStep={currentStep} totalSteps={3} />

				<div className='pt-4' />

				<StepContent currentStep={currentStep}
					postContent={currentStep === 2 ?
						<div className='text-left'>
							<label className="block text-xs font-medium text-gray-600 m-1">
								{isNewAccount ?
									"Generate and Register Your Key Pair" :
									"Private Key matching your Public Key"}
							</label>
							{noKey ?
								<></> :
								<textarea
									value={'0x' + privKey}
									onChange={(e) => setPrivKey(e.target.value.replace(/0x/ig, ''))}
									placeholder="0x..."
									className="block text-sm w-full font-mono bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
									minLength={64}
								/>}
						</div>
						: <div className='pt-4' />} />

				<ActionButton
					label={currentStep === 2 ? (isNewAccount ? noKey ? "Generate Key" : "Register Key pair" : "Match Keys") : undefined}
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