import React from "react"

export const PhaseAlertFeed = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Live Alert Feed</h2>
      <p className="text-sm text-gray-500">Stream of detected phase alerts</p>
      {/* Alerts list */}
      <ul className="mt-3 space-y-2 text-sm">
        <li className="text-green-500">Phase A1: Surge detected on token XYZ</li>
        <li className="text-yellow-500">Phase B2: Rapid mint from unverified source</li>
        <li className="text-red-500">Phase C3: High volatility breach</li>
      </ul>
    </div>
  )
}