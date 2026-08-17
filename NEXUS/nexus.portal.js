(() => {
  "use strict";

  const ACTIONS = Object.freeze({
    PORTAL_AUTHORIZE: "nexus.authorization.portal",
    APPLICATION_AUTHORIZE: "nexus.authorization.application",
    LOGOUT: "nexus.authentication.logout"
  });

  const loading = document.getElementById("nexus-loading");
  const userPanel = document.getElementById("nexus-user-panel");
  const userName = document.getElementById("nexus-user-name");
  const userRole = document.getElementById("nexus-user-role");
  const userAvatar = document.getElementById("nexus-user-avatar");
  const logoutButton = document.getElementById("nexus-logout-button");
  const adminButton = document.getElementById("nexus-admin-button");
  const PORTAL_AUTH_CACHE_KEY = "tesda_albay_nexus_portal_auth";

  function loginUrl() {
    const returnUrl = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    return `${window.NEXUS_CONFIG.LOGIN_PAGE}?returnUrl=${returnUrl}`;
  }

  function redirectToLogin() {
    window.NexusSession.clear();
    window.location.replace(loginUrl());
  }

  function getInitials(name) {
    return String(name || "NX")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join("") || "NX";
  }

  function showPortal() {
    document.documentElement.classList.remove("nexus-auth-pending");
    loading.hidden = true;
  }

  function applyIdentity(authorization) {
    const fullName =
      authorization?.employee?.fullName ||
      authorization?.session?.fullName ||
      authorization?.account?.username ||
      "Authenticated User";

    const role = String(authorization?.role || "").toLowerCase();

    userName.textContent = fullName;
    userRole.textContent = role || "user";
    userAvatar.textContent = getInitials(fullName);
    userPanel.hidden = false;
    adminButton.hidden = role !== "admin";
  }

  function filterApplicationCards(access) {
    const role = String(access?.role || "").toLowerCase();
    const assignments = Array.isArray(access?.assignedApplications)
      ? access.assignedApplications.map(code => String(code).toUpperCase())
      : [];

    document.querySelectorAll(".app-card[data-app-code]").forEach(card => {
      const code = String(card.dataset.appCode || "").toUpperCase();
      const visible = role === "admin" || assignments.includes("*") || assignments.includes(code);
      card.classList.toggle("nexus-hidden", !visible);
      card.setAttribute("aria-hidden", visible ? "false" : "true");
    });
  }

  async function openApplication(card) {
    const token = window.NexusSession.getToken();
    const applicationCode = card.dataset.appCode;
    const destination = card.dataset.originalHref;

    if (!token || !applicationCode || !destination) {
      redirectToLogin();
      return;
    }

    const portalAuth = window.NexusSession.readCache
      ? window.NexusSession.readCache(PORTAL_AUTH_CACHE_KEY)
      : null;
    const assignedApplications = Array.isArray(portalAuth?.access?.assignedApplications)
      ? portalAuth.access.assignedApplications.map(code => String(code).toUpperCase())
      : [];
    const role = String(portalAuth?.access?.role || portalAuth?.role || "").toLowerCase();
    const isAdmin = role === "admin";
    const isAssigned = isAdmin || assignedApplications.includes("*") || assignedApplications.includes(applicationCode.toUpperCase());

    if (!portalAuth || portalAuth.authorized !== true || !isAssigned) {
      card.classList.add("nexus-checking");
      try {
        const authorization = await window.NexusApi.execute(
          ACTIONS.APPLICATION_AUTHORIZE,
          { token, applicationCode }
        );

        if (!authorization || authorization.authorized !== true) {
          if (authorization?.authenticated !== true) {
            redirectToLogin();
            return;
          }

          alert(authorization?.message || "You are not authorized to open this application.");
          return;
        }

        sessionStorage.setItem(
          "tesda_albay_nexus_current_application",
          JSON.stringify({
            applicationCode,
            role: authorization.role,
            readOnly: authorization.readOnly === true,
            authorizedAt: authorization.authorizedAt || new Date().toISOString()
          })
        );

        window.location.assign(destination);
      } catch (error) {
        alert(error?.message || "Unable to verify application access.");
      } finally {
        card.classList.remove("nexus-checking");
      }
      return;
    }

    sessionStorage.setItem(
      "tesda_albay_nexus_current_application",
      JSON.stringify({
        applicationCode,
        role,
        readOnly: portalAuth.readOnly === true || role === "coa",
        authorizedAt: portalAuth.authorizedAt || new Date().toISOString()
      })
    );

    window.location.assign(destination);
  }

  async function logout() {
    logoutButton.disabled = true;
    const token = window.NexusSession.getToken();

    try {
      if (token) {
        await window.NexusApi.execute(ACTIONS.LOGOUT, { token });
      }
    } catch (error) {
      console.warn("NEXUS logout request failed:", error);
    } finally {
      window.NexusSession.clear();
      sessionStorage.removeItem("tesda_albay_nexus_current_application");
      window.location.replace(window.NEXUS_CONFIG.LOGIN_PAGE);
    }
  }

  async function initialize() {
    const token = window.NexusSession.getToken();

    if (!token) {
      redirectToLogin();
      return;
    }

    try {
      let authorization = window.NexusSession.readCache
        ? window.NexusSession.readCache(PORTAL_AUTH_CACHE_KEY)
        : null;

      if (!authorization) {
        authorization = await window.NexusApi.execute(
          ACTIONS.PORTAL_AUTHORIZE,
          { token }
        );

        if (!authorization || authorization.authorized !== true) {
          redirectToLogin();
          return;
        }

        if (window.NexusSession.writeCache) {
          window.NexusSession.writeCache(PORTAL_AUTH_CACHE_KEY, authorization);
        }
      }

      applyIdentity(authorization);
      filterApplicationCards(authorization.access);

      document.querySelectorAll(".app-card[data-app-code]").forEach(card => {
        card.addEventListener("click", event => {
          event.preventDefault();
          openApplication(card);
        });
      });

      showPortal();
    } catch (error) {
      console.error("NEXUS portal authorization failed:", error);
      redirectToLogin();
    }
  }

  logoutButton.addEventListener("click", logout);

  adminButton.addEventListener("click", () => {
    window.location.assign("/NEXUS/admin-access.html");
  });

  initialize();
})();