import { useState, createContext, useContext, useEffect, useCallback } from 'react';
import * as Garaga from "garaga";
import * as curveWasm from "baby-giant-wasm";
import { transferVK } from '../circuits/transfer';
import { CoreABI } from './abi';
import { Notification, CoreContextValue, WalletProviderProps, CipherText, UserPubData, TransferProofWitnessData } from './types';
import { conv, CORE_ADDRESS, decryptBalance, generateRnd } from './utils';
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
	// nodeUrl: constants.NetworkName.SN_MAIN,
	nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/_y-36pr-k0TqKyUXuIml_tEcQMx_28N1',
});
let CoreContract = new Contract(CoreABI, CORE_ADDRESS, StarknetProvider).typedv2(CoreABI);

// Provider Component
export const CoreProvider = ({ children }: WalletProviderProps) => {

	const [isLoading, setLoading] = useState(true);
	const [isGeneratingProof, setGeneratingProof] = useState(false);
	const [starknet, setStarknet] = useState<StarknetWindowObject | null>(null);
	const [account, setAccount] = useState<WalletAccount | null>(null);
	const [balance, setBalance] = useState('');
	const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [pubKey, setPubKey] = useState(0n);
	const [pubKeyY, setPubKeyY] = useState(0n);
	const [privKey, setPrivKey] = useState(0n);
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

	// Create and save a new key pair
	const setupKeyPair = useCallback(async (privateKey: bigint, pubX: bigint): Promise<boolean> => {
		const [pubX_, pubY_] = curveWasm.grumpkin_point(privateKey.toString()).split('|');

		if (pubX == 0n) {
			pubX = BigInt(pubX_);
		}

		if (pubX == 1n) {
			await CoreContract.set_pub_key({
				x: pubX_,
				y: pubY_,
			});
		} else if (pubX.toString() !== pubX_) {
			showNotification("Private Key doesn't match your public key.", 'error');
			// console.log('Private Key:', privateKey);
			console.log('Public Key:', pubX_, pubY_);
			return false;
		}
		setPubKey(BigInt(pubX_));
		setPubKeyY(BigInt(pubY_));
		setPrivKey(privateKey);
		setShowCreateKeyModal(false);
		localStorage.setItem('privacyKeyPair', privateKey.toString(16));
		return true;
	}, []);

	const setupUserParams = useCallback(
		async (address: string) => {
			const userPubData = await getUser_pub_key_bal(address);
			console.log('User pub data:', userPubData);
			if (userPubData && userPubData.bal_ct) {
				setBalanceEnc(userPubData.bal_ct);
				setPubKey(BigInt(userPubData.pub_key.x));
				setPubKeyY(BigInt(userPubData.pub_key.y));
			}
		}, []);

	const setupStarknet = useCallback(
		async (starknet: StarknetWindowObject) => {
			const myWalletAccount = await WalletAccount.connect(StarknetProvider, starknet);
			setAccount(myWalletAccount);
			CoreContract = new Contract(CoreABI, CORE_ADDRESS, myWalletAccount).typedv2(CoreABI);
			setupUserParams(myWalletAccount.address)
		},
		[setupUserParams],
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
					await setupKeyPair(BigInt('0x' + privKeyStr), 0n)
				}
				setLoading(false);
			})();
		}, [setupKeyPair, setupStarknet]
	)

	useEffect(
		() => {
			if (privKey < 1n || balanceEnc.c1.x == '0') return;
			setBalance(decryptBalance(balanceEnc, privKey.toString()))
		}, [balanceEnc, privKey]
	)

	const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 4000);
	};

	const getUser_pub_key_bal = async (address: string): UserPubData => {
		const userPubData = await CoreContract.get_pub_params(address);
		return {
			pub_key: { x: String(userPubData.pub_key.x), y: String(userPubData.pub_key.y) },
			bal_ct: conv.ciphertext(userPubData.bal_ct),
		}
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
				// priv_key: privKey.toString(),
				priv_key: privKey.toString(), // @TODO use correct key
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
		pubKey,
		privKey,
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
