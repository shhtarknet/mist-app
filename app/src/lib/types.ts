// Types for the wallet context and components

import { StarknetWindowObject } from '@starknet-io/get-starknet';
import { ReactNode } from 'react';
import { TypedContractV2, WalletAccount } from 'starknet';
import { CoreABI } from './abi';

export interface GPoint<T> {
	x: T; // Corresponds to u256 in Rust
	y: T; // Corresponds to u256 in Rust
};

export type Point = GPoint<string>;

export interface GCipherText<T> {
	c1: GPoint<T>;
	c2: GPoint<T>;
}

export type CipherText = GCipherText<string>;

// Notification Type
export interface Notification {
	message: string;
	type: 'success' | 'error';
}

// Context Value Type
export interface CoreContextValue {
	// State
	isLoading: boolean;
	isGeneratingProof: boolean;
	showEncrypted: boolean;
	showOnboarding: boolean;
	showTransfer: boolean;
	showCreateKeyModal: boolean;

	balance: string;
	transferAmount: string;
	recipient: string;
	notification: Notification | null;
	balanceEnc: CipherText;
	pubKey: bigint;
	privKey: bigint;

	// Starknet stuff
	starknet: StarknetWindowObject | null,
	account: WalletAccount | null,
	CoreContract: TypedContractV2<typeof CoreABI>,

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
	handleTransfer: () => void;
	requestTestFunds: () => void;
	truncateHash: (hash: string) => string;
	setupKeyPair: (privateKey: bigint, pubKey: bigint, address: string) => Promise<boolean>;
	connectStarknet: () => Promise<boolean>;
}

export interface HasChildren {
	children: ReactNode;
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
	bal_ct: CipherText;
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

