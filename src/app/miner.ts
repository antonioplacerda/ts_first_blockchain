import Blockchain from "../blockchain";
import TransactionPool from "../wallet/transaction-pool";
import Wallet from "../wallet";
import P2pServer from "./p2p-server";
import Transaction from "../wallet/Transaction";
import Block from "../blockchain/Block";

export default class Miner {
  constructor(
    public blockchain: Blockchain,
    public transactionPool: TransactionPool,
    public wallet: Wallet,
    public p2pServer: P2pServer,
  ) {}

  mine(): Block {
    const validTransactions = this.transactionPool.validTransactions();
    if (validTransactions.length === 0 ) {
      return;
    }
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}