import config from "../config.json";
import { genKeyPair } from "../chain-util";
import { ec } from "elliptic";
import Transaction, { AddressType } from "./Transaction";
import TransactionPool from "./transaction-pool";

class Wallet {
  public balance: number;
  public publicKey: string;
  private keyPair;

  constructor() {
    this.balance = config.initialBalance;
    this.keyPair = genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex", true);
  }

  toString(): string {
    return `Wallet:
    Balance   : ${this.balance}
    Public Key: ${this.publicKey.substring(0, 10)}`;
  }

  sign(dataHash: string): ec.Signature {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient: AddressType, amount: number, transactionPool: TransactionPool): Transaction {
    if (amount > this.balance) {
      throw new Error(`Amount: ${amount} exceeds current balance: ${this.balance}`);
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }
}

export default Wallet;