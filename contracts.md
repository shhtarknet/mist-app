# Confidential Token Transfer System on Starknet

This repository contains smart contracts for a privacy-preserving token transfer system deployed on Starknet. The system enables confidential transfers where token balances and transfer amounts remain encrypted on-chain.

## Overview

The system consists of two main contracts:

### 1. Core Contract (Confidential ERC20)
**Address:** `0x054f441d0e9ebbbb3ff0c963a62fffb5374f7cb12347ac51e6ed33d0685f9475`

The core contract implements confidential token functionality with encrypted balances. Key features include:

- **Encrypted Balances**: User balances are stored as encrypted values using ElGamal encryption
- **Public Key Management**: Users set their public keys for receiving encrypted transfers
- **Confidential Transfers**: Transfer amounts remain private while ensuring validity through zero-knowledge proofs
- **Minting**: New tokens can be minted to addresses (implementation details may vary)

### 2. Verifier Contract (Ultra Keccak ZK-HONK Verifier)
**Address:** `0x04d51d536c6542c2e2e67bc43cd78d3287231834bd88216efb2ca67e9f67d2f3`

This contract verifies zero-knowledge proofs to ensure transfer validity without revealing amounts. It uses the Ultra Keccak ZK-HONK proving system for efficient proof verification.

## Technical Architecture

### Encryption Scheme
The system uses ElGamal encryption on elliptic curves to encrypt balances:
- Balances are represented as `BalCypherText` containing two curve points (c1, c2)
- Each user has a public key (`Point`) for receiving encrypted transfers
- The encryption allows homomorphic addition of encrypted values

### Zero-Knowledge Proofs
- Transfers include ZK proofs to validate:
  - The sender has sufficient balance
  - The transfer amount is valid
  - Balance updates are computed correctly
- Proofs are verified using the Ultra Keccak ZK-HONK verifier

### Key Data Structures

```cairo
struct Point {
    x: u256,
    y: u256
}

struct BalCypherText {
    c1: Point,
    c2: Point
}

struct UserPubParams {
    pub_key: Point,
    bal_ct: BalCypherText
}
```

## Contract Interfaces

### Core Contract Functions

- `get_pub_key(account)` - Retrieve a user's public key
- `get_pub_params(account)` - Get user's public parameters (key + encrypted balance)
- `set_pub_key(pub_key)` - Set your public key for receiving transfers
- `balance_of(account)` - Get encrypted balance
- `mint()` - Mint new tokens
- `transfer(recipient, proof)` - Transfer tokens with ZK proof

### Verifier Contract Functions

- `verify_ultra_keccak_zk_honk_proof(full_proof_with_hints)` - Verify a transfer proof

## Usage Flow

1. **Setup**: Users call `set_pub_key()` to register their public key
2. **Check Balance**: Query encrypted balance with `balance_of()`
3. **Transfer**: 
   - Generate a ZK proof off-chain proving the transfer validity
   - Call `transfer()` with recipient and proof
   - The core contract calls the verifier to validate the proof
   - If valid, encrypted balances are updated

## Privacy Guarantees

- Token balances remain encrypted on-chain
- Transfer amounts are hidden in zero-knowledge proofs
- Only the account owner can decrypt their balance using their private key
- All transfers maintain cryptographic validity without revealing amounts

## Security Considerations

- Private keys must be securely managed off-chain
- Proof generation requires the sender's private key
- The verifier contract ensures mathematical correctness of all transfers
- The system relies on the security of the Ultra Keccak ZK-HONK proof system

## Development

This system demonstrates advanced cryptographic techniques for privacy-preserving smart contracts on Starknet, combining:
- ElGamal encryption for confidential state
- Zero-knowledge proofs for private computation verification
- Cairo smart contracts for StarkNet deployment

For integration or further development, ensure proper handling of cryptographic operations and secure key management practices.