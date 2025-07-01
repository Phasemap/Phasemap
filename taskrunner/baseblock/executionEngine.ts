import { Connection, PublicKey } from "@solana/web3.js"
import { decodeTransactionData } from "../utils/decodeTx"

export async function executeTokenScanTask(
  connection: Connection,
  tokenMint: string
): Promise<{ success: boolean; slotsChecked: number }> {
  const mint = new PublicKey(tokenMint)
  const signatures = await connection.getSignaturesForAddress(mint, { limit: 100 })
  let slotsChecked = 0

  for (const sig of signatures) {
    const tx = await connection.getTransaction(sig.signature, { commitment: "confirmed" })
    if (tx?.transaction?.message) {
      decodeTransactionData(tx.transaction.message)
      slotsChecked++
    }
  }

  return { success: true, slotsChecked }
}
