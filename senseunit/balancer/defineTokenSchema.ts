import { z } from "zod"

/**
 * Zod schema for validating token metadata and balance data
 */
export const TokenMetadataSchema = z.object({
  mint: z.string().length(44),
  symbol: z.string().min(1),
  decimals: z.number().int().nonnegative(),
  name: z.string().min(1)
})

export const TokenBalanceSchema = z.object({
  owner: z.string().length(44),
  mint: z.string().length(44),
  amountRaw: z.string(),
  uiAmount: z.number().nonnegative()
})

export type TokenMetadata = z.infer<typeof TokenMetadataSchema>
export type TokenBalance = z.infer<typeof TokenBalanceSchema>
