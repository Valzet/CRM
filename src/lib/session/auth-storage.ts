const AUTH_USER_ID_KEY = "crm_auth_user_id";

export function readStoredUserId(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    return sessionStorage.getItem(AUTH_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function writeStoredUserId(id: string) {
  try {
    sessionStorage.setItem(AUTH_USER_ID_KEY, id);
  } catch {
    /* ignore quota / privacy mode */
  }
}

export function clearStoredUserId() {
  try {
    sessionStorage.removeItem(AUTH_USER_ID_KEY);
  } catch {
    /* ignore */
  }
}
