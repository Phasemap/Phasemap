import { z } from "zod"

export const TokenTransferSchema = z.object({
  senderPrivateKey: z.string().length(88),
  recipientAddress: z.string().length(44),
  amountLamports: z.number().int().positive()
})

export type TokenTransferInput = z.infer<typeof TokenTransferSchema>

/**
 * Validates and parses incoming transfer data
 */
export function parseTransferInput(raw: any): TokenTransferInput {
  return TokenTransferSchema.parse(raw)
}
