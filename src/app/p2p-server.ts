import WebSocket from "ws";
import Blockchain, { ChainType } from "../blockchain";
import TransactionPool from "../wallet/transaction-pool";
import Transaction from "../wallet/Transaction";

const P2P_PORT = +(process.env.P2P_PORT || 5001);
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

enum MESSAGE_TYPES {
  chain = "CHAIN",
  transaction = "TRANSACTION",
}

interface MessageChainType {
  type: MESSAGE_TYPES.chain,
  chain: ChainType
}

interface MessageTransactionType {
  type: MESSAGE_TYPES.transaction,
  transaction: Transaction
}

type MessageType = MessageChainType | MessageTransactionType;

export default class P2pServer {
  public sockets: WebSocket[] = [];

  constructor(public blockchain: Blockchain, public transactionPool: TransactionPool) {}

  listen(): void {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket: WebSocket) => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for p2p connections on: ${P2P_PORT}`);
  }

  connectToPeers(): void {
    peers.forEach(peer =>{
      const socket = new WebSocket(peer);

      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket: WebSocket): void {
    this.sockets.push(socket);
    console.log("Socket connected");

    this.messageHandler(socket);

    this.sendChain(socket);
  }

  messageHandler(socket: WebSocket): void {
    socket.on("message", (message: string) => {
      const data: MessageType = JSON.parse(message);
      if (data.type === MESSAGE_TYPES.chain ) {
        try {
          this.blockchain.replaceChain(data.chain);
          console.log("Blockchain replaced");
        } catch (e) {
          console.error(e.message);
        }
      } else if (data.type === MESSAGE_TYPES.transaction) {
        this.transactionPool.updateOrAddTransaction(data.transaction);
      }

    });
  }

  sendChain(socket: WebSocket): void {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain,
    }));
  }

  sendTransaction(socket: WebSocket, transaction: Transaction): void {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction,
    }));
  }

  syncChains(): void {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction: Transaction): void {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}