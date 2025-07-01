import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { SolanaVaultAction, VaultActionType } from "./solanaVaultProcessor"

export interface VaultRequest {
  type: VaultActionType
  authority: PublicKey
  vault: PublicKey
  payload: Record<string, any>
}

export async function routeVaultAction(
  conn: Connection,
  req: VaultRequest
): Promise<Transaction> {
  const tx = new Transaction()

  switch (req.type) {
    case "DEPOSIT":
      tx.add(await SolanaVaultAction.buildDepositInstruction(req))
      break
    case "WITHDRAW":
      tx.add(await SolanaVaultAction.buildWithdrawInstruction(req))
      break
    case "REFRESH":
      tx.add(await SolanaVaultAction.buildRefreshInstruction(req))
      break
    default:
      throw new Error(`Unsupported vault action: ${req.type}`)
  }

  return tx
}
