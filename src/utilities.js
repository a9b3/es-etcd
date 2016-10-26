import invariant from 'invariant'

export function selectiveMerge(keys, to, from) {
  keys.forEach(key => {
    invariant(from[key], `'${key}' must be provided`)
    to[key] = from[key]
  })
}
