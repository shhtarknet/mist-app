# MIST: Money In STealth

Confidential token transfers using zero-knowledge proofs and homomorphic encryption.

## Overview

### [shhtarknet.github.io/mist - Try the demo!](https://shhtarknet.github.io/mist)

[![Check it out](media/check-it-out.gif)](https://shhtarknet.github.io/mist)

MIST enables private token transfers where transaction amounts and account balances remain encrypted. The system uses ElGamal homomorphic encryption over elliptic curves combined with zero-knowledge proofs to maintain privacy while ensuring transaction validity.

## NoirHack 2025

### [Details on work done during the hackathon](noirhack.md)
[![Details on work done during the hackathon](media/what-did-u-do.gif)](noirhack.md)

## Tech stack
* Circuits: Noir
* Contracts: Cairo
* Verification: Garaga
* Proving: Barretenberg
* Homomorphic scheme: ElGamal over Elliptic Curves
* Proving system: Ultra Keccak Honk (ZK flavor)
* Frontend: React + Tailwind
* Tools: Vite, gh-pages, scarb

## Documentation

- [Application Documentation](app/readme.md)
- [Circuits Documentation](circuits.md)
- [Contracts Documentation](contracts.md)  
- [Cryptography Documentation](cryptography.md)

### Application
[Detailed app readme](app/readme.md)
React-based frontend built with Noir, bb.js, and Garaga. Provides the user interface for managing encrypted balances and initiating private transfers. Build, integration and deployment handled by Vite and gh-pages.

### Circuits
[Detailed Circuits readme](circuits.md)
Noir circuits implementing the confidential transaction system. Allows users to transfer assets while keeping balances private through:
- Public key cryptography for user identification
- Homomorphic encryption to hide balance amounts
- Zero-knowledge proofs for transaction validity
- Decryption capabilities restricted to account owners

### Contracts
[Detailed Contracts readme](contracts.md)  
StarkNet contracts for MIST written in Cairo. Handles on-chain state management, proof verification, and encrypted balance updates.

### Cryptography
[Detailed Cryptography readme](cryptography.md)
ElGamal cryptosystem on elliptic curves for additive homomorphism. Covers the mathematical foundations of ElGamal, its adaptation to elliptic curve groups, and implementation in Noir.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/shhtarknet/mist-app
cd mist-app

# Install dependencies
cd app && pnpm install

# Start development server
pnpm dev
```

See the [Application README](app/readme.md) for detailed setup instructions.
