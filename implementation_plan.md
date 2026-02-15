# Implementation Plan: Validation Banner & Difficulty Selector

## Goal Description
Enhance the blockchain visualizer with a global validation banner for instant integrity feedback and a difficulty selector to control the Proof of Work requirements.

## User Flow
- **Validation Banner**:
  1. User mines a block or (later) tampers with one.
  2. A banner at the top smoothly transitions between Green ("Valid") and Red ("Invalid").

- **Difficulty Selector**:
  1. User clicks a difficulty button (1-4).
  2. The button highlights in blue.
  3. A helper text updates to explain the hash requirement (e.g., "Hash must start with 000").
  4. The next mined block requires the specified number of leading zeros.

## Proposed Changes

- **Validation Banner (app/page.tsx)**:
  - Add a full-width banner at the top.
  - Conditional styling: `bg-emerald-600` (valid) vs `bg-red-600` (invalid).
  - Transition effect: `transition-colors duration-500`.

- **Difficulty Selector (app/page.tsx)**:
  - Add state `difficulty` (synced with `blockchain.difficulty`).
  - Add buttons 1-4 with active highlight states.
  - Add helper text mapping difficulty to required zeros.

## Verification Plan

### Manual Verification
1. Verify the banner is green on initial load.
2. Select difficulty 3, mine a block, and verify the resulting hash has 3 zeros.
3. Verify the helper text updates correctly for each difficulty level.
4. (Anticipated) If tampering occurs, verify the banner turns red immediately.
