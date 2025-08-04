import { z } from "zod"

// Generic base schema for any Phasemap action input
export type PhasemapSchema = z.ZodObject<z.ZodRawShape>

// Standard format for action responses
export interface PhasemapActionResponse<T> {
  notice: string
  data?: T
  timestamp: string
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

// Risk signal sweep action implementation
export const riskSignalSweepAction: PhasemapActionCore<
  z.ZodObject<{
    tokenAddress: z.ZodString
    hoursBack: z.ZodNumber
    deepTrace?: z.ZodBoolean
  }>,
  {
    riskScore: number
    anomalyFlags: string[]
    volumeAnomaly: boolean
    sybilDetected: boolean
  },
  {
    scanEndpoint: string
    apiKey: string
    includeAdvancedCheck?: boolean
  }
> = {
  id: "riskSignalSweep",
  summary:
    "Analyze token activity and emit anomaly signals based on multi-factor AI scoring",
  input: z.object({
    tokenAddress: z.string().nonempty(),
    hoursBack: z.number().int().positive(),
    deepTrace: z.boolean().optional(),
  }),

  async execute({ payload, context }) {
    const { tokenAddress, hoursBack, deepTrace } = payload
    const {
      scanEndpoint,
      apiKey,
      includeAdvancedCheck = false,
    } = context

    if (!scanEndpoint || !apiKey) {
      throw new Error(
        'Missing required context: scanEndpoint and apiKey'
      )
    }

    const url = new URL(`${scanEndpoint}/risk-scan`)
    url.searchParams.set("address", tokenAddress)
    url.searchParams.set("hours", hoursBack.toString())
    if (deepTrace) url.searchParams.set("deep", "1")
    if (includeAdvancedCheck)
      url.searchParams.set("advanced", "1")

    let response: Response
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
          "Accept": "application/json",
        },
        // optional timeout via AbortController if supported
      })
    } catch (err: any) {
      throw new Error(
        `Phasemap risk sweep request error: ${err.message}`
      )
    }

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Risk sweep failed: ${response.status} ${response.statusText} - ${text}`
      )
    }

    const result = await response.json()
    const data = {
      riskScore: Number(result.riskScore) || 0,
      anomalyFlags: Array.isArray(result.flags)
        ? result.flags.map(String)
        : [],
      volumeAnomaly: Boolean(result.volumeAnomaly),
      sybilDetected: Boolean(result.sybilDetected),
    }

    return {
      notice: `Phasemap scan completed for ${tokenAddress}`,
      timestamp: new Date().toISOString(),
      data,
    }
  },
}
