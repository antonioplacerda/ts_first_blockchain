import Block, { BlockDataType } from "./Block";

describe("Block", () => {
  let data:BlockDataType, lastBlock: Block, block: Block;

  beforeEach(() => {
    data = "bar";
    lastBlock = Block.genesis;
    block = Block.mineBlock(lastBlock, data);
  });

  it("gets always the same genesis", () => {
    expect(Block.genesis).toStrictEqual(Block.genesis);
  });

  it("sets the `data` to match the input", () => {
    expect(block.getData()).toEqual(data);
  });

  it("sets the `lastHash` to match the hash of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it("should generate a hash that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual("0".repeat(block.difficulty));
  });

  it("should lower the difficulty for slowly mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1);
  });

  it("should raise the difficulty for quickly mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1);
  });

});
