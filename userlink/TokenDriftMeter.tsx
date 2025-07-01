import React from "react"

export const TokenDriftMeter = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Token Drift Meter</h2>
      <p className="text-sm text-gray-500">Deviation from expected volatility baseline</p>
      <div className="mt-3 h-24 bg-gradient-to-r from-green-300 via-yellow-300 to-red-400 rounded flex items-center justify-between px-4">
        <span>Low</span>
        <span className="font-bold">+12.6%</span>
        <span>High</span>
      </div>
    </div>
  )
}