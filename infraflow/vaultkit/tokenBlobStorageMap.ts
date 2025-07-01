interface TokenBlobMeta {
  tokenId: string
  lastUpdated: number
  sizeBytes: number
}

const blobMetaMap: Map<string, TokenBlobMeta> = new Map()

export function updateBlobMetadata(tokenId: string, size: number): void {
  blobMetaMap.set(tokenId, {
    tokenId,
    lastUpdated: Date.now(),
    sizeBytes: size
  })
}

export function getBlobMetadata(tokenId: string): TokenBlobMeta | null {
  return blobMetaMap.get(tokenId) || null
}

export function getAllBlobMetadata(): TokenBlobMeta[] {
  return Array.from(blobMetaMap.values())
}

export function purgeOldMetadata(maxAgeMs: number): void {
  const now = Date.now()
  for (const [key, meta] of blobMetaMap.entries()) {
    if (now - meta.lastUpdated > maxAgeMs) {
      blobMetaMap.delete(key)
    }
  }
}
