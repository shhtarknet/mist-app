export const VerifierABI = [
	{
		"name": "IUltraKeccakHonkVerifier",
		"type": "impl",
		"interface_name": "confidential_erc20_transfer::honk_verifier::IUltraKeccakHonkVerifier"
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
		"name": "confidential_erc20_transfer::honk_verifier::IUltraKeccakHonkVerifier",
		"type": "interface",
		"items": [
			{
				"name": "verify_ultra_keccak_honk_proof",
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
		"name": "confidential_erc20_transfer::honk_verifier::UltraKeccakHonkVerifier::Event",
		"type": "event",
		"variants": []
	}
] as const;