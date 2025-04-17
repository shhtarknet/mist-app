import { useState, createContext, useContext } from 'react';
import { Notification, WalletContextValue, WalletProviderProps } from './types';

// Create Context
const CoreContext = createContext<WalletContextValue | undefined>(undefined);

export const useCore = () => useContext(CoreContext);


// Provider Component
export const CoreProvider = ({ children }: WalletProviderProps) => {
	const [balance, setBalance] = useState('750.00');
	const [showEncrypted, setShowEncrypted] = useState(false);
	const [transferAmount, setTransferAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [showTransfer, setShowTransfer] = useState(false);
	const [notification, setNotification] = useState<Notification | null>(null);

	const balanceCipherText = {
		c1: { x: '0x01', y: '0x02cf135e7506a45d632d270d45f1181294833fc48d823f272c' },
		c2: {
			x: '0x2b2498a183dcc09a383386afdb675194b6119738bdb97b63e470644e87e8ec2b',
			y: '0x2c0878f1e4f3d042322a228806f39091db24037fbd87602442619c73107a372b',
		},
	};

	const showNotification = (message: string, type = 'success') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleTransfer = (e) => {
		e.preventDefault();
		showNotification('Transfer initiated successfully');
		setTransferAmount('');
		setRecipient('');
		setShowTransfer(false);
	};

	const requestTestFunds = () => {
		showNotification('Test funds requested successfully');
	};

	const truncateHash = (hash: string) => {
		if (!hash) return '';
		return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
	};

	// Value object with all states and functions to be provided
	const value = {
		balance,
		setBalance,
		showEncrypted,
		setShowEncrypted,
		transferAmount,
		setTransferAmount,
		recipient,
		setRecipient,
		showTransfer,
		setShowTransfer,
		notification,
		setNotification,
		balanceCipherText,
		showNotification,
		handleTransfer,
		requestTestFunds,
		truncateHash
	};

	return (
		<CoreContext.Provider value={value}>
			{children}
		</CoreContext.Provider>
	);
};
