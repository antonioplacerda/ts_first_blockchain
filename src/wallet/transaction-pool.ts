import Transaction from "./Transaction";

export default class TransactionPool {
  constructor(
    public transactions: Transaction[] = [],
  ) {}

  updateOrAddTransaction(transaction: Transaction): void {
    const transactionIndex = this.transactions.indexOf(this.transactions.find(t => t.id === transaction.id));
    if (transactionIndex >= 0) {
      this.transactions[transactionIndex] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }
}