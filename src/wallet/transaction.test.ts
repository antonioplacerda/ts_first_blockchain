import Wallet from "./index";
import Transaction, { AddressType } from "./Transaction";
import config from "../config.json";

describe("When creating a Transaction", () => {
  let transaction: Transaction;
  let wallet: Wallet;
  let recipient: AddressType;
  let amount: number;

  beforeEach(() => {
    wallet = new Wallet();
    amount = config.initialBalance / 100;
    recipient = "r3c1p13nt";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("should output the amount subtracted from the wallet balance", () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it("should output the amount added to the recipient", () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });

  it("should input the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("should validate a valid transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("should invalidate a corrupt transaction", () => {
    transaction.outputs[0].amount = config.initialBalance * 10000000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("when transacting with an amount that exceeds the balance", () => {
    it("should throw an error", () => {
      expect(() => Transaction.newTransaction(wallet, recipient, config.initialBalance * 10000000)).toThrowError();
    });
  });

  describe("and updating a transaction", () => {
    let nextAmount: number;
    let nextRecipient: AddressType;

    beforeEach(() => {
      nextAmount = config.initialBalance / 50;
      nextRecipient = "n3xt-r3c1p13nt";
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it("should subtract the next amount from the sender's output", () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    it("should output an amount for the next recipient", () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
  });

  describe("and creating a reward transaction", () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });

    it("should reward the miner's wallet", () => {
      expect(transaction.outputs.find(({ address }) => address === wallet.publicKey).amount)
        .toEqual(config.miningReward);
    });
  });
});

