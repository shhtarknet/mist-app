import { useState, createContext, useContext, useEffect } from 'react';
import { Notification, CoreContextValue, WalletProviderProps, CipherText, KeyPair, UserPubData } from './types';
import { decryptBalance, emPt, GEN_PT, generateRnd } from './utils';
import * as curveWasm from "baby-giant-wasm";
import { connect, StarknetWindowObject } from '@starknet-io/get-starknet';
import { Provider, WalletAccount } from 'starknet';

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
	const [isLoading, setLoading] = useState(true);
	const [starknet, setStarknet] = useState<StarknetWindowObject | null>(null);
	const [account, setAccount] = useState<WalletAccount | null>(null);
	const [balance, setBalance] = useState('');
	const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState(false);
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
			(async () => {
				await connect({ modalMode: 'neverAsk' }).then((starknet) => {
					setStarknet(starknet);
				});
				const privKeyStr = window.localStorage.getItem('privacyKeyPair');
				if (privKeyStr) {
					setupKeyPair(BigInt('0x' + privKeyStr))
				}
				setLoading(false);
			})();
		}, []
	)

	useEffect(
		() => {
			(async () => {
				if (starknet) {
					const provider = new Provider({});
					const myWalletAccount = await WalletAccount.connect(
						provider, starknet
					);
					setAccount(myWalletAccount);
				}
			})();
		}, [starknet]
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

	const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	const getUser_pub_key_bal = (recipient: string): UserPubData => {
		if (recipient == account?.address) {
			return {
				pub_key:
					emPt(keyPair.pubX.toString(), keyPair.pubY.toString(),),
				bal_ct: [
					emPt(balanceEnc.c1.x, balanceEnc.c1.y,),
					emPt(balanceEnc.c2.x, balanceEnc.c2.y,),
				],
			};
		}
		// @TODO get correct values
		return {
			pub_key: GEN_PT,
			bal_ct: [
				emPt('0', '0',), // 0 point is point at infinity, indicates zero balance
				emPt('0', '0',), // 0 point is point at infinity, indicates zero balance
			]
		};
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

	const connectStarknet = async () => {
		if (starknet) {
			return true;
		}
		try {
			const swo = await connect({ modalMode: 'alwaysAsk', modalTheme: 'light' });
			if (swo) {
				setStarknet(swo);
				return true;
			}
		} catch (e) {
			console.error('Error occurred wile connecting to Starknet\n', e);
		}
		return false;
	};


	// Value object with all states and functions to be provided
	const value = {
		starknet,
		isLoading,
		balance,
		setBalance,
		account,
		showEncrypted,
		setShowEncrypted,
		showOnboarding,
		setShowOnboarding,
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
		connectStarknet,
	};

	return (
		<CoreContext.Provider value={value}>
			{children}
		</CoreContext.Provider>
	);
};
