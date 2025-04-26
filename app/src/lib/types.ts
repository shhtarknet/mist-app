// Types for the wallet context and components

import { StarknetWindowObject } from '@starknet-io/get-starknet';
import { ReactNode } from 'react';
import { WalletAccount } from 'starknet';

// ElGamal Cipher Text Type
export interface Point {
	x: string; // Corresponds to u256 in Rust
	y: string; // Corresponds to u256 in Rust
};

export interface CipherText {
	c1: Point;
	c2: Point;
}

// Notification Type
export interface Notification {
	message: string;
	type: 'success' | 'error';
}

// Context Value Type
export interface CoreContextValue {
	// State
	isLoading: boolean;
	showEncrypted: boolean;
	showOnboarding: boolean;
	showTransfer: boolean;
	showCreateKeyModal: boolean;

	balance: string;
	transferAmount: string;
	recipient: string;
	notification: Notification | null;
	balanceEnc: CipherText;
	keyPair: KeyPair;
	starknet: StarknetWindowObject | null,
	account: WalletAccount | null,

	// State Setters
	setShowEncrypted: (show: boolean) => void;
	setShowOnboarding: (show: boolean) => void;
	setShowCreateKeyModal: (show: boolean) => void;
	setShowTransfer: (show: boolean) => void;

	setTransferAmount: (amount: string) => void;
	setRecipient: (recipient: string) => void;
	setNotification: (notification: Notification | null) => void;

	// Functions
	showNotification: (message: string, type?: 'success' | 'error') => void;
	handleTransfer: (e: React.FormEvent) => void;
	requestTestFunds: () => void;
	truncateHash: (hash: string) => string;
	setupKeyPair: (privateKey: bigint) => void;
	connectStarknet: () => Promise<boolean>;
}

export interface WalletProviderProps {
	children: ReactNode;
}

export interface SecretValues {
	priv_key: string;
	bal: string;
	amt: string;
	rnd: string;
}

export interface UserPubData {
	pub_key: Point;
	bal_ct: Point[];
}

export interface TransferProofWitnessData {
	_s: SecretValues;
	s: UserPubData;
	r: UserPubData;
}

// Key Pair Type
export interface KeyPair {
	pubX: bigint,
	pubY: bigint,
	privateKey: bigint;
}


// Onboarding component props

export interface OnboardComponentProps {
	currentStep: number;
	totalSteps?: number;
}

export interface StepNavigationProps extends OnboardComponentProps {
	onBack: () => void;
}

export interface StepContentProps extends OnboardComponentProps {
	postContent?: ReactNode
}

