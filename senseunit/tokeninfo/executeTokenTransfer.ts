import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"

export interface TransferRequest {
  sender: Keypair
  recipient: string
  amountLamports: number
}

/**
 * Executes a SOL transfer between two accounts
 */
export async function executeTokenTransfer(
  connection: Connection,
  request: TransferRequest
): Promise<string> {
  const toPubkey = new PublicKey(request.recipient)

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: request.sender.publicKey,
      toPubkey,
      lamports: request.amountLamports
    })
  )

  const signature = await connection.sendTransaction(transaction, [request.sender])
  await connection.confirmTransaction(signature, "confirmed")
  return signature
}
