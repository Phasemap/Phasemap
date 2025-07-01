export type TransferKind = "native" | "spl" | "wrapped" | "unknown"

export const TransferTypeRegistry: Record<string, TransferKind> = {
  "": "native", // SOL
  "USDC_mint": "spl",
  "wETH_mint": "wrapped"
}

export function getTransferKindByMint(mint: string): TransferKind {
  return TransferTypeRegistry[mint] ?? "unknown"
}

export function registerNewMint(mint: string, kind: TransferKind): void {
  TransferTypeRegistry[mint] = kind
}
