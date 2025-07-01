import React from "react"

export const SignalIntensityGraph = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Signal Intensity</h2>
      <p className="text-sm text-gray-500">Visual scale of detection strength over time</p>
      {/* Line chart placeholder */}
      <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded mt-3 flex items-center justify-center">
        Line Chart Here
      </div>
    </div>
  )
}