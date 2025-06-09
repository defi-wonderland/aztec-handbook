# Notes
A **Note** is a cryptographically committed, privately owned data object representing a discrete unit of value or state. It serves as the internal representation of a **UTXO** and is the atomic unit of private state in the protocol.

## Core Properties
A note is:
- Committed to via a hash (`note_commitment`)
- Encrypted and stored on-chain in a Merkle tree (the note tree)
- Decrypted off-chain by the rightful owner using their **secret viewing key**
- Spent by proving knowledge of its preimage and secret key, resulting in a nullifier

Notes encapsulate both the value being transferred and the authorization logic for who can spend them.

## Implementation

[TO DO]

## Note Structure
:::warning
This is a simplified example to illustrate the concept. The actual implementation is more complex.
:::

```rust
struct Note {
    value: Field,
    owner_pub_key: AztecAddress,
    randomness: Field,
    contract_address: AztecAddress
}
```

The note commitment is computed as:
```
note_commitment = hash(value, asset_id, owner_pub_key, randomness)
```

## Note Lifecycle
1. **Creation**: A note is created when a circuit emits it as part of a transaction.
2. **Insertion**: The note commitment is inserted into the note tree.
3. **Discovery**: The owner scans the tree to decrypt notes encrypted to them.
4. **Spending**: The note is consumed in a circuit, and its nullifier is published.
5. **Invalidation**: Once spent, the note cannot be reused.

## Example
If Bob receives a private payment of 25 DAI:
1. A note representing 25 DAI is created and encrypted to Bob's public key
2. The note commitment is inserted into the note tree
3. Bob scans the blockchain for notes encrypted to his key
4. When he finds the note, he can decrypt it using his secret viewing key
5. To spend it, Bob proves knowledge of the commitment's preimage and his secret key