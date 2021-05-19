import WebSocket from "ws";
import Blockchain from "../blockchain";

const P2P_PORT = +(process.env.P2P_PORT || 5001);
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export default class P2pServer {
  public sockets: WebSocket[] = [];

  constructor(public blockchain: Blockchain) {}

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
    socket.on("message", message => {
      const data = JSON.parse(message.toString());

      try {
        this.blockchain.replaceChain(data);
        console.log("Blockchain replaced");
      } catch (e) {
        console.error(e.message);
      }
    });
  }

  sendChain(socket: WebSocket): void {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains(): void {
    this.sockets.forEach(socket => this.sendChain(socket));

  }
}