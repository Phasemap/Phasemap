import {
  PublicKey,
  TransactionInstruction,
  SystemProgram
} from "@solana/web3.js"

export type VaultActionType = "DEPOSIT" | "WITHDRAW" | "REFRESH"

export const SolanaVaultAction = {
  async buildDepositInstruction({
    authority,
    vault,
    payload
  }: {
    authority: PublicKey
    vault: PublicKey
    payload: { amount: number }
  }): Promise<TransactionInstruction> {
    const keys = [
      { pubkey: authority, isSigner: true, isWritable: false },
      { pubkey: vault, isSigner: false, isWritable: true }
    ]

    const data = Buffer.from(Uint8Array.of(0, ...new BN(payload.amount).toArray("le", 8)))
    return new TransactionInstruction({
      keys,
      programId: SystemProgram.programId,
      data
    })
  },

  async buildWithdrawInstruction({ authority, vault, payload }: any) {
    // similar logic with instruction ID = 1
    return SolanaVaultAction.buildDepositInstruction({ authority, vault, payload }) // placeholder
  },

  async buildRefreshInstruction({ authority, vault }: any) {
    // dummy instruction
    const data = Buffer.from([2])
    return new TransactionInstruction({
      keys: [{ pubkey: authority, isSigner: true, isWritable: false }],
      programId: SystemProgram.programId,
      data
    })
  }
}
