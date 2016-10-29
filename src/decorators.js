export function logAsyncError(v, key, desc) {
  const old = desc.value
  desc.value = async function(...args) {
    try {
      return await old.call(this, ...args)
    } catch (e) {
      console.error(`[${key}] error`)
      throw new Error(e)
    }
  }
  return desc
}
