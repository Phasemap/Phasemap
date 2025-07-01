import React from "react"

export const PhaseMetaControl = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Meta Settings</h2>
      <p className="text-sm text-gray-500">Tweak thresholds & refresh frequencies</p>
      <div className="mt-4 flex flex-col gap-3">
        <label className="flex justify-between text-sm">
          Threshold <input type="number" defaultValue={12} className="ml-2 w-16 p-1 rounded border border-gray-300" />
        </label>
        <label className="flex justify-between text-sm">
          Refresh <input type="number" defaultValue={30} className="ml-2 w-16 p-1 rounded border border-gray-300" />
        </label>
      </div>
    </div>
  )
}