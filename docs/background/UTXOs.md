# UTXOs

A UTXO (Unspent Transaction Output) is a cryptographically private record representing a commitment to a value (e.g. a token amount or a state) that has not yet been spent. Inspired by Bitcoin's model, Aztec uses UTXOs to represent discrete state fragments that are consumed and replaced by new UTXOs in a transaction.

Each UTXO contains:

- An encrypted payload (e.g. value, owner's public key, asset ID)
- A commitment, which is a cryptographic hash that binds the **note** data and associated randomness.

:::note concept
For a detailed explanation of notes and their implementation, see the [Notes](./notes.md) section.
:::
- A position in a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) known as the note tree.
- A reference to an owner who can later spend the UTXO via a Zero Knowledge Proof (Optional)

Unlike Bitcoin, this UTXOs are **private**, and represent arbitrary data rather than just currency.

We can think of a UTXO as an object with the following fields:

- `value`: The amount or data represented
- `owner_pub_key`: Public key of the UTXO owner
- `asset_id`: Identifier of the token or state type
- `nonce` or `randomness`: To prevent note collisions
- `commitment`: `Hash(note data || nonce)`

When a user spends a UTXO:
1. They demonstrate possession of the object by using a secret key.
2. They prove the note exists in the note tree.
3. They generate a **nullifier** to prevent double-spending. **Nothing** in the proof or the nullifier is observable from the outside to be linked to the 1st UTXO "storage variable".
:::note Concept
We will define nullifier in the following sections.
:::
4. They create new UTXOs for the recipients.

So, let's say that Alice has a private note presenting **10 AZT** tokens. This commitment is inserted into the **note tree**. When Alice wants to spend this note, she will:
- Prove that she knows the preimage

:::info
**Reminder of the definition of Preimage:**

Let $$f: A \rightarrow B$$ be a map between sets $A$ and $B$. Let $Y \subseteq B$. Then the preimage of $Y$ under $f$ is denoted by $f^{-1}(Y)$, and is the set of all elements of $A$ that map to elements in $Y$ under $f$. Thus $f^{-1}(Y) = \{a \in A \mid f(a) \in Y\}$.

In other words, the preimage of a set $Y \subseteq B$ is made up of all the elements in the domain $A$ that, when plugged into the function $f$, give you something inside $Y$. You're essentially tracing the function backwards from the set $Y$ in the codomain, and collecting all the inputs from $A$ that map to it.
:::

- Generate a nullifier for this note
- Create a new note (UTXO) for Bob

:::note UTXO Lifecycle
A UTXO goes through several states during its lifecycle:
1. **Creation**: When a new UTXO is created, its commitment is inserted into the note tree
2. **Active**: The UTXO exists in the note tree and can be spent
3. **Spent**: When spent, a nullifier is generated and the UTXO is effectively destroyed
4. **Replacement**: New UTXOs are created to replace the spent ones, maintaining the total value
:::

