(() => {
  "use strict";

  const ACTION = "nexus.authorization.application";
  const LOGIN_PAGE = "/login.html";
  const PORTAL_PAGE = "/index.html";
  const READ_ONLY_TERMS = [
    "add","create","save","edit","update","delete","remove","issue","release",
    "upload","override","submit","approve","reject","transfer","stock out",
    "receive","return","reconcile","import","write","archive"
  ];

  const state = { ready:false, authorization:null, applicationCode:"" };
  const normalize = value => String(value ?? "").trim();

  function getApplicationCode() {
    const meta = document.querySelector('meta[name="nexus-application"]');
    const configured = meta?.content || document.documentElement.dataset.nexusApplication || document.body?.dataset.nexusApplication || window.NEXUS_APPLICATION_CODE || "";
    return normalize(configured).toUpperCase();
  }

  function returnUrl() {
    return encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
  }

  function redirectToLogin() {
    window.NexusSession?.clear?.();
    window.location.replace(`${LOGIN_PAGE}?returnUrl=${returnUrl()}`);
  }

  function redirectToPortal(message) {
    window.location.replace(`${PORTAL_PAGE}?accessError=${encodeURIComponent(message || "Application access denied.")}`);
  }

  function showGate(message) {
    let gate = document.getElementById("nexus-application-gate");
    if (!gate) {
      gate = document.createElement("div");
      gate.id = "nexus-application-gate";
      gate.innerHTML = '<div class="nexus-application-gate-box"><div class="nexus-application-spinner"></div><div id="nexus-application-gate-message">Verifying NEXUS access…</div></div>';
      document.documentElement.appendChild(gate);
    }
    const node = gate.querySelector("#nexus-application-gate-message");
    if (node) node.textContent = message || "Verifying NEXUS access…";
  }

  function hideGate() {
    document.documentElement.classList.remove("nexus-app-auth-pending");
    document.getElementById("nexus-application-gate")?.remove();
  }

  function installBaseStyles() {
    if (document.getElementById("nexus-app-guard-style")) return;
    const style = document.createElement("style");
    style.id = "nexus-app-guard-style";
    style.textContent = `
      html.nexus-app-auth-pending body{visibility:hidden!important}
      #nexus-application-gate{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:linear-gradient(135deg,#001d5a,#0059b8);color:#fff;font-family:"Segoe UI",Arial,sans-serif;font-weight:900}
      .nexus-application-gate-box{text-align:center;padding:24px}
      .nexus-application-spinner{width:50px;height:50px;border:5px solid #ffffff55;border-top-color:#fff;border-radius:50%;margin:0 auto 16px;animation:nexusAppSpin .8s linear infinite}
      @keyframes nexusAppSpin{to{transform:rotate(360deg)}}
      html.nexus-readonly [data-nexus-write-control="true"]{opacity:.48!important;cursor:not-allowed!important;pointer-events:none!important}
      #nexus-readonly-banner{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:2147483000;background:#fff7ed;color:#9a3412;border:1px solid #fdba74;border-radius:999px;padding:9px 15px;font:800 12px/1.2 "Segoe UI",Arial,sans-serif;box-shadow:0 8px 22px rgba(15,23,42,.18)}
    `;
    document.head.appendChild(style);
  }

  function controlText(element) {
    return [element.id, element.name, element.title, element.getAttribute("aria-label"), element.textContent, element.value, element.getAttribute("onclick")].filter(Boolean).join(" ").toLowerCase();
  }

  function isAllowedInReadOnly(element) {
    return element.closest("[data-nexus-readonly-allow='true']") || element.matches("[data-nexus-readonly-allow='true']") || (element.type === "button" && /close|cancel|print|export|view|search|filter|back|logout/i.test(controlText(element)));
  }

  function isLikelyWriteControl(element) {
    if (isAllowedInReadOnly(element)) return false;
    if (element.matches("input:not([type='search']):not([type='button']):not([type='reset']), textarea")) return true;
    const text = controlText(element);
    return READ_ONLY_TERMS.some(term => text.includes(term));
  }

  function markReadOnlyControls(root=document) {
    root.querySelectorAll("button,input,textarea,select,a,[onclick]").forEach(element => {
      if (isLikelyWriteControl(element)) {
        element.dataset.nexusWriteControl = "true";
        element.setAttribute("aria-disabled", "true");
      }
    });
  }

  function installReadOnlyProtection() {
    document.documentElement.classList.add("nexus-readonly");
    const banner = document.createElement("div");
    banner.id = "nexus-readonly-banner";
    banner.textContent = "COA READ-ONLY ACCESS";
    document.body.appendChild(banner);
    markReadOnlyControls();

    const blockWrite = event => {
      const target = event.target.closest?.("[data-nexus-write-control='true']");
      if (!target) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      alert("This COA account has read-only access to TITAN.");
    };
    document.addEventListener("click", blockWrite, true);
    document.addEventListener("submit", blockWrite, true);
    document.addEventListener("change", event => {
      if (event.target.matches("[data-nexus-write-control='true']")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  function readCachedAuthorization(key) {
    if (!window.NexusSession || typeof window.NexusSession.readCache !== "function") return null;
    return window.NexusSession.readCache(key);
  }

  function writeCachedAuthorization(key, value) {
    if (!window.NexusSession || typeof window.NexusSession.writeCache !== "function") return;
    window.NexusSession.writeCache(key, value);
  }

  function publishContext(authorization) {
    const context = Object.freeze({
      applicationCode: authorization.applicationCode,
      account: authorization.account || null,
      employee: authorization.employee || null,
      role: normalize(authorization.role).toLowerCase(),
      readOnly: authorization.readOnly === true,
      access: authorization.access || null,
      authorizedAt: authorization.authorizedAt || new Date().toISOString()
    });
    state.ready = true;
    state.authorization = authorization;
    state.applicationCode = context.applicationCode;
    window.NEXUS_APP_CONTEXT = context;
    window.dispatchEvent(new CustomEvent("nexus:application-authorized", {detail:context}));
    document.documentElement.classList.add(`nexus-role-${context.role || "unknown"}`);
    if (context.readOnly) installReadOnlyProtection();
  }

  async function initialize() {
    installBaseStyles();
    showGate("Verifying NEXUS application access…");
    const applicationCode = getApplicationCode();
    const token = window.NexusSession?.getToken?.();

    if (!applicationCode) return redirectToPortal("This application has no NEXUS application code.");
    if (!token) return redirectToLogin();

    try {
      const cacheKey = `tesda_albay_nexus_application_auth:${applicationCode}`;
      const cached = readCachedAuthorization(cacheKey);
      if (cached && cached.authorized === true) {
        publishContext(cached);
        hideGate();
        return;
      }

      const portalAuth = readCachedAuthorization("tesda_albay_nexus_portal_auth");
      const assignedApplications = Array.isArray(portalAuth?.access?.assignedApplications)
        ? portalAuth.access.assignedApplications.map(code => String(code).toUpperCase())
        : [];
      const role = String(portalAuth?.access?.role || portalAuth?.role || "").toLowerCase();
      const isAdmin = role === "admin";
      const isAssigned = isAdmin || assignedApplications.includes("*") || assignedApplications.includes(applicationCode);

      if (portalAuth && portalAuth.authorized === true && isAssigned) {
        const appContext = {
          ...portalAuth,
          applicationCode,
          role,
          readOnly: portalAuth.readOnly === true || role === "coa",
          authorized: true,
          authorizedAt: portalAuth.authorizedAt || new Date().toISOString(),
          access: portalAuth.access || null,
          account: portalAuth.account || null,
          employee: portalAuth.employee || null
        };
        writeCachedAuthorization(cacheKey, appContext);
        publishContext(appContext);
        hideGate();
        return;
      }

      const authorization = await window.NexusApi.execute(ACTION, {token, applicationCode});
      if (!authorization || authorization.authorized !== true) {
        if (authorization?.authenticated !== true) return redirectToLogin();
        return redirectToPortal(authorization?.message || `Your account is not authorized to open ${applicationCode}.`);
      }
      writeCachedAuthorization(cacheKey, authorization);
      publishContext(authorization);
      hideGate();
    } catch (error) {
      console.error("[NEXUS APP GUARD]", error);
      redirectToPortal(error?.message || "Unable to verify application access.");
    }
  }

  function assertWritable() {
    if (!state.ready || !state.authorization) throw new Error("NEXUS application authorization is not ready.");
    if (state.authorization.readOnly === true) throw new Error("This account has read-only access.");
    return true;
  }

  window.NexusAppGuard = Object.freeze({
    initialize,
    assertWritable,
    getContext: () => window.NEXUS_APP_CONTEXT || null,
    isReadOnly: () => window.NEXUS_APP_CONTEXT?.readOnly === true
  });

  initialize();
})();
