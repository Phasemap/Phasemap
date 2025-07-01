import { z } from "zod"

// Generic base schema for any Phasemap action input
export type PhasemapSchema = z.ZodObject<z.ZodRawShape>

// Standard format for action responses
export interface PhasemapActionResponse<T> {
  notice: string
  data?: T
  timestamp?: string
}

// Blueprint for all Phasemap AI-actions
export interface PhasemapActionCore<
  S extends PhasemapSchema,
  R,
  Ctx = unknown
> {
  id: string
  summary: string
  input: S
  execute: (
    args: {
      payload: z.infer<S>
      context: Ctx
    }
  ) => Promise<PhasemapActionResponse<R>>
}

// Union type for pluggable actions
export type PhasemapAction = PhasemapActionCore<PhasemapSchema, unknown, unknown>

// Action: Deep risk analysis for a given token address
export const riskSignalSweepAction: PhasemapActionCore<
  z.ZodObject<{
    tokenAddress: z.ZodString
    hoursBack: z.ZodNumber
    deepTrace?: z.ZodBoolean
  }>,
  {
    riskScore: number
    anomalyFlags: string[]
    volumeAnomaly?: boolean
    sybilDetected?: boolean
  },
  {
    scanEndpoint: string
    apiKey: string
    includeAdvancedCheck?: boolean
  }
> = {
  id: "riskSignalSweep",
  summary: "Analyze token activity and emit anomaly signals based on multi-factor AI scoring",
  input: z.object({
    tokenAddress: z.string(),
    hoursBack: z.number().int().positive(),
    deepTrace: z.boolean().optional()
  }),
  async execute({ payload, context }) {
    const { tokenAddress, hoursBack, deepTrace } = payload
    const { scanEndpoint, apiKey, includeAdvancedCheck } = context

    const url = new URL(`${scanEndpoint}/phasemap/risk`)
    url.searchParams.append("address", tokenAddress)
    url.searchParams.append("hours", hoursBack.toString())
    if (deepTrace) url.searchParams.append("deep", "1")
    if (includeAdvancedCheck) url.searchParams.append("advanced", "1")

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error(`Phasemap risk sweep failed: ${res.status} ${res.statusText}`)
    }

    const result = await res.json()
    return {
      notice: `Phasemap scan completed for ${tokenAddress}`,
      timestamp: new Date().toISOString(),
      data: {
        riskScore: result.riskScore,
        anomalyFlags: result.flags,
        volumeAnomaly: result.volumeAnomaly ?? false,
        sybilDetected: result.sybilDetected ?? false
      }
    }
  }
}
