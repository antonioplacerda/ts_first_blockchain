import Transaction, { AddressType } from "./Transaction";

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

  existingTransaction(address: AddressType): Transaction | undefined {
    return this.transactions.find(t => t.input.address === address);
  }

  validTransactions(): Transaction[] {
    return this.transactions.filter(transaction => (
      Transaction.verifyTransaction(transaction) &&
      transaction.input.amount === transaction.outputs.reduce(
        (total, { amount }) => total + amount, 0,
      )
    ));
  }

  clear(): void {
    this.transactions = [];
  }
}