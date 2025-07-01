import fetch from "node-fetch"

/* ------------ Data Types for Depth Scanner ------------ */

interface Order {
  price: number      // price at given level
  size: number       // size of bid or ask (base units)
}

interface OrderBook {
  bids: Order[]      // descending prices
  asks: Order[]      // ascending prices
  timestamp: number  // epoch ms
}

interface BookSummary {
  midPrice: number         // average between top bid/ask
  spreadPercent: number    // relative gap between bid and ask
  imbalance: number        // bias toward buy/sell side
  totalDepthUSD: number    // total liquidity value near top
  timestamp: number
}

/* ------------ Core Analyzer: Order Flow & Depth Metrics ------------ */

export class OrderBookAnalyzer {
  constructor(private readonly apiUrl: string) {}

  /**
   * Pull level-2 order book snapshot from market API
   * Used to analyze token liquidity and pressure on both sides
   */
  async fetchOrderBook(symbol: string, depth = 50): Promise<OrderBook> {
    const res = await fetch(`${this.apiUrl}/markets/${symbol}/orderbook?depth=${depth}`, {
      timeout: 10_000,
    })
    if (!res.ok) throw new Error(`Order-book fetch error ${res.status}: ${res.statusText}`)
    return (await res.json()) as OrderBook
  }

  /**
   * Calculate mid-market price based on top bid/ask
   * Common reference point for fair price
   */
  midPrice(book: OrderBook): number {
    const bid = book.bids[0]?.price ?? 0
    const ask = book.asks[0]?.price ?? 0
    return (bid + ask) / 2
  }

  /**
   * Evaluate the spread between best bid and ask
   * Wider spreads = lower liquidity or volatile token
   */
  spreadPct(book: OrderBook): number {
    const bid = book.bids[0]?.price ?? 0
    const ask = book.asks[0]?.price ?? 0
    return bid && ask ? ((ask - bid) / ((ask + bid) / 2)) * 100 : 0
  }

  /**
   * Compute liquidity imbalance between buyers and sellers
   * Value between -1 (ask heavy) and +1 (bid heavy)
   * Can signal pressure zones or potential breakouts
   */
  imbalance(book: OrderBook): number {
    const bidVol = book.bids.reduce((s, o) => s + o.size, 0)
    const askVol = book.asks.reduce((s, o) => s + o.size, 0)
    const total = bidVol + askVol
    return total ? (bidVol - askVol) / total : 0
  }

  /**
   * Estimate total dollar-value liquidity near top N levels
   * Helps assess how thick/thin the market is
   */
  depthUSD(book: OrderBook, levels = 10): number {
    const sliceBid = book.bids.slice(0, levels)
    const sliceAsk = book.asks.slice(0, levels)
    const bidVal = sliceBid.reduce((s, o) => s + o.price * o.size, 0)
    const askVal = sliceAsk.reduce((s, o) => s + o.price * o.size, 0)
    return bidVal + askVal
  }

  /**
   * Compact summary of key order-book metrics for analytics engines
   * Used for scoring, risk modeling, or snapshot exports
   */
  summarize(book: OrderBook, depthUsdLevels = 10): BookSummary {
    return {
      midPrice: this.midPrice(book),
      spreadPercent: this.spreadPct(book),
      imbalance: this.imbalance(book),
      totalDepthUSD: this.depthUSD(book, depthUsdLevels),
      timestamp: book.timestamp,
    }
  }
}
