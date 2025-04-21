import { useState, createContext, useContext, useEffect } from 'react';
import { Notification, CoreContextValue, WalletProviderProps, CipherText, KeyPair } from './types';
import { decryptBalance } from './utils';

// Create Context
const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export const useCore = (): CoreContextValue => {
	const ctx = useContext(CoreContext)
	if (!ctx) {
		throw Error("Core context not defined");
	}

	return ctx
};

// Provider Component
export const CoreProvider = ({ children }: WalletProviderProps) => {
	const [balance, setBalance] = useState('');
	const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
	const [keyPair, setKeyPair] = useState<KeyPair>({
		privateKey: '',
		publicKey: '',
	});
	const [balanceEnc, setBalanceEnc] = useState<CipherText>({
		c1: { x: '0x0', y: '0x0' },
		c2: { x: '0x0', y: '0x0', },
	});
	const [privateKey, setPrivateKey] = useState(1n);
	const [showEncrypted, setShowEncrypted] = useState(false);
	const [transferAmount, setTransferAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [showTransfer, setShowTransfer] = useState(false);
	const [notification, setNotification] = useState<Notification | null>(null);

	useEffect(
		() => {
			const privKeyStr = window.localStorage.getItem('priv_key');
			if (privKeyStr) {
				setPrivateKey(BigInt(privKeyStr));
			}
		}, []
	)

	useEffect(
		() => setBalance(decryptBalance(balanceEnc, privateKey)), [balanceEnc, privateKey]
	)

	useEffect(
		() => {
			const encBal = {
				c1: { x: '0x01', y: '0x02cf135e7506a45d632d270d45f1181294833fc48d823f272c' },
				c2: {
					x: '0x2b2498a183dcc09a383386afdb675194b6119738bdb97b63e470644e87e8ec2b',
					y: '0x2c0878f1e4f3d042322a228806f39091db24037fbd87602442619c73107a372b',
				},
			};
			setBalanceEnc(encBal);
		}, [privateKey]
	)

	useEffect(
		() => {
			const encBal = {
				c1: { x: '0x01', y: '0x02cf135e7506a45d632d270d45f1181294833fc48d823f272c' },
				c2: {
					x: '0x2b2498a183dcc09a383386afdb675194b6119738bdb97b63e470644e87e8ec2b',
					y: '0x2c0878f1e4f3d042322a228806f39091db24037fbd87602442619c73107a372b',
				},
			};
			setBalanceEnc(encBal);
			setBalance(decryptBalance(encBal, privateKey))
		}, [privateKey]
	)

	const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleTransfer = () => {
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

	// Create and save a new key pair
	const getKeyPair = (privateKey: string) => {
		// const privateKey = '0x' + BigInt('0x' + seed);
		const publicKey = '0x' + Math.random().toString(16).substring(2, 34);

		const newKeyPair = { privateKey, publicKey };
		setKeyPair(newKeyPair);
		setShowCreateKeyModal(false);

		// In a real app, you would store this securely
		// For demo purposes, we'll use localStorage
		localStorage.setItem('cipherMistKeyPair', JSON.stringify(newKeyPair));

		showNotification('Key pair generated successfully');
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
		showCreateKeyModal,
		setShowCreateKeyModal,
		keyPair,
		showNotification,
		handleTransfer,
		requestTestFunds,
		truncateHash,
		getKeyPair,
		balanceEnc,
	};

	return (
		<CoreContext.Provider value={value}>
			{children}
		</CoreContext.Provider>
	);
};
