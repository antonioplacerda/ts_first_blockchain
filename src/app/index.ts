import express from "express";
import Blockchain from "../blockchain";
import bodyParser from "body-parser";
import P2pServer from "./p2p-server";
import TransactionPool from "../wallet/transaction-pool";
import Wallet from "../wallet";
import Miner from "./miner";

const HTTP_PORT: number = +(process.env.HTTP_PORT || 3001);

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  try {
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    p2pServer.broadcastTransaction(transaction);
  } catch (e) {
    res.statusCode = 401;
    res.send({ error: e.message });
  }
  res.redirect("/transactions");
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect("/blocks");
});

app.get("/mine-transactions", (req, res) => {
  miner.mine();
  res.redirect("/blocks");
});

app.get("/public-key", (req, res) =>{
  res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();