import Block, { BlockDataType } from "./Block";

export type ChainType = Block[];

export default class Blockchain {
  public chain: ChainType;

  constructor() {
    this.chain = [Block.genesis];
  }
  
  addBlock(data: BlockDataType): Block {
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain: ChainType): boolean {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    for (let i=1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain: ChainType): void {
    if (newChain.length <= this.chain.length) {
      throw new Error("Received chain is not longer than the current chain");
    }

    if (!this.isValidChain(newChain)) {
      throw new Error("The received chain is invalid");
    }

    this.chain = newChain;
  }

}
