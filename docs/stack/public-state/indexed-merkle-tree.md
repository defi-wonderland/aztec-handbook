# Indexed Merkle Tree

Indexed Merkle Trees (IMTs) are a data structure used to efficiently support non-membership proofs, insertion ordering, and sparse storage without the performance drawbacks of traditional Sparse Merkle Trees. This section describes how IMTs are used, particularly in the nullifier and public data trees.

## Why Not Sparse Merkle Trees?

Sparse Merkle Trees are appealing because proving non-membership is conceptually simple: prove that a given leaf index is empty. However, the cost is prohibitive:

* They require a fixed depth equal to the bit-length of values (254 for BN254).
* Each non-membership proof = one full tree traversal = 254 hashes.
* Insertions are random, so batch operations are inefficient.

Aztec improves this by using an IMT, which organizes values in an ordered linked list with adjustable tree depth.

## Leaf Structure and Pointer Semantics

Each leaf in the tree contains not only a value, but also a pointer to the next value in the ordered sequence:

```ts
leaf = {
  value: Fr,
  next_value: Fr,
  next_index: bigint
}
```

* `value`: the actual nullifier or slot key.
* `next_value`: the next higher value in sorted order.
* `next_index`: the index in the tree where `next_value` is stored.

This creates a tree over a sorted linked list.

## Non-Membership Proofs

To show that a value does **not** exist:

1. Find the **low leaf** (value `v`) such that `v < new_value < v.next_value`
2. Provide a membership proof for `v`
3. Assert range conditions:

```ts
assert new_value > v.value
assert new_value < v.next_value || v.next_value == 0n
```

This allows efficient non-membership proofs in a tree of depth \~32 instead of 254.

## Insertion Protocol

To insert a new value:

1. Locate the low leaf `L` where the new value fits
2. Prove membership of `L`
3. Update `L.next_value` and `L.next_index` to point to the new value
4. Create a new leaf with the appropriate pointers
5. Insert both updated `L` and the new leaf

As an example, let's say that you want to insert `v = 20` into tree with leaves: `10 → 30`, you would:

* Prove membership of `10`
* Assert `10 < 20 < 30`
* Update `10.next_value = 20`, `10.next_index = i`
* Insert new leaf `20 → 30`

## Batched Insertions

IMTs support efficient **subtree insertions**:

1. Verify that a full subtree region is empty (by proving the root is a known empty hash)
2. Insert a subtree of new leaves
3. Update all affected low-leaf pointers

Batching improves performance dramatically in circuits:

* 4 insertions in sparse tree = \~2032 hashes
* 4 insertions in indexed tree = \~327 hashes

## Circuit Considerations

In-circuit insertions require handling edge cases:

* If the low leaf is not yet inserted (i.e. part of the same batch), perform a **pending pointer resolution** within the local batch
* Maintain internal consistency of all low-high relationships and pointer updates

Pseudocode handles both standard and pending insertions by checking whether the membership witness is real or a placeholder.

## Tradeoffs and Benefits

One of the primary advantages is the dramatically reduced proving cost. Also, the tree operates with a small fixed depth (around 32) which simplifies its structure and management. This data structure naturally supports range-based non-membership proofs, allowing for efficient verification of the absence of elements within a specified range. 

However, there are also some drawbacks to consider. One of the main challenges is that nodes within the tree **must maintain a sorted view of existing elements**, which may add complexity to the management of the tree. Then, the structure requires pointer updates and additional tracking at the node layer, which increases the overhead associated with maintaining the tree.

## References

- [Documentation](https://github.com/AztecProtocol/aztec-packages/blob/next/docs/versioned_docs/version-Latest/aztec/concepts/advanced/storage/indexed_merkle_tree.mdx)
- [Implementation](https://github.com/AztecProtocol/aztec-packages/blob/next/yarn-project/foundation/src/trees/indexed_merkle_tree.ts)
