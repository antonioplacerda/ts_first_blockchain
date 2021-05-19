import config from "../config.json";
import { genKeyPair } from "../chain-util";
import { ec } from "elliptic";

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
}

export default Wallet;