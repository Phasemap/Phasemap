import React from "react"

export const SmartTokenTagger = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Smart Tagger</h2>
      <p className="text-sm text-gray-500">AI-generated tags for behavior classification</p>
      {/* Tags grid */}
      <div className="flex flex-wrap gap-2 mt-3">
        {["High Vol", "Fresh Mint", "Suspicious", "Stable"].map(tag => (
          <span key={tag} className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}