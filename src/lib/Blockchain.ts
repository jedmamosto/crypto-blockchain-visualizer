import Block from './Block';

export default class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  /**
   * Updates the mining difficulty.
   * @param level 
   */
  public setDifficulty(level: number): void {
    this.difficulty = level;
  }

  /**
   * Creates the first block in the blockchain.
   */
  private createGenesisBlock(): Block {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  /**
   * Returns the latest block in the chain.
   */
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a new block to the chain.
   * Sets the previousHash, mines the block, and then pushes it.
   * @param newBlock 
   */
  public addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  /**
   * Validates the integrity of the blockchain.
   * Checks if hashes are correct and link to the previous block.
   */
  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if the stored hash matches the recalculated hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if current block points to the correct previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}
