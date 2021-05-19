import Wallet from "./index";
import TransactionPool from "./transaction-pool";
import Transaction, { AddressType } from "./Transaction";
import config from "../config.json";

describe("When creating a wallet", () => {
  let wallet: Wallet;
  let transactionPool: TransactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  describe("When creating a transaction", () => {
    let transaction: Transaction;
    let sendAmount: number;
    let recipient: AddressType;

    beforeEach(() => {
      sendAmount = config.initialBalance / 20;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, transactionPool);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, transactionPool);
      });

      it("should double the `sendAmount` subtracted from the wallet balance", () => {
        expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it("should clone the `sendAmount` output for the recipient", () => {
        expect(transaction.outputs.filter(({ address }) => address === recipient)
          .map(({ amount }) => amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});