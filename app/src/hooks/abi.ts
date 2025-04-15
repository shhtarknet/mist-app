import { Abi } from "starknet";

export const VerifierABI = [
	{
		"name": "IUltraKeccakZKHonkVerifier",
		"type": "impl",
		"interface_name": "confidential_transfer::honk_verifier::IUltraKeccakZKHonkVerifier"
	},
	{
		"name": "core::array::Span::<core::felt252>",
		"type": "struct",
		"members": [
			{
				"name": "snapshot",
				"type": "@core::array::Array::<core::felt252>"
			}
		]
	},
	{
		"name": "core::integer::u256",
		"type": "struct",
		"members": [
			{
				"name": "low",
				"type": "core::integer::u128"
			},
			{
				"name": "high",
				"type": "core::integer::u128"
			}
		]
	},
	{
		"name": "core::array::Span::<core::integer::u256>",
		"type": "struct",
		"members": [
			{
				"name": "snapshot",
				"type": "@core::array::Array::<core::integer::u256>"
			}
		]
	},
	{
		"name": "core::option::Option::<core::array::Span::<core::integer::u256>>",
		"type": "enum",
		"variants": [
			{
				"name": "Some",
				"type": "core::array::Span::<core::integer::u256>"
			},
			{
				"name": "None",
				"type": "()"
			}
		]
	},
	{
		"name": "confidential_transfer::honk_verifier::IUltraKeccakZKHonkVerifier",
		"type": "interface",
		"items": [
			{
				"name": "verify_ultra_keccak_zk_honk_proof",
				"type": "function",
				"inputs": [
					{
						"name": "full_proof_with_hints",
						"type": "core::array::Span::<core::felt252>"
					}
				],
				"outputs": [
					{
						"type": "core::option::Option::<core::array::Span::<core::integer::u256>>"
					}
				],
				"state_mutability": "view"
			}
		]
	},
	{
		"kind": "enum",
		"name": "confidential_transfer::honk_verifier::UltraKeccakZKHonkVerifier::Event",
		"type": "event",
		"variants": []
	}
] as const satisfies Abi;


export const CoreABI = [
	{
		"name": "ConfidentialBalancesImpl",
		"type": "impl",
		"interface_name": "confidential_erc20::IConfidentialBalances"
	},
	{
		"name": "core::integer::u256",
		"type": "struct",
		"members": [
			{
				"name": "low",
				"type": "core::integer::u128"
			},
			{
				"name": "high",
				"type": "core::integer::u128"
			}
		]
	},
	{
		"name": "confidential_erc20::Point",
		"type": "struct",
		"members": [
			{
				"name": "x",
				"type": "core::integer::u256"
			},
			{
				"name": "y",
				"type": "core::integer::u256"
			}
		]
	},
	{
		"name": "confidential_erc20::BalCypherText",
		"type": "struct",
		"members": [
			{
				"name": "c1",
				"type": "confidential_erc20::Point"
			},
			{
				"name": "c2",
				"type": "confidential_erc20::Point"
			}
		]
	},
	{
		"name": "core::array::Span::<core::felt252>",
		"type": "struct",
		"members": [
			{
				"name": "snapshot",
				"type": "@core::array::Array::<core::felt252>"
			}
		]
	},
	{
		"name": "confidential_erc20::IConfidentialBalances",
		"type": "interface",
		"items": [
			{
				"name": "get_pub_key",
				"type": "function",
				"inputs": [
					{
						"name": "account",
						"type": "core::starknet::contract_address::ContractAddress"
					}
				],
				"outputs": [
					{
						"type": "confidential_erc20::Point"
					}
				],
				"state_mutability": "view"
			},
			{
				"name": "set_pub_key",
				"type": "function",
				"inputs": [
					{
						"name": "pub_key",
						"type": "confidential_erc20::Point"
					}
				],
				"outputs": [],
				"state_mutability": "external"
			},
			{
				"name": "balance_of",
				"type": "function",
				"inputs": [
					{
						"name": "account",
						"type": "core::starknet::contract_address::ContractAddress"
					}
				],
				"outputs": [
					{
						"type": "confidential_erc20::BalCypherText"
					}
				],
				"state_mutability": "view"
			},
			{
				"name": "transfer",
				"type": "function",
				"inputs": [
					{
						"name": "recipient",
						"type": "core::starknet::contract_address::ContractAddress"
					},
					{
						"name": "amount",
						"type": "confidential_erc20::BalCypherText"
					},
					{
						"name": "proof",
						"type": "core::array::Span::<core::felt252>"
					}
				],
				"outputs": [],
				"state_mutability": "external"
			}
		]
	},
	{
		"name": "confidential_erc20::VerifierDispatcher",
		"type": "struct",
		"members": [
			{
				"name": "contract_address",
				"type": "core::starknet::contract_address::ContractAddress"
			}
		]
	},
	{
		"name": "constructor",
		"type": "constructor",
		"inputs": [
			{
				"name": "verifier",
				"type": "confidential_erc20::VerifierDispatcher"
			},
			{
				"name": "mint",
				"type": "core::starknet::contract_address::ContractAddress"
			}
		]
	},
	{
		"kind": "enum",
		"name": "confidential_erc20::ConfidentialBalances::Event",
		"type": "event",
		"variants": []
	}
] as const satisfies Abi;