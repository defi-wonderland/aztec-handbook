# Settlement

This article covers the technical implementation of settlement and cross-layer messaging in the Aztec network. It describes how Aztec leverages a zkRollup architecture to compress private and public execution traces, how messages are passed between L1 and L2 using message boxes, and how key contracts like the `Rollup`, `Inbox`, and `Outbox` facilitate state synchronization, data availability, and communication integrity.

## Rollup-Based Settlement

Aztec is a zkRollup. All state transitions — public and private — are ultimately proven and settled on L1 via the `Rollup` contract. This contract is responsible for:

* Storing and updating the canonical L2 state root.
* Verifying zk-proofs for rollup blocks.
* Emitting events to expose data for indexing/syncing.
* Managing validator set commitments and slashing via `Staking`, `Emperor`, `GSE`.

Proofs submitted to the rollup are validated via a verifier contract (`IVerifier`) and must prove a correct state transition from state `S` to `S'`, via application of a rollup block `B`, such that:

```
T(S, B) => S'
```

Rollup proofs include:

* A `header` encoding block metadata.
* Membership witnesses for message insertions (Inbox) and nullifications (Outbox).
* Updated Merkle roots for the public data tree, archive, inbox, outbox.

The `Rollup` contract references the `Inbox`, `Outbox`, and `FeeJuicePortal` contracts and uses them to synchronize messages, fees, and side-channel data.

## L1 to L2 Messaging: Inbox

The `Inbox` contract lives on L1 and accepts messages destined for L2. It maintains a rolling forest of append-only trees (using the `FrontierTree` pattern) to structure incoming messages.

### Core Concepts

* **Inbox State**: Maintains `rollingHash`, `totalMessagesInserted`, and `inProgress` block number.
* **Tree Insertion**: Messages are inserted into Merkle trees per L2 block (`trees[blockNumber]`).
* **Indexing**: Global leaf index = `(block - genesisBlock) * size + local index`.

### Interfaces

```solidity
function sendL2Message(
  L2Actor _recipient,
  bytes32 _content,
  bytes32 _secretHash
) external returns (bytes32, uint256);
```

* `_content` is 32 bytes, directly stored or a hash commitment.
* `_secretHash` enables nullifier privacy for future consumption.

Each message is represented by:

```solidity
struct L1ToL2Msg {
  L1Actor sender;
  L2Actor recipient;
  bytes32 content;
  bytes32 secretHash;
  uint256 index;
}
```

These are SHA256-hashed to a field element and inserted into the inbox tree.

### Consumption

Inbox trees are consumed by the `Rollup` contract via:

```solidity
function consume(uint256 blockNumber) external returns (bytes32);
```

This returns the root of the message tree for block `blockNumber`, making it available to the rollup circuit.

## L2 to L1 Messaging: Outbox

The `Outbox` is the L1-side mirror of the Inbox, designed to hold L2-emitted messages for L1 contracts to consume.

### Message Lifecycle

1. L2 emits an `L2ToL1Msg`, inserted into a Merkle tree.
2. The `Rollup` contract posts the tree root to the `Outbox`:

```solidity
function insert(uint256 l2BlockNumber, bytes32 root) external;
```

3. L1 contracts use inclusion proofs to consume these messages:

```solidity
function consume(L2ToL1Msg msg, uint256 index, bytes32[] path) external;
```

The `Outbox` internally tracks a bitmap `nullified` per message root to ensure one-time consumption.

## Bidirectional Messaging via Message Boxes

To generalize L1–L2 and public–private communication, Aztec uses the **Message Box** abstraction. Each box has:

* **Pending Set** (insertion domain)
* **Ready Set** (consumption domain)

When a message is inserted on one side (e.g., L1 Inbox), it is not directly usable on the receiving side (L2) until a rollup transitions it to the `ready` set.

This happens inside the rollup circuits during block execution:

* `Inbox` root is read and compared to expected state.
* Messages are inserted into the Merkle tree.
* Their `content`, `sender`, and `recipient` are verified against constraints.
* Their hash becomes a **nullifier**, consumed on L2.

## Kernel and Rollup Circuits

The kernel circuit validates individual Aztec transactions, including:

* L2-to-L1 messages to insert into the outbox.
* L1-to-L2 message nullifiers to consume from the inbox.

The rollup circuit verifies a batch of transactions, along with:

* Consumed inbox trees (using roots and witness paths).
* Produced outbox roots.
* Public data tree updates and archive diffs.

Each circuit validates that all cross-domain messaging is consistent with:

* Membership constraints.
* Validity of sender/recipient pair in contract tree.
* One-time nullifiability.

## Privacy, Asynchrony, and Message Design

Because messages can’t synchronously resolve on-chain without breaking privacy, all L1↔L2 messages are **asynchronous** and **unilateral**:

* L1 doesn’t get immediate confirmation from L2.
* L2 doesn’t know the outcome of L1 calls it triggers.

To preserve privacy when consuming a message, the nullifier includes a `secretHash`, ensuring that only the intended recipient with knowledge of the preimage can consume the message.

Messages include only 32 bytes of `content`, but arbitrary payloads can be supported by passing `sha256(payload)` and emitting or storing full content off-chain.

## References
- [Portals Documentation](https://docs.aztec.network/aztec/concepts/communication/portals)
- [Message Bridge Contract](https://github.com/AztecProtocol/aztec-packages/tree/next/l1-contracts/src/core/messagebridge)
- [Rollup Core Contract](https://github.com/AztecProtocol/aztec-packages/blob/next/l1-contracts/src/core/RollupCore.sol)
- [Rollup Contract](https://github.com/AztecProtocol/aztec-packages/blob/next/l1-contracts/src/core/Rollup.sol)