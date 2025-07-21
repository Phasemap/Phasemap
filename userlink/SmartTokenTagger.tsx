import React, { useEffect, useState } from "react"
import clsx from "clsx"

interface SmartTokenTaggerProps {
  tokenMint: string
  maxTags?: number
}

type TagInfo = {
  label: string
  category: "volatility" | "freshness" | "risk" | "stability" | "other"
}

export const SmartTokenTagger: React.FC<SmartTokenTaggerProps> = ({
  tokenMint,
  maxTags = 5,
}) => {
  const [tags, setTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTags() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/ai/token-tags?mint=${tokenMint}`)
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data: TagInfo[] = await res.json()
        setTags(data.slice(0, maxTags))
      } catch (err: any) {
        setError("Failed to load tags")
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [tokenMint, maxTags])

  const colorMap: Record<TagInfo["category"], string> = {
    volatility: "bg-red-100 text-red-800",
    freshness: "bg-green-100 text-green-800",
    risk: "bg-yellow-100 text-yellow-800",
    stability: "bg-blue-100 text-blue-800",
    other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-1">Smart Tagger</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        AI-generated behavior tags for {tokenMint}
      </p>

      {loading && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Loading tags…
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded-full cursor-pointer select-none",
                colorMap[tag.category] || colorMap.other,
                "transition-transform hover:scale-105"
              )}
              title={`Category: ${tag.category}`}
            >
              {tag.label}
            </span>
          ))}
          {tags.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No tags available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
