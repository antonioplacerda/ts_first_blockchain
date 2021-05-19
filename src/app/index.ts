import express from "express";
import Blockchain from "../blockchain";
import bodyParser from "body-parser";
import P2pServer from "./p2p-server";
import TransactionPool from "../wallet/transaction-pool";

const HTTP_PORT: number = +(process.env.HTTP_PORT || 3001);

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();