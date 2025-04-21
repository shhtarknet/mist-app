import { useState, createContext, useContext, useEffect } from 'react';
import { Notification, CoreContextValue, WalletProviderProps, CipherText, KeyPair } from './types';
import { decryptBalance } from './utils';
import * as curveWasm from "baby-giant-wasm";
import { connect, StarknetWindowObject } from '@starknet-io/get-starknet';

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
	const [starknet, setStarknet] = useState<StarknetWindowObject | null>(null);
	const [balance, setBalance] = useState('');
	const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
	const [keyPair, setKeyPair] = useState<KeyPair>({ privateKey: 0n, pubX: 0n, pubY: 0n, });
	const [balanceEnc, setBalanceEnc] = useState<CipherText>({
		c1: { x: '0x0', y: '0x0' },
		c2: { x: '0x0', y: '0x0', },
	});
	const [showEncrypted, setShowEncrypted] = useState(false);
	const [transferAmount, setTransferAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [showTransfer, setShowTransfer] = useState(false);
	const [notification, setNotification] = useState<Notification | null>(null);

	useEffect(
		() => {
			connect({ modalMode: 'neverAsk' }).then((starknet) => {
				setStarknet(starknet);
			});
			curveWasm.greet();
			const privKeyStr = window.localStorage.getItem('privacyKeyPair');
			if (privKeyStr) {
				setupKeyPair(BigInt('0x' + privKeyStr))
			}
		}, []
	)

	useEffect(
		() => {
			// TODO set correct key
			const key = '1'; // keyPair.privateKey;
			setBalance(decryptBalance(balanceEnc, key))
		}, [balanceEnc, keyPair]
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
		}, []
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
		}, []
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
	const setupKeyPair = (privateKey: bigint) => {
		const [pubX_, pubY_] = curveWasm.grumpkin_point(privateKey.toString()).split('|');

		console.log("Priv key:", privateKey);
		console.log("Pt:", '\n' + pubX_ + '\n' + pubY_);

		const pubX = BigInt(pubX_);
		const pubY = BigInt(pubY_);

		console.log("Public key from priv key: " + pubX + ', ' + pubY);
		setKeyPair({ privateKey, pubX, pubY });
		setShowCreateKeyModal(false);

		// In a real app, you would store this securely
		// For demo purposes, we'll use localStorage
		localStorage.setItem('privacyKeyPair', privateKey.toString(16));
	};


	// Value object with all states and functions to be provided
	const value = {
		starknet,
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
		setupKeyPair,
		balanceEnc,
	};

	return (
		<CoreContext.Provider value={value}>
			{children}
		</CoreContext.Provider>
	);
};
