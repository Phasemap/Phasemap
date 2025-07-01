import { z } from "zod"
import { TransferPayload } from "./filterUnsafeTransfers"

const TransferSchema = z.object({
  source: z.string().min(32).max(44),
  destination: z.string().min(32).max(44),
  amount: z.number().positive(),
  mint: z.string().length(44),
  timestamp: z.number().int().positive(),
  memo: z.string().optional()
})

export interface IntegrityCheck {
  valid: boolean
  issues: string[]
}

/**
 * Verifies if a given transfer payload is structurally and logically valid
 */
export function checkTransferIntegrity(data: unknown): IntegrityCheck {
  const result = TransferSchema.safeParse(data)

  if (!result.success) {
    const issues = result.error.issues.map((issue) => issue.message)
    return { valid: false, issues }
  }

  const payload = result.data as TransferPayload

  const issues: string[] = []

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.timestamp
  if (ageSeconds > 3600) {
    issues.push("Transfer appears outdated (older than 1 hour)")
  }

  if (payload.source === payload.destination) {
    issues.push("Source and destination addresses are identical")
  }

  return {
    valid: issues.length === 0,
    issues
  }
}
