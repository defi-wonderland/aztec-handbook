// TO-DO: Add details on implementation

# Nullifiers

A nullifier is a unique *cryptographic fingerprint* derived from a spent note. It acts as a non-linkable yet verifiable proof of spend, allowing the protocol to prevent double-spending while maintaining privacy.

Each nullifier is deterministically derived from a note and the secret key of the spender, but in such a way that:

- It cannot be reverse-engineered to reveal the note or spender.
- It does not link to the new notes being created in the same transaction.
- It ensures that each note can be spent only once.

Nullifiers are inserted into a **nullifier tree**. A transaction is valid only if the nullifiers it generates are not already present in the tree.

Some properties are that they are:
- One-to-one: Each note has exactly one nullifier
- Non-malleable: Cannot be modified without invalidating the proof
- Unlinkable: Does not reveal which note or who spent it
- Deterministic and unique: Prevents reuse of a note

It will be computed as `nullifier = H(note_secret_data || secret_key || constant)`, where `note_secret_data` includes value, randomness, and asset type, the `secret_key` is associated with the note's owner, `H` is collision-resistant hash function and the `constant` is circuit-specific and ensures domain separation. 

So, let's say that Alice owns a note where:
- `value = 10`
- `owner_pub_key = H(secret_key)`
- `randomness = r1`

When spending the note, she computes: `nullifier = hash(H(10, r1, asset_id), secret_key, CONST)`. This nullifier is then inserted into the tree and any future attempt to spend the same note will result in a duplicate nullifier and cause the transaction to be rejected. 

## Nullifier Tree
As we briefly commented in the previous section, a **Nullifier Tree** is a **Merkle tree** used to track all spent notes. Each entry in the tree is a **nullifier**, which uniquely and privately marks a note as having been consumed. By maintaining this structure, it enforces the single-spend rule without revealing which note was spent or by whom.

It plays a central role in:

- Preventing double-spending
- Verifying transaction correctness
- Ensuring that the same note cannot be consumed more than once

The key properties of it are that:

- Append-only: Nullifiers are only ever added.
- Public visibility: Nullifiers are revealed and stored on-chain.
- Efficient verification: Tree structure allows $O(\log n)$ inclusion checks.
- Privacy-preserving: Nullifiers do not reveal the underlying note or its owner.

To be more specific, the nullifier tree is a **sparse** Merkle tree:

- Each leaf corresponds to a nullifier
- Nodes are stored in a hash-based format to support efficient lookups and updates
- A nullifier's index in the tree is derived from its hash (or commitment field)

The flow would be:

1. During Spending:
    - A note is consumed in a private function
    - A nullifier is computed and emitted
    - This nullifier is appended to the nullifier tree
2. During Verification:
    - Before a transaction is accepted, its nullifiers are checked
    - The system proves that each nullifier is not already in the tree
    - This ensures that the associated note hasn’t been spent before
3. During Synchronization:
    - Clients and provers track the latest nullifier tree root
    - The Merkle path to a nullifier allows efficient proof of (non-)existence
