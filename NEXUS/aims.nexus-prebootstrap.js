/**
 * ==========================================================
 * NEXUS → AIMS Pre-Bootstrap Identity Handoff
 * Version: 1.0.0
 * ==========================================================
 *
 * Runs after the AIMS authentication runtime is loaded and
 * before Framework/Core/Bootstrap/bootstrap.js executes.
 *
 * No backend authorization request is made here. NEXUS has
 * already authorized AIMS before navigation.
 * ==========================================================
 */
(() => {
  "use strict";

  const APPLICATION_CODE = "AIMS";
  const HANDOFF_KEY = "tesda_albay_nexus_current_application";
  const LOGIN_PAGE = "/login.html";
  const PORTAL_PAGE = "/index.html";

  function normalize(value) {
    return String(value === null || value === undefined ? "" : value).trim();
  }

  function normalizeRole(value) {
    return normalize(value).toLowerCase();
  }

  function readJson(key) {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch (error) { return null; }
  }

  function redirectToLogin() {
    window.location.replace(
      LOGIN_PAGE + "?returnUrl=" + encodeURIComponent(window.location.pathname)
    );
  }

  function failToPortal(message) {
    console.error("[AIMS PREBOOT]", message);
    window.location.replace(
      PORTAL_PAGE + "?accessError=" + encodeURIComponent(message)
    );
  }

  function resolveAimsRole(nexusSession, handoff) {
    const nexusRole = normalizeRole(handoff.role || nexusSession?.access?.role);
    const applicationRole = normalizeRole(nexusSession?.account?.applicationRole);
    const isSuperAdmin = nexusSession?.account?.isSuperAdmin === true;

    if (nexusRole === "coa" || handoff.readOnly === true) return "coa";
    if (isSuperAdmin || applicationRole === "admin") return "admin";
    return "staff";
  }

  function buildIdentity(nexusSession, handoff, aimsRole) {
    const account = nexusSession.account || {};
    const employee = nexusSession.employee || {};

    return {
      account: {
        accountId: normalize(account.accountId),
        employeeId: normalize(account.employeeId || employee.id),
        username: normalize(account.username),
        role: aimsRole,
        status: normalize(account.status) || "ACTIVE",
        mustChangePassword: account.mustChangePassword === true,
        lastLoginAt: account.lastLoginAt || null
      },
      employee: {
        id: normalize(employee.id || account.employeeId),
        employeeNo: normalize(employee.employeeNo),
        fullName: normalize(employee.fullName),
        position: normalize(employee.position),
        code: normalize(employee.code),
        office: normalize(employee.office),
        division: normalize(employee.division),
        section: normalize(employee.section),
        email: normalize(employee.email),
        status: normalize(employee.status) || "ACTIVE"
      },
      authenticatedAt: nexusSession.authenticatedAt || handoff.authorizedAt || new Date().toISOString()
    };
  }

  function validateIdentity(identity) {
    if (!identity.account.accountId) throw new Error("NEXUS account ID is missing.");
    if (!identity.account.username) throw new Error("NEXUS username is missing.");
    if (!identity.employee.id) throw new Error("NEXUS employee ID is missing.");
    if (!identity.employee.fullName) throw new Error("NEXUS employee name is missing.");
  }

  const token = window.NexusSession?.getToken?.() || sessionStorage.getItem("tesda_albay_nexus_token") || "";
  const nexusSession = window.NexusSession?.get?.() || readJson("tesda_albay_nexus_session");
  const handoff = readJson(HANDOFF_KEY);

  if (!token || !nexusSession) {
    redirectToLogin();
    return;
  }

  if (!handoff || normalize(handoff.applicationCode).toUpperCase() !== APPLICATION_CODE) {
    failToPortal("Open AIMS from the NEXUS portal. A valid AIMS authorization handoff was not found.");
    return;
  }

  try {
    if (typeof SessionManager === "undefined" || typeof SessionManager.createSession !== "function") {
      throw new Error("AIMS SessionManager is not available before bootstrap.");
    }

    const aimsRole = resolveAimsRole(nexusSession, handoff);
    const identity = buildIdentity(nexusSession, handoff, aimsRole);
    validateIdentity(identity);

    SessionManager.destroySession();
    const aimsSession = SessionManager.createSession(identity);

    window.USER_ROLE = aimsRole;
    window.NEXUS_APP_CONTEXT = Object.freeze({
      applicationCode: APPLICATION_CODE,
      account: Object.freeze({ ...nexusSession.account, applicationRole: nexusSession.account?.applicationRole || "" }),
      employee: Object.freeze({ ...nexusSession.employee }),
      access: nexusSession.access || null,
      role: normalizeRole(handoff.role || nexusSession.access?.role),
      readOnly: handoff.readOnly === true,
      authorizedAt: handoff.authorizedAt || new Date().toISOString(),
      aimsRole,
      aimsSession
    });

    document.documentElement.classList.remove("nexus-app-auth-pending");
    window.AIMS_NEXUS_PREBOOT_READY = true;
    window.dispatchEvent(new CustomEvent("aims:nexus-prebootstrap-ready", {
      detail: window.NEXUS_APP_CONTEXT
    }));

    console.log("[AIMS PREBOOT] Identity installed before TAESF bootstrap:", {
      employeeId: identity.employee.id,
      fullName: identity.employee.fullName,
      aimsRole
    });
  } catch (error) {
    SessionManager?.destroySession?.();
    failToPortal(error?.message || "AIMS identity initialization failed.");
  }
})();
