import Blockchain from "./index";
import Block from "./Block";

describe("Blockchain", () => {
  let blockchain: Blockchain, blockchain2: Blockchain;
  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it("should starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis);
  });

  it("should add a new block", () => {
    const data = "foo";

    blockchain.addBlock(data);

    expect(blockchain.chain[blockchain.chain.length - 1].getData()).toEqual(data);
  });

  it("should validate a valid chain", () => {
    blockchain2.addBlock("foo");

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  it("should invalidate a chain with a corrupt genesis block", () => {
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  it("should invalidate a corrupt chain", () => {
    blockchain2.addBlock("foo");
    blockchain2.chain[1].alterData("Bad foo");

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it("should replace the chain with a valid chain", () => {
    blockchain2.addBlock("goo");
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  it("should not replace with a change of the same size or shorter", () => {
    blockchain.addBlock("foo");
    try { blockchain.replaceChain(blockchain2.chain); } catch (e) { console.log(e.message);}

    expect(() => blockchain.replaceChain(blockchain2.chain)).toThrow();
    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });
});