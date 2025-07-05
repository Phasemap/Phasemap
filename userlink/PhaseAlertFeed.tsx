import React from "react"
import { AlertCircle, Zap, TrendingUp, ShieldAlert } from "lucide-react"

type Alert = {
  phase: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
}

const sampleAlerts: Alert[] = [
  {
    phase: "Phase A1",
    description: "Surge detected on token XYZ",
    severity: "low",
    timestamp: "2 mins ago"
  },
  {
    phase: "Phase B2",
    description: "Rapid mint from unverified source",
    severity: "medium",
    timestamp: "10 mins ago"
  },
  {
    phase: "Phase C3",
    description: "High volatility breach",
    severity: "high",
    timestamp: "30 mins ago"
  },
  {
    phase: "Phase D4",
    description: "Anomaly in liquidity injection",
    severity: "medium",
    timestamp: "1 hr ago"
  },
  {
    phase: "Phase E5",
    description: "Contract paused unexpectedly",
    severity: "high",
    timestamp: "2 hrs ago"
  }
]

const getSeverityStyle = (level: Alert["severity"]) => {
  switch (level) {
    case "low":
      return "text-green-500"
    case "medium":
      return "text-yellow-500"
    case "high":
      return "text-red-500"
    default:
      return "text-gray-400"
  }
}

const getIcon = (level: Alert["severity"]) => {
  switch (level) {
    case "low":
      return <TrendingUp size={16} className="mr-2" />
    case "medium":
      return <Zap size={16} className="mr-2" />
    case "high":
      return <ShieldAlert size={16} className="mr-2" />
    default:
      return <AlertCircle size={16} className="mr-2" />
  }
}

export const PhaseAlertFeed: React.FC = () => {
  return (
    <div className="p-5 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border dark:border-zinc-700 transition-all">
      <h2 className="text-2xl font-semibold mb-1">🧭 Live Phase Alerts</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Real-time stream of detected anomalies across token behavior phases
      </p>
      <ul className="space-y-3">
        {sampleAlerts.map((alert, idx) => (
          <li
            key={idx}
            className={`flex items-start ${getSeverityStyle(alert.severity)}`}
          >
            <div className="flex items-center">
              {getIcon(alert.severity)}
              <div>
                <div className="font-medium">{alert.phase}: {alert.description}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {alert.timestamp}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
