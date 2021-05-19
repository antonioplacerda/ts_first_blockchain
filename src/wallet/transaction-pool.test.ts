import TransactionPool from "./transaction-pool";
import Wallet from "./index";
import Transaction from "./Transaction";
import config from "../config.json";

describe("When creating a transaction pool", () => {
  let transactionPool: TransactionPool;
  let wallet: Wallet;
  let transaction: Transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction( "r4nd-4ddr355", config.initialBalance / 100, transactionPool);
  });

  it("should add a transaction to the pool", () => {
    expect(transactionPool.transactions.length).toEqual(1);
  });

  it("should not add a duplicate transaction", () => {
    transactionPool.updateOrAddTransaction(transaction);
    expect(transactionPool.transactions.length).toEqual(1);
  });

  it("should update a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const updatedTransaction = transaction.update(wallet, "foo-4ddr3ss", config.initialBalance / 50);
    transactionPool.updateOrAddTransaction(updatedTransaction);

    expect(transactionPool.transactions.length).toEqual(1);
    expect(JSON.stringify(transactionPool.transactions[0])).not.toEqual(oldTransaction);
  });

  it("should add a new transaction to the pool even if it has the same info", () => {
    const duplicateTransaction = Transaction.newTransaction(wallet, "r4nd-4ddr355", config.initialBalance / 75);
    transactionPool.updateOrAddTransaction(duplicateTransaction);

    expect(transactionPool.transactions.length).toEqual(2);
  });

  it("should clear the transactions", () => {
    expect(transactionPool.transactions.length).toBeGreaterThan(0);
    transactionPool.clear();
    expect(transactionPool.transactions).toHaveLength(0);
  });

  describe("and when mixing valid and corrupt transactions", () => {
    let validTransactions: Transaction[];

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions];
      for (let i=0; i <6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("r4nd-4ddr355", config.initialBalance / 75, transactionPool);
        if (i%2===0) {
          transaction.input.amount = 999999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it("should show a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it("should grab the valid transactions", () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });
});