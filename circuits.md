# Confidential Transaction Circuit

## Overview

The Noir circuit implements a confidential transaction system that allows users to transfer assets while keeping their balances private. The system uses public key cryptography and homomorphic encryption to ensure that:

1. User balances are never revealed in plaintext
2. Transactions can be verified without exposing the actual amounts
3. Only the account owner can decrypt and view their own balance

## Core Components

### Data Structures

#### `Sender`
A structure containing the private information of the transaction sender:
```noir
struct Sender {
    priv_key: Field,  // Sender's private key
    bal: u32,         // Sender's current balance
    amt: u32,         // Amount to transfer
    rnd: Field,       // Random value used for encryption
}
```

#### `UserPubParams`
A structure containing the public parameters of a user:
```noir
struct UserPubParams {
    pub_key: (Field, Field),  // User's public key as x,y coordinates
    bal_ct: (Field, Field),   // User's encrypted balance as ciphertext x,y coordinates
}
```

### Core Functions

#### `main(sender: Sender, sender_pub: UserPubParams, receiver: UserPubParams) -> ((Field, Field), (Field, Field))`

The main circuit function that processes a confidential transaction:

1. Takes the sender's private information and both users' public parameters
2. Verifies that the sender has sufficient balance
3. Computes the new encrypted balances for both parties
4. Returns the updated encrypted balances as coordinate pairs

#### Cryptographic Helper Functions

- `public_key(priv_key: Field) -> Point`: Derives a public key from a private key
- `encrypt(pub_key: Point, value: Field, randomness: Field) -> Ciphertext`: Encrypts a value using a public key
- `decrypt(ciphertext: Ciphertext, priv_key: Field) -> Point`: Decrypts a ciphertext using a private key
- `field_to_point(value: Field) -> Point`: Converts a field element to a curve point
- `pt_to_xy(point: Point) -> (Field, Field)`: Converts a curve point to x,y coordinates
- `ct_to_ctxy(ciphertext: Ciphertext) -> (Field, Field)`: Converts a ciphertext to x,y coordinates
- `ctxy_to_ct(coordinates: (Field, Field)) -> Ciphertext`: Converts x,y coordinates back to a ciphertext

## Transaction Flow

1. The sender provides their private key, current balance, transfer amount, and a random value
2. The sender's public key is derived from their private key
3. The sender's balance is encrypted using their public key and the random value
4. The circuit verifies that the encrypted balance matches the expected value
5. The circuit computes the new encrypted balances by:
   - Subtracting the transfer amount from the sender's balance
   - Adding the transfer amount to the receiver's balance
6. The updated encrypted balances are returned

## Security Features

- **Balance Privacy**: All balances are stored and processed in encrypted form
- **Zero-Knowledge Proofs**: The circuit generates a proof that the transaction is valid without revealing the actual amounts
- **Public Verifiability**: Anyone can verify that the transaction was processed correctly without learning the balances

## Usage

To use this circuit:

1. Generate a key pair for each user
2. Initialize each user's encrypted balance
3. To make a transfer:
   - The sender creates a `Sender` object with their private information
   - Both users' public parameters are collected into `UserPubParams` objects
   - The `main` function is called to process the transaction
   - The returned encrypted balances replace the previous values

## Example

```noir
let sender = Sender {
    priv_key: 0x04d73359c9166e49aafaf9a4852eaa4dceb2c26878196b10e9048004ff5cc20c,
    bal: 0xffff,
    amt: 0x1234,
    rnd: 0x030cffca80ca4344e54e436fc5a03ae8e884b8f3edcb780702599e1951e8aa62,
};

// Derive sender's public parameters
let s_pk = public_key(sender.priv_key);
let sender_bal_ct = encrypt(s_pk, sender.bal as Field, sender.rnd);
let sender_pub = UserPubParams { 
    pub_key: pt_to_xy(s_pk), 
    bal_ct: ct_to_ctxy(sender_bal_ct) 
};

// Receiver's public parameters
let receiver_priv_key = 0x208196b10e9048004ff5cc204d73359c9166e49aafaf9a4852eaa4dceb2c2687;
let receiver_balance: u32 = 0x1000;
let r_pk = public_key(receiver_priv_key);
let r_bal_ct = ct_to_ctxy(encrypt(r_pk, receiver_balance as Field, sender.rnd));
let receiver_pub = UserPubParams { 
    pub_key: pt_to_xy(r_pk), 
    bal_ct: r_bal_ct 
};

// Execute the transaction
let (updated_sender_bal, updated_receiver_bal) = main(sender, sender_pub, receiver_pub);
```

## Implementation Notes

1. The circuit uses homomorphic properties of the encryption scheme to manipulate encrypted values
2. The same random value is used for both encryptions in a transaction for consistency
3. The circuit includes balance verification to prevent underflows or invalid transfers

## Contract deployments

#### Class hash
0x04ffeed293927cd56686a9038a10026a2d3b9602f789d1f163c1c4ac9a822a82

#### Contract address
0x04d51d536c6542c2e2e67bc43cd78d3287231834bd88216efb2ca67e9f67d2f3