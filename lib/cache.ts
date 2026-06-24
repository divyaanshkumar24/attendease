import { unstable_cache } from 'next/cache'

// Wrapper that adds a tag so we can revalidate by user/semester
export function withCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: string[],
  tags: string[],
  revalidate = 60,
) {
  return unstable_cache(fn, keyParts, { tags, revalidate }) as (...args: T) => Promise<R>
}

// Call after any mutation to bust the cache
export { revalidateTag, revalidatePath } from 'next/cache'
