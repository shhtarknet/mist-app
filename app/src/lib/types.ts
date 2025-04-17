// Types for the wallet context and components

import { ReactNode } from 'react';

// ElGamal Cipher Text Type
export interface Point {
	x: bigint; // Corresponds to u256 in Rust
	y: bigint; // Corresponds to u256 in Rust
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
	balance: string;
	showEncrypted: boolean;
	transferAmount: string;
	recipient: string;
	showTransfer: boolean;
	notification: Notification | null;
	balanceCipherText: CipherText;

	// State Setters
	setBalance: (balance: string) => void;
	setShowEncrypted: (show: boolean) => void;
	setTransferAmount: (amount: string) => void;
	setRecipient: (recipient: string) => void;
	setShowTransfer: (show: boolean) => void;
	setNotification: (notification: Notification | null) => void;

	// Functions
	showNotification: (message: string, type?: 'success' | 'error') => void;
	handleTransfer: (e: React.FormEvent) => void;
	requestTestFunds: () => void;
	truncateHash: (hash: string) => string;
}

// Props Types
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
