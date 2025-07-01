import fs from "fs"
import path from "path"

const baseDir = "./blobstore"

export function ensureBlobStore(): void {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
    console.log("📁 Blobstore directory initialized")
  }
}

export function isBlobStoreReady(): boolean {
  return fs.existsSync(baseDir)
}

export function getBlobPath(tokenId: string): string {
  return path.join(baseDir, `${tokenId}.blob.json`)
}

export function validateBlob(tokenId: string): boolean {
  const filePath = getBlobPath(tokenId)
  if (!fs.existsSync(filePath)) return false

  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"))
    return typeof content === "object"
  } catch {
    return false
  }
}
