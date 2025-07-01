import { z } from "zod"

export const TokenInsightSchema = z.object({
  mint: z.string().length(44),
  liquidity: z.number().nonnegative(),
  volume24h: z.number().nonnegative(),
  txCount: z.number().nonnegative(),
  flagged: z.boolean()
})

export type TokenInsight = z.infer<typeof TokenInsightSchema>