import CryptoJS from 'crypto-js';

/**
 * Web Worker for off-thread mining.
 * Listens for block data and difficulty, returns found nonce and hash.
 */
self.onmessage = (e: MessageEvent) => {
  const { index, timestamp, data, previousHash, difficulty, startNonce = 0 } = e.data;
  
  const calculateHash = (nonce: number): string => {
    return CryptoJS.SHA256(
      index +
      previousHash +
      timestamp +
      JSON.stringify(data) +
      nonce
    ).toString();
  };

  const target = Array(difficulty + 1).join("0");
  let nonce = startNonce;
  let hash = calculateHash(nonce);

  const startTime = performance.now();

  while (hash.substring(0, difficulty) !== target) {
    nonce++;
    hash = calculateHash(nonce);
    
    // Periodically update progress (optional, for ultra-high difficulty)
    if (nonce % 10000 === 0) {
      self.postMessage({ type: 'PROGRESS', nonce });
    }
  }

  const duration = performance.now() - startTime;

  self.postMessage({
    type: 'SUCCESS',
    nonce,
    hash,
    duration
  });
};
