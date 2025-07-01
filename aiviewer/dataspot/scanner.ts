import { NextRequest } from "next/server"
import { scanTokenActivity } from "@/routines/scanline/solanaTokenFlowScanner"

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.nextUrl.searchParams.get("token")

  if (!token || typeof token !== "string" || token.length < 32) {
    return new Response("Invalid or missing token address", { status: 400 })
  }

  try {
    const activityResult = await scanTokenActivity(token)

    const responsePayload = {
      success: true,
      token,
      activity: activityResult,
      timestamp: Date.now(),
    }

    return new Response(JSON.stringify(responsePayload), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error during scan"
    console.error("[Phasemap::TokenScan]", token, errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        token,
        timestamp: Date.now(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
}
р