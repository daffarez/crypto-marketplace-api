import { prisma } from "../db/client.js";
import crypto from "crypto";
import { FakeSendDTO } from "../schemas/blockchain.schema.js";

export async function fakeSend(data: FakeSendDTO) {
  // simulate tx hash ethereum
  const txHash = "0x" + crypto.randomBytes(32).toString("hex");

  const tx = await prisma.blockchainTransaction.create({
    data: {
      hash: txHash,
      toAddress: data.toAddress,
      amount: data.amount,
    },
  });

  return tx;
}
