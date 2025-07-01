import { useEffect, useState } from "react"

interface TokenAlert {
  token: string
  message: string
  timestamp: number
}

export function useTokenAlerts(sourceUrl: string) {
  const [alerts, setAlerts] = useState<TokenAlert[]>([])

  useEffect(() => {
    let active = true

    async function fetchAlerts() {
      try {
        const res = await fetch(sourceUrl)
        const data: TokenAlert[] = await res.json()
        if (active) setAlerts(data)
      } catch (e) {
        console.error("Failed to load token alerts:", e)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30_000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [sourceUrl])

  return alerts
}
