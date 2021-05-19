import { ec } from "elliptic";
import { v1 } from "uuid";
import SHA256 from "crypto-js/sha256";

const eck1 = new ec("secp256k1");

export const genKeyPair = (): ec.KeyPair => eck1.genKeyPair();
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const id = () => v1();
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const hash = (data: any): string => SHA256(JSON.stringify(data)).toString();
export const verifySignature = (publicKey: string, signature: ec.Signature, dataHash: string): boolean => eck1.keyFromPublic(publicKey, "hex").verify(dataHash, signature);