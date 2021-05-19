import config from "../config.json";
import { hash } from "../chain-util";

export type HashType = string;
export type BlockDataType = string;

export default class Block {
  private static genesisBlock: Block

  constructor(
    public readonly timestamp: number,
    public readonly lastHash: HashType,
    public readonly hash: HashType,
    private data: BlockDataType,
    public readonly nonce: number,
    public readonly difficulty?: number,
  ) {
    this.difficulty = difficulty || config.difficulty;
  }

  getData(): BlockDataType {
    return this.data;
  }

  alterData(data: BlockDataType): boolean {
    if (this.timestamp === 0) {
      return false;
    }
    this.data = data;
    return true;
  }

  toString(): string {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static get genesis(): Block {
    if (!Block.genesisBlock) {
      Block.genesisBlock = new Block(0, "----", "f1r57-h45h", "", 0);
    }
    return Block.genesisBlock;
  }

  static mineBlock(lastBlock: Block, data: BlockDataType): Block {
    let hash: string;
    let timestamp: number;

    const { hash: lastHash } = lastBlock;
    let { difficulty } = lastBlock;

    let nonce = -1;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp: number, lastHash: string, data: BlockDataType, nonce: number, difficulty: number): string {
    return hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block: Block): string {
    const { timestamp, lastHash, data, nonce, difficulty } = block;

    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock: Block, currentTime: number): number {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + config.mineRate > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}
