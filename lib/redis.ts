import { Redis } from '@upstash/redis'

// Singleton — reused across requests in the same serverless instance
let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _redis
}

// TTLs in seconds
export const TTL = {
  stats: 120,      // subject stats — 2 min
  schedule: 60,    // today's schedule — 1 min
  calendar: 300,   // calendar grid — 5 min
  reports: 180,    // weekly/semester reports — 3 min
  sparkline: 300,  // sparklines — 5 min
} as const

// ─── Typed cache helpers ──────────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis()
    const val = await redis.get<T>(key)
    return val ?? null
  } catch {
    return null  // never let cache errors break the app
  }
}

export async function cacheSet<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await getRedis().set(key, value, { ex: ttl })
  } catch {
    // silent
  }
}

// Delete all keys matching a pattern (e.g. invalidate a user's entire cache)
export async function cacheDel(...keys: string[]): Promise<void> {
  try {
    if (keys.length) await getRedis().del(...keys)
  } catch {
    // silent
  }
}

// ─── Key builders ─────────────────────────────────────────────────────────────

export const key = {
  allStats:    (userId: string, semId: string) => `ae:stats:${userId}:${semId}`,
  overallStats:(userId: string, semId: string) => `ae:overall:${userId}:${semId}`,
  daySchedule: (userId: string, semId: string, date: string) => `ae:day:${userId}:${semId}:${date}`,
  calendar:    (userId: string, semId: string, y: number, m: number) => `ae:cal:${userId}:${semId}:${y}:${m}`,
  sparkline:   (userId: string, subId: string) => `ae:spark:${userId}:${subId}`,
  weekReport:  (userId: string, semId: string, offset: number) => `ae:week:${userId}:${semId}:${offset}`,
  semReport:   (userId: string, semId: string) => `ae:semrep:${userId}:${semId}`,
  exportData:  (userId: string, semId: string) => `ae:export:${userId}:${semId}`,
}

// Invalidate everything for a user+semester (call after any mutation)
export async function invalidateUserCache(userId: string, semId: string, date?: string): Promise<void> {
  const keys = [
    key.allStats(userId, semId),
    key.overallStats(userId, semId),
    key.semReport(userId, semId),
    key.exportData(userId, semId),
    key.weekReport(userId, semId, 0),
    key.weekReport(userId, semId, -1),
  ]
  if (date) keys.push(key.daySchedule(userId, semId, date))
  await cacheDel(...keys)
}
