import { Keypair, Transaction, Connection } from "@solana/web3.js"

export async function signAndSend(
  connection: Connection,
  tx: Transaction,
  signer: Keypair
): Promise<string> {
  tx.feePayer = signer.publicKey
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  tx.sign(signer)
  const raw = tx.serialize()
  return await connection.sendRawTransaction(raw)
}
