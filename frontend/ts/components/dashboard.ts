/**
 * Renders a chart canvas under #app and logs the number of data points.
 */
export function renderChart(dataPoints: number[]): void {
  const app = document.getElementById("app")
  if (!app) return
  const chart = document.createElement("canvas")
  chart.id = "chart"
  app.appendChild(chart)
  console.log("Chart rendered with", dataPoints.length, "points")
}

/**
 * Renders a generic block by index.
 * Logs "Rendering block X".
 */
export function renderBlock(index: number): void {
  if (index < 0 || index > 24 || !Number.isInteger(index)) {
    console.warn(`renderBlock: invalid index ${index}`)
    return
  }
  console.log(`Rendering block ${index}`)
}
