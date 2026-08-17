/**
 * ==========================================================
 * TESDA Albay NEXUS → AIMS Runtime Adapter
 * Version: 1.1.0
 * ==========================================================
 *
 * The authenticated identity is installed by
 * aims.nexus-prebootstrap.js before TAESF/RIS bootstrap.
 * This file applies the role-based UI and NEXUS logout after
 * the complete AIMS page runtime is available.
 * ==========================================================
 */
(() => {
  "use strict";

  const LOGOUT_ACTION = "nexus.authentication.logout";

  function context() {
    return window.NEXUS_APP_CONTEXT || null;
  }

  function hideLegacyLogin() {
    const loginScreen = document.getElementById("loginScreen");
    if (loginScreen) {
      loginScreen.style.display = "none";
      loginScreen.setAttribute("aria-hidden", "true");
    }
    document.body.classList.add("logged-in");
  }

  function updateIdentityBadge(ctx) {
    const badge = document.getElementById("userBadge");
    if (!badge) return;
    const name = ctx?.employee?.fullName || ctx?.account?.username || "Authenticated User";
    const label = ctx.aimsRole === "admin"
      ? "AIMS Administrator"
      : ctx.aimsRole === "coa" ? "COA Read-Only" : "AIMS Requesting Staff";
    badge.innerText = `${name} · ${label}`;
    badge.title = "NEXUS authenticated account";
  }

  async function logout() {
    if (!window.confirm("⚠️ CONFIRMATION\n\nAre you sure you want to log out of NEXUS and AIMS?")) return;
    const token = window.NexusSession?.getToken?.() || "";
    try {
      if (token && window.NexusApi?.execute) {
        await window.NexusApi.execute(LOGOUT_ACTION, { token });
      }
    } catch (error) {
      console.warn("[AIMS NEXUS] Backend logout failed:", error);
    } finally {
      try { AuthenticationService?.logout?.(); } catch (error) {}
      window.NexusSession?.clear?.();
      sessionStorage.removeItem("tesda_albay_nexus_current_application");
      window.location.replace("/login.html");
    }
  }

  function applyRuntimeIdentity() {
    const ctx = context();
    if (!window.AIMS_NEXUS_PREBOOT_READY || !ctx) {
      window.location.replace("/index.html?accessError=" + encodeURIComponent(
        "AIMS started without a valid NEXUS identity handoff."
      ));
      return;
    }

    const currentSession = SessionManager?.getSession?.();
    if (!currentSession || currentSession.sessionType !== "DESIGNATED_USER") {
      window.location.replace("/index.html?accessError=" + encodeURIComponent(
        "The authenticated AIMS employee session was not preserved during startup."
      ));
      return;
    }

    hideLegacyLogin();
    if (typeof setUserRole === "function") setUserRole(ctx.aimsRole);
    updateIdentityBadge(ctx);
    window.logout = logout;
    const badge = document.getElementById("userBadge");
    if (badge) badge.onclick = logout;

    window.AIMS_NEXUS_CONTEXT = Object.freeze({
      account: ctx.account,
      employee: ctx.employee,
      aimsRole: ctx.aimsRole,
      nexusRole: ctx.role,
      applicationRole: ctx.account?.applicationRole || "",
      isSuperAdmin: ctx.account?.isSuperAdmin === true,
      readOnly: ctx.readOnly === true
    });

    window.dispatchEvent(new CustomEvent("aims:nexus-ready", {
      detail: window.AIMS_NEXUS_CONTEXT
    }));

    console.log("[AIMS NEXUS] Runtime identity confirmed:", window.AIMS_NEXUS_CONTEXT);
  }

  document.addEventListener("DOMContentLoaded", applyRuntimeIdentity);

  window.AimsNexusIdentity = Object.freeze({
    getContext: () => window.AIMS_NEXUS_CONTEXT || null,
    getRole: () => window.AIMS_NEXUS_CONTEXT?.aimsRole || null,
    isReadOnly: () => window.AIMS_NEXUS_CONTEXT?.readOnly === true
  });
})();
