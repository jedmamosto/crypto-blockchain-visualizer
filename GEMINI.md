# GEMINI.md

## Project Summary

The **Blockchain Visualizer** is an educational tool designed to demonstrate the core concepts of a blockchain, including blocks, hashing, Proof of Work (PoW), and chain integrity. It provides a visual representation of how blocks are linked through hashes and how tampering with data invalidates the entire chain. Users can mine new blocks with adjustable difficulty levels to see PoW in action.

## Status

The visualizer is fully functional with logic, UI, and educational tampering demonstrations. It features a modern dark theme and is mobile-responsive.

- **Mobile-First Redesign**: Implemented a horizontal scroll snap layout for mobile, ensuring the blockchain metaphor remains consistent and usable on small screens.
- **Web Worker Mining**: Moved Proof of Work calculations to a background thread to prevent UI freezing, especially at level 4 difficulty.
- **Educational Tooltips**: Added hoverable explanations for "Hash", "Previous Hash", "Nonce", and "Chain Integrity" to make the lab more self-explanatory.
- **Auto-Fix Chain**: Implemented a "Fix Entire Chain" feature that cascades re-mining through all invalid blocks, demonstrating the reversal of the Avalanche Effect.

## Recommended Next Steps

- **Web Crypto API**: Transition from `crypto-js` to the native browser `SubtleCrypto` for even faster hashing.
- **Peer-to-Peer Demo**: Simulate multiple nodes to show how 51% attacks or consensus work when two chains conflict.
- **Transaction Signing**: Introduce Public/Private key pairs and digital signatures for individual data entries.
