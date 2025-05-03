import { useState, createContext, useContext, useEffect, useCallback } from 'react';
import * as Garaga from "garaga";
import * as curveWasm from "baby-giant-wasm";
import { transferVK } from '../circuits/transfer';
import { CoreABI } from './abi';
import { Notification, CoreContextValue, WalletProviderProps, CipherText, KeyPair, UserPubData, TransferProofWitnessData } from './types';
import { CORE_ADDRESS, decryptBalance, emPt, GEN_PT, generateRnd } from './utils';
import { connect, StarknetWindowObject } from '@starknet-io/get-starknet';
import { constants, Contract, Provider, WalletAccount } from 'starknet';
import { getRawProof, useNoirProof } from './useNoirProof';

// Create Context
const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export const useCore = (): CoreContextValue => {
	const ctx = useContext(CoreContext)
	if (!ctx) {
		throw Error("Core context not defined");
	}

	return ctx
};

const StarknetProvider = new Provider({
	nodeUrl: constants.NetworkName.SN_MAIN,
});
const CoreContract = new Contract(CoreABI, CORE_ADDRESS, StarknetProvider).typedv2(CoreABI);

// Provider Component
export const CoreProvider = ({ children }: WalletProviderProps) => {

	const [isLoading, setLoading] = useState(true);
	const [isGeneratingProof, setGeneratingProof] = useState(false);
	const [starknet, setStarknet] = useState<StarknetWindowObject | null>(null);
	const [account, setAccount] = useState<WalletAccount | null>(null);
	const [balance, setBalance] = useState('');
	const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [keyPair, setKeyPair] = useState<KeyPair>({ privateKey: 0n, pubX: 0n, pubY: 0n, });
	const [balanceEnc, setBalanceEnc] = useState<CipherText>({
		c1: { x: '0', y: '0' },
		c2: { x: '0', y: '0', },
	});
	const [showEncrypted, setShowEncrypted] = useState(false);
	const [transferAmount, setTransferAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [showTransfer, setShowTransfer] = useState(false);
	const [notification, setNotification] = useState<Notification | null>(null);
	const { generateProof } = useNoirProof();

	const setupStarknet = useCallback(
		async (starknet: StarknetWindowObject) => {
			const myWalletAccount = await WalletAccount.connect(StarknetProvider, starknet);
			myWalletAccount.getChainId().then((chainId) => {
				console.log('Connected to Starknet chain:', chainId);
			});
			setAccount(myWalletAccount);
			CoreContract.get_pub_params(myWalletAccount.address).then((res) => {
				console.log(res);
				setBalanceEnc(res.bal_ct as unknown as CipherText);
				setKeyPair({ privateKey: 0n, pubX: res.pub_key.x as bigint, pubY: res.pub_key.x as bigint });
			});
		},
		[],
	);


	useEffect(
		() => {
			(async () => {
				Garaga.init();
				await connect({ modalMode: 'neverAsk' }).then((starknet) => {
					setStarknet(starknet);
					if (starknet) setupStarknet(starknet);
				});
				const privKeyStr = window.localStorage.getItem('privacyKeyPair');
				if (privKeyStr) {
					setupKeyPair(BigInt('0x' + privKeyStr))
				}
				setLoading(false);
			})();
		}, [setupStarknet]
	)

	useEffect(
		() => {
			// TODO set correct key
			const key = '1'; // keyPair.privateKey;
			setBalance(decryptBalance(balanceEnc, key))
		}, [balanceEnc, keyPair]
	)

	const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 4000);
	};

	const getUser_pub_key_bal = (recipient: string): UserPubData => {
		if (recipient == account?.address) {
			return {
				pub_key:
					// emPt(keyPair.pubX.toString(), keyPair.pubY.toString(),),
					GEN_PT,
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

	const handleTransfer = async () => {
		if (!account) return;
		if (!recipient) {
			showNotification('Recipient is required', 'error');
			return;
		}
		if (!transferAmount) {
			showNotification('Transfer amount is required', 'error');
			return;
		}
		if (balance < transferAmount) {
			showNotification(`Insufficient balance(${balance}), required ${transferAmount}.`, 'error');
			return;
		}
		setGeneratingProof(true)
		// showNotification('Transfer initiated successfully');
		const witness: TransferProofWitnessData = {
			_s: {
				// priv_key: keyPair.privateKey.toString(),
				priv_key: '1', // @TODO use correct key
				bal: `${Math.round(parseFloat(balance) * 100)}`,
				amt: transferAmount,
				rnd: BigInt('0x' + generateRnd()).toString(),
			},
			s: getUser_pub_key_bal(account?.address),
			r: getUser_pub_key_bal(recipient)
		};
		const proof = await generateProof(witness);
		const rawProof = await getRawProof(proof);
		const vk = Garaga.parseHonkVerifyingKeyFromBytes(transferVK);
		const honk_proof = Garaga.parseHonkProofFromBytes(rawProof);
		const calldata = Garaga.getHonkCallData(honk_proof, vk, 0);
		setGeneratingProof(false)

		console.log(proof.publicInputs);
		console.log('calldata length:', calldata.length);
		// setTransferAmount('');
		// setRecipient('');
		// setShowTransfer(false);
	};

	const requestTestFunds = () => {
		showNotification('Test funds requested successfully');
	};

	const truncateHash = (hash: string) => {
		if (!hash) return '';
		return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
	};

	// Create and save a new key pair
	const setupKeyPair = (privateKey: bigint): boolean => {
		const [pubX_, pubY_] = curveWasm.grumpkin_point(privateKey.toString()).split('|');

		if (keyPair.pubX.toString() !== pubX_ || keyPair.pubY.toString() !== pubY_) {
			showNotification('Private Key doesn\'t match your public key.', 'error');
			return false;
		}
		const pubX = BigInt(pubX_);
		const pubY = BigInt(pubY_);

		setKeyPair({ privateKey, pubX, pubY });
		setShowCreateKeyModal(false);

		// In a real app, you would store this securely
		// For demo purposes, we'll use localStorage
		localStorage.setItem('privacyKeyPair', privateKey.toString(16));

		return true;
	};

	const connectStarknet = async () => {
		if (starknet) {
			return true;
		}
		try {
			const swo = await connect({ modalMode: 'alwaysAsk', modalTheme: 'light' });
			if (swo) {
				setStarknet(swo);
				await setupStarknet(swo);
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
		isGeneratingProof,
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
		CoreContract,
	};

	return (
		<CoreContext.Provider value={value}>
			{children}
		</CoreContext.Provider>
	);
};
