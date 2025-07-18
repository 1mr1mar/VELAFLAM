export function getAdminUser() {
  if (typeof window === "undefined") return null

  try {
    const adminUser = localStorage.getItem("admin_user")
    return adminUser ? JSON.parse(adminUser) : null
  } catch {
    return null
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminUser() !== null
}

export function signOutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_user")
  }
}
