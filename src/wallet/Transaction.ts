import { hash, id, verifySignature } from "../chain-util";
import Wallet from "./index";
import { ec } from "elliptic";
import config from "../config.json";

export type AddressType = string

export interface TransactionInputI {
  timestamp: number,
  amount: number,
  address: AddressType,
  signature: ec.Signature,
}

export interface TransactionOutputI {
  amount: number,
  address: AddressType,
}


class Transaction {
  public id
  public input: TransactionInputI;
  public outputs: TransactionOutputI[] = []

  constructor() {
    this.id = id();
    this.input = null;
  }

  update(sender: Wallet, recipient: AddressType, amount: number): Transaction {
    const senderOutput = this.outputs.find(output => output.address === sender.publicKey);

    if (amount > senderOutput.amount) {
      throw new Error(`Amount: ${amount} exceeds balance.`);
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });

    Transaction.signTransaction(this, sender);

    return this;
  }

  static newTransaction(senderWallet: Wallet, recipient: AddressType, amount: number): Transaction {
    if (amount > senderWallet.balance) {
      throw new Error(`Amount: ${amount} exceeds balance`);
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ]);
  }

  static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet): Transaction {
    return Transaction.transactionWithOutputs(blockchainWallet, [{
      amount: config.miningReward, address: minerWallet.publicKey,
    }]);
  }

  static signTransaction(transaction: Transaction, sender: Wallet): void {
    transaction.input = {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction: Transaction): boolean {
    return verifySignature(transaction.input.address, transaction.input.signature, hash(transaction.outputs));
  }

  static transactionWithOutputs(sender: Wallet, outputs: TransactionOutputI[]): Transaction {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, sender);
    return transaction;
  }
}

export default Transaction;