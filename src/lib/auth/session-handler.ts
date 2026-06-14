type SessionExpiredHandler = () => void

let handler: SessionExpiredHandler | null = null
let handling = false

export function registerSessionExpiredHandler(fn: SessionExpiredHandler | null) {
  handler = fn
}

export function triggerSessionExpired() {
  if (handling || !handler) return
  handling = true
  try {
    handler()
  } finally {
    handling = false
  }
}
