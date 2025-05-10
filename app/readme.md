# MIST - Money In STealth

A privacy-preserving application for confidential token transfers using zero-knowledge proofs and homomorphic encryption. Built with Vite, React, and Noir circuits.

## Overview

MIST enables private token transfers using:
- ElGamal cryptosystem over elliptic curve groups
- Fast 0.5-second 32-bit Baby Giant algorithm for Grumpkin
- Zero-knowledge proofs for transaction validity
- Homomorphic encryption for balance privacy

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **ZK Circuits**: Noir
- **Styling**: Tailwind CSS
- **Blockchain**: StarkNet
- **State Management**: Custom hooks

## Prerequisites

- Node.js (v18+)
- pnpm

## Installation

```bash
# Clone the repository
git clone [repository-url]
cd mist-app

# Install dependencies
pnpm install
```

## Development

```bash
# Start the development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Compile Noir circuits
pnpm circuits
```

## Deployment

```bash
# Deploy to GitHub Pages
pnpm deploy
```

## Linting

```bash
# Run ESLint
pnpm lint
```

## Project Structure

```
src/
├── circuits/          # Noir zero-knowledge circuits
├── components/        # React UI components
│   ├── onboard/      # Onboarding components
│   └── ...           # Transfer, balance, and modal components
├── lib/              # Core utilities and hooks
│   ├── abi.ts        # Contract ABI definitions
│   ├── types.ts      # TypeScript type definitions
│   ├── useCore.tsx   # Core application logic
│   └── utils.ts      # Helper functions
└── App.tsx           # Main application component
```

## Features

- **Private Transfers**: Send tokens without revealing amounts
- **Encrypted Balances**: View your balance privately
- **Zero-Knowledge Proofs**: Prove transaction validity without exposing data
- **StarkNet Integration**: Deploy and interact with StarkNet contracts
- **Interactive Playground**: Test Noir circuits directly in the browser

## License

[License Type] - see LICENSE file for details