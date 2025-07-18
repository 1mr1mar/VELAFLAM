export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = localStorage.getItem("flames-session-id")

  if (!sessionId) {
    sessionId = "guest_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    localStorage.setItem("flames-session-id", sessionId)
  }

  return sessionId
}
