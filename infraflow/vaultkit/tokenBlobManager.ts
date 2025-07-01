import fs from "fs"
import path from "path"

const basePath = "./blobstore"

export function saveBlob(tokenId: string, data: any): void {
  const filePath = path.join(basePath, `${tokenId}.blob.json`)
  fs.mkdirSync(basePath, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export function loadBlob(tokenId: string): any | null {
  const filePath = path.join(basePath, `${tokenId}.blob.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export function deleteBlob(tokenId: string): boolean {
  const filePath = path.join(basePath, `${tokenId}.blob.json`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return true
  }
  return false
}

export function listStoredBlobs(): string[] {
  if (!fs.existsSync(basePath)) return []
  return fs.readdirSync(basePath).filter(f => f.endsWith(".blob.json"))
}
