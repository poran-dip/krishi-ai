// top of the file, before your component
export const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error("Soil data request timed out")), timeoutMs)
  })

  const result = await Promise.race([promise, timeoutPromise])
  clearTimeout(timeoutHandle)
  return result
}
