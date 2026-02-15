import CryptoJS from 'crypto-js';

export default class Block {
  public index: number;
  public timestamp: string;
  public data: string | object | number | boolean;
  public previousHash: string;
  public nonce: number;
  public hash: string;

  constructor(index: number, timestamp: string, data: string | object | number | boolean, previousHash: string = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculates the SHA-256 hash of the block.
   * Concatenates index + previousHash + timestamp + data + nonce.
   */
  public calculateHash(): string {
    return CryptoJS.SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce
    ).toString();
  }

  /**
   * Mines the block by finding a hash that starts with a certain number of zeros.
   * @param difficulty 
   */
  public mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}
