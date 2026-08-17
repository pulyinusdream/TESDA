window.NexusSession = (() => {
  "use strict";

  const AUTH_CACHE_TTL_MS = 5 * 60 * 1000;

  function config() {
    if (!window.NEXUS_CONFIG) throw new Error("NEXUS configuration is missing.");
    return window.NEXUS_CONFIG;
  }

  function save(loginResult) {
    if (!loginResult || loginResult.authenticated !== true || !loginResult.token) {
      throw new Error("A valid NEXUS login result is required.");
    }

    const session = {
      token: loginResult.token,
      account: loginResult.account || null,
      employee: loginResult.employee || null,
      access: loginResult.access || null,
      serverSession: loginResult.session || null,
      authenticatedAt: loginResult.authenticatedAt || new Date().toISOString()
    };

    sessionStorage.setItem(config().TOKEN_KEY, loginResult.token);
    sessionStorage.setItem(config().SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getToken() {
    return sessionStorage.getItem(config().TOKEN_KEY) || "";
  }

  function get() {
    const raw = sessionStorage.getItem(config().SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (error) { clear(); return null; }
  }

  function writeCache(key, value, ttlMs = AUTH_CACHE_TTL_MS) {
    if (!key) return null;
    const payload = {
      value,
      expiresAt: Date.now() + ttlMs
    };
    sessionStorage.setItem(key, JSON.stringify(payload));
    return value;
  }

  function readCache(key) {
    if (!key) return null;
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    try {
      const entry = JSON.parse(raw);
      if (!entry || typeof entry !== "object") return null;
      if (typeof entry.expiresAt === "number" && Date.now() > entry.expiresAt) {
        sessionStorage.removeItem(key);
        return null;
      }
      return entry.value ?? null;
    } catch (error) {
      sessionStorage.removeItem(key);
      return null;
    }
  }

  function clearCache(key) {
    if (!key) return;
    sessionStorage.removeItem(key);
  }

  function clear() {
    sessionStorage.removeItem(config().TOKEN_KEY);
    sessionStorage.removeItem(config().SESSION_KEY);
    sessionStorage.removeItem("tesda_albay_nexus_portal_auth");
    sessionStorage.removeItem("tesda_albay_nexus_application_auth");
    sessionStorage.removeItem("tesda_albay_nexus_application_auth:AIMS");
  }

  function isAuthenticated() {
    return Boolean(getToken() && get());
  }

  return Object.freeze({
    save,
    getToken,
    get,
    writeCache,
    readCache,
    clearCache,
    clear,
    isAuthenticated
  });
})();
