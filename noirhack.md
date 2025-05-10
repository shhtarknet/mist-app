# MIST: Hackathon Development Summary

## Overview of work

Prior to the hackathon we had,
1. Curve-agnostic homomorphic encryption library for Noir v1.
2. Fast baby giant impl in Rust (WASM included)
3. Some AI generated UI components for ideas and 
4. Noir Playground component to test Noir proving and verification in browser.
5. Some circuits and tests
6. Non-working Garaga integration (missing zk variant)

During the hackathon,
1. Built the whole MIST UI. UX UX UX UX UX UX (Intentional repetition)
2. Integrated the proof with on chain storage
3. Finalised the circuits
4. Added ZK variants to BB WASM
5. Working frontend proving with custm bb, Garaga and proof submission
6. Key generation and on boarding UX.
7. **User test** with Starknet group and more UX improvements.

## Open Source Status

While we've made the frontend application and general architecture publicly available, certain core components remain private at this time. Our advisors have recommended keeping specific cryptographic implementations and business logic closed source as we explore commercialization opportunities. We plan to open source additional components in the future as the project matures.

## Details on work done

### 1. Smart Contract Development
- Implemented the core MIST contract in Cairo with encrypted balance management
- Added proof verification using Garaga for efficient on-chain ZK proof verification
- Created mint functionality for test tokens
- Built comprehensive test suite for all contract functions

### 2. Zero-Knowledge Circuits
- Developed Noir circuits for confidential transfers
- Integrated Garaga v0.17 for optimized proof generation
- Created custom proof/verify commands for development workflow

### 3. Frontend Application
- Built a complete React application with TypeScript
- Implemented key pair management system for encryption/decryption
- Created user onboarding flow with wallet connection
- Added balance decryption using Baby Giant algorithm
- Integrated proof generation directly in the browser

### 4. Cryptographic Implementation
- Implemented ElGamal encryption over elliptic curves
- Added 256-bit key generation
- Integrated Baby Giant discrete logarithm solver
- Created custom bb.js integration for proof generation

### 5. User Experience
- Designed intuitive UI for complex cryptographic operations
- Added loading states and error handling
- Implemented smooth onboarding process
- Created modals for key management and transfers

## Technical Highlights

- **End-to-end privacy**: Balances remain encrypted on-chain
- **Browser-based proving**: Users generate ZK proofs client-side
- **Efficient verification**: Garaga integration for gas-efficient on-chain verification
- **User-friendly**: Complex cryptography abstracted behind simple UI

## Full Commit History

```
chore(contract): bal struct rename
feat(contracts): initial mint
chore: private  balances contract deployment
chore: remove tabs for sections
chore: add core contract abi
chore: add contracts to frontend
chore: refactor hooks to lib
chore: cipher text types
feat(ui): app redesign
chore(ui): typescript types
feat(ui): core provider
chore(ui): noir proof types
chore(ui): core context fail first
chore(ui): organise components into files
chore(app): decryption placeholder
feat(app): create keypair modal
feat(app): keypair intro
feat(app): key pair management provider
fix(app): dummy decryption
chore: create key model
chore: types balance enc and get key pair
chore: don't expose set key pair
chore: balance component with keys
chore: keys for header
chore: key management
chore: 256 bit key gen
feat: pub key from priv
chore: refactor key type
feat: store private key and setup public key
feat: add decryption
feat: decryption add bsgs
chore: simplify encrypted balance preview
chore: minor copy and rebrand
chore: adding new starknet
chore: flexible header
chore: add starknet model
fix: cleanup model weird bg
chore: connect starknet util function
chore: onboarding state vars
feat: onboarding components
feat: onboarding modal
feat: connect starknet modal
feat: onbaording functionality
feat: loading screen
feat: key prompts
chore: balanace ui revamp
chore(app): add starknet wallet a/c
chore(app): noir typed proof gen
chre(app): minor code keeping
chore(app): noir playground cleanup
chore(app): fetch user pub data
feat(app): transfer proof witness
chore(app): cleanup logs
feat(ui): transfer component makes proof
feat(app): generate garaga calldata
chore(app): minor fixes
chore(app): expose typed noir proof
chore:(app): add starknet core contract
chore(contracts): scarb v2.11
chore(contracts): separate types
chore(contracts): proof mod for utils
chore(contracts): getter/setter tweaks
chore(contracts): minor refactor
chore(contracts): garaga ops
chore(contracts): update pub key manage balance
chore(contracts): init tests
tests(contracts): entrypoints and fixes
test(contracts): existing bal key update
fix(contract): mint default pub key
chore(contracts): user public params
feat(contracts): proof integration
chore(contracts): cleanup tests
feat(contracts): mint entry point
chore(app): update abi
chore(app): cleanup and update core contract
chore(app): generic ec types
chore(app): converters for contract values
feat(app): user pub params from contract
chore(app): modal component
chore(app): cleanup modals and use onboarding
chore(app): key pair management utils
chore(app): cleanup modals and notifications
feat(app): onboarding keys management ui
chore(app): keys and cyclic dependencies fix
test(contracts): key update empty balance
fix(contracts): key update re-encryption empty balance
fix(app): balance decryption
feat(app): added loading overlay
chore(app): user flow fixes
fix(app): stuck state priv key mismatch
feat(app): mint test funds
chore(app): proof params setup
fix(contracts): proof verifier entrypoint
chore(app): updating contract and wasm packages
chore(circuits): circuits with garaga v0.17
chore(app): add custom bb.js
chore(app): prover updates
feat(app): gh deployment
chore(app): new proof generation
fix(app): balance defaults
chore(app): deployment repo
chore(app): onboard improvement
chore(app): show account address with private key
fix(app): funds request reload balance
ux(app): button colors
chore(app): smoothen transfer ux
fix(app): terminate on failure
chore(circuits): all prove/verify commands
chore(app): minor improvements
chore(bb): add custom variant
chore(decryption): add baby giant wasm
chore(docs): added all the readmes
```