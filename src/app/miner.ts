import Blockchain from "../blockchain";
import TransactionPool from "../wallet/transaction-pool";
import Wallet from "../wallet";
import P2pServer from "./p2p-server";

export default class Miner {
  constructor(
    public blockchain: Blockchain,
    public transactionPool: TransactionPool,
    public wallet: Wallet,
    public p2pServer: P2pServer,
  ) {}

  mine(): void {
    // get valid transactions
    // include a reward for the miner
    // create a block consisting of the valid transactions
    // sync the chains in the p2p server
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools
  }
}