import TransactionPool from "./transaction-pool";
import Wallet from "./index";
import Transaction from "./Transaction";

describe("When creating a transaction pool", () => {
  let transactionPool: TransactionPool;
  let wallet: Wallet;
  let transaction: Transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "r4nd-4ddr355", 30);
    transaction = Transaction.newTransaction(wallet, "r4nd-4ddr355", 30);
    transactionPool.updateOrAddTransaction(transaction);
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
    const updatedTransaction = transaction.update(wallet, "foo-4ddr3ss", 50);
    transactionPool.updateOrAddTransaction(updatedTransaction);

    expect(transactionPool.transactions.length).toEqual(1);
    expect(JSON.stringify(transactionPool.transactions[0])).not.toEqual(oldTransaction);
  });

  it("should add a new transaction to the pool even if it has the same info", () => {
    const duplicateTransaction = Transaction.newTransaction(wallet, "r4nd-4ddr355", 30);
    transactionPool.updateOrAddTransaction(duplicateTransaction);

    expect(transactionPool.transactions.length).toEqual(2);
  });
});