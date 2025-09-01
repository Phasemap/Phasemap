import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const sampleData = [
  { time: "10:00", intensity: 20 },
  { time: "10:05", intensity: 45 },
  { time: "10:10", intensity: 30 },
  { time: "10:15", intensity: 70 },
  { time: "10:20", intensity: 55 },
  { time: "10:25", intensity: 90 },
]

export const SignalIntensityGraph: React.FC = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-1">Signal Intensity</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Visual scale of detection strength over time
      </p>

      <div className="h-52 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "0.5rem",
                color: "#f9fafb",
              }}
            />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
