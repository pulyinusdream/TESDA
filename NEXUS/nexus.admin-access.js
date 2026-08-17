(() => {
  "use strict";

  const ACTIONS = Object.freeze({
    PORTAL_AUTHORIZE: "nexus.authorization.portal",
    USERS_GET: "nexus.admin.users.get",
    ACCESS_SAVE: "nexus.admin.access.save",
    ACCESS_REMOVE: "nexus.admin.access.remove",
    GOVERNANCE_SUMMARY_GET: "nexus.governance.summary.get",
    GOVERNANCE_ROLE_SAVE: "nexus.governance.role.save",
    LOGOUT: "nexus.authentication.logout"
  });

  const state = {
    users: [],
    catalog: [],
    administrator: null,
    governance: null,
    isSuperAdmin: false,
    selectedUser: null
  };

  const el = id => document.getElementById(id);
  const loading = el("loading");
  const container = el("users-container");
  const modal = el("access-modal");

  function redirectToLogin() {
    window.NexusSession.clear();
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.replace(`${window.NEXUS_CONFIG.LOGIN_PAGE}?returnUrl=${returnUrl}`);
  }

  function initials(name) {
    return String(name || "NX").trim().split(/\s+/).slice(0,2)
      .map(part => part.charAt(0).toUpperCase()).join("") || "NX";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));
  }

  function toast(message, type = "") {
    const node = document.createElement("div");
    node.className = `toast ${type}`.trim();
    node.textContent = message;
    el("toast-wrap").appendChild(node);
    setTimeout(() => node.remove(), 3600);
  }

  function accessState(user) {
    const access = user.access || {};
    if (String(access.status || "").toUpperCase() === "INACTIVE") {
      return { key:"inactive", label:"Inactive", className:"state-inactive" };
    }
    if (access.hasPortalAccess === true) {
      return { key:"assigned", label:"Assigned", className:"state-active" };
    }
    return { key:"pending", label:"Pending assignment", className:"state-pending" };
  }

  function updateSummary() {
    const manageable = state.users.filter(user => user.canManageAccess === true);
    el("total-users").textContent = state.users.length;
    el("admin-users").textContent = state.users.filter(user => (user.account?.nexusRole || user.account?.role) === "admin").length;
    el("assigned-users").textContent = manageable.filter(user => accessState(user).key === "assigned").length;
    el("pending-users").textContent = manageable.filter(user => accessState(user).key === "pending").length;
  }

  function filteredUsers() {
    const search = el("search-input").value.trim().toLowerCase();
    const role = el("role-filter").value;
    const access = el("access-filter").value;

    return state.users.filter(user => {
      const account = user.account || {};
      const employee = user.employee || {};
      const haystack = [
        account.username, account.accountId, employee.fullName,
        employee.position, employee.employeeNo, employee.division
      ].join(" ").toLowerCase();

      return (!search || haystack.includes(search))
        && (!role || (account.nexusRole || account.role) === role)
        && (!access || accessState(user).key === access);
    });
  }

  function renderUsers() {
    const users = filteredUsers();

    if (!users.length) {
      container.innerHTML = `<div class="empty-state"><strong>No matching accounts found.</strong><br>Adjust the search or filter settings.</div>`;
      return;
    }

    container.innerHTML = users.map(user => {
      const account = user.account || {};
      const employee = user.employee || {};
      const access = user.access || {};
      const stateInfo = accessState(user);
      const apps = Array.isArray(access.assignedApplications) ? access.assignedApplications : [];
      const role = String(account.nexusRole || account.role || "").toLowerCase();
      const applicationRole = String(account.applicationRole || "").toLowerCase();
      const fullName = employee.fullName || account.username || "Unnamed Account";

      const appHtml = apps.includes("*")
        ? `<span class="chip">ALL APPLICATIONS</span>`
        : apps.length
          ? apps.map(code => `<span class="chip">${escapeHtml(code)}</span>`).join("")
          : `<span class="empty-chip">No applications assigned</span>`;

      const actionHtml = user.canManageAccess
        ? `<div class="card-actions">
             <button class="btn btn-primary edit-access" data-account-id="${escapeHtml(account.accountId)}" type="button">${state.isSuperAdmin ? "Manage Role & Access" : "Manage Access"}</button>
           </div>`
        : `<div class="admin-note">Administrator accounts automatically receive access to all NEXUS applications.</div>`;

      return `<article class="user-card">
        <div class="user-head">
          <div class="avatar">${escapeHtml(initials(fullName))}</div>
          <div>
            <div class="user-name">${escapeHtml(fullName)}</div>
            <div class="user-meta">@${escapeHtml(account.username)} · ${escapeHtml(employee.position || "No position")}</div>
            <div class="user-meta">NEXUS: ${escapeHtml(role.toUpperCase())} · AIMS: ${escapeHtml((applicationRole || "not set").toUpperCase())}</div>
          </div>
          <span class="role-badge role-${escapeHtml(role)}">${escapeHtml(role)}</span>
        </div>
        <div class="access-state">
          <span>NEXUS Access</span><span class="${stateInfo.className}">${stateInfo.label}</span>
        </div>
        <div class="apps">${appHtml}</div>
        ${access.readOnly === true ? `<div class="admin-note" style="background:#ecfdf5;color:#166534;border-color:#bbf7d0">Read-only access enforced</div>` : ""}
        ${actionHtml}
      </article>`;
    }).join("");

    container.querySelectorAll(".edit-access").forEach(button => {
      button.addEventListener("click", () => openModal(button.dataset.accountId));
    });
  }

  function openModal(accountId) {
    const user = state.users.find(item => item.account?.accountId === accountId);
    if (!user || user.canManageAccess !== true) return;

    state.selectedUser = user;
    state.selectedUser.originalNexusRole = String(
      user.account?.nexusRole || user.account?.role || "staff"
    ).toLowerCase();
    const account = user.account || {};
    const employee = user.employee || {};
    const access = user.access || {};
    const selected = new Set(Array.isArray(access.assignedApplications) ? access.assignedApplications : []);

    el("modal-user-name").textContent = employee.fullName || account.username;
    el("modal-user-details").textContent =
      `${account.username} · ${String(account.role || "").toUpperCase()} · ${employee.position || "No position"}`;
    const nexusRole = String(account.nexusRole || account.role || "staff").toLowerCase();
    el("nexus-role-field").hidden = !state.isSuperAdmin || account.isSuperAdmin === true;
    el("nexus-role").value = nexusRole;
    el("super-admin-note").hidden = account.isSuperAdmin !== true;
    el("coa-readonly-note").hidden = nexusRole !== "coa";
    el("nexus-admin-note").hidden = nexusRole !== "admin";
    el("application-assignment-field").style.opacity = nexusRole === "admin" ? ".58" : "1";
    el("application-assignment-field").style.pointerEvents = nexusRole === "admin" ? "none" : "auto";
    el("access-status").value = String(access.status || "ACTIVE").toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    el("access-notes").value = access.notes || "";

    el("application-options").innerHTML = state.catalog.map(app => `
      <label class="app-option">
        <input type="checkbox" value="${escapeHtml(app.code)}" ${selected.has(app.code) ? "checked" : ""}>
        <span><strong>${escapeHtml(app.code)}</strong><span>${escapeHtml(app.name)}</span></span>
      </label>
    `).join("");

    el("remove-access-button").disabled =
      account.isSuperAdmin === true ||
      nexusRole === "admin" ||
      (!access.accessId && !(Array.isArray(access.assignedApplications) && access.assignedApplications.length));

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    state.selectedUser = null;
  }

  async function saveAccess() {
    if (!state.selectedUser) return;

    const token = window.NexusSession.getToken();
    const assignedApplications = Array.from(
      el("application-options").querySelectorAll('input[type="checkbox"]:checked')
    ).map(input => input.value);

    el("save-access-button").disabled = true;

    try {
      const selectedRole = String(el("nexus-role").value || state.selectedUser.originalNexusRole).toLowerCase();
      const roleChanged =
        state.isSuperAdmin &&
        selectedRole !== state.selectedUser.originalNexusRole;

      const action = roleChanged
        ? ACTIONS.GOVERNANCE_ROLE_SAVE
        : ACTIONS.ACCESS_SAVE;

      const request = {
        token,
        accountId: state.selectedUser.account.accountId,
        assignedApplications: selectedRole === "admin" ? [] : assignedApplications,
        status: el("access-status").value,
        notes: el("access-notes").value.trim()
      };

      if (roleChanged) {
        request.nexusRole = selectedRole;
      }

      const result = await window.NexusApi.execute(action, request);

      if (!result || result.success !== true) {
        throw new Error(result?.message || "Unable to save NEXUS access.");
      }

      toast(
        roleChanged
          ? "NEXUS role and application access updated successfully."
          : "Application access saved successfully.",
        "success"
      );
      closeModal();
      await loadUsers();
    } catch (error) {
      toast(error?.message || "Unable to save access.", "error");
    } finally {
      el("save-access-button").disabled = false;
    }
  }

  async function removeAccess() {
    if (!state.selectedUser) return;
    const name = state.selectedUser.employee?.fullName || state.selectedUser.account?.username;

    if (!window.confirm(`Remove all NEXUS application assignments for ${name}?`)) return;

    el("remove-access-button").disabled = true;

    try {
      const result = await window.NexusApi.execute(ACTIONS.ACCESS_REMOVE, {
        token: window.NexusSession.getToken(),
        accountId: state.selectedUser.account.accountId
      });

      if (!result || result.success !== true) {
        throw new Error(result?.message || "Unable to remove NEXUS access.");
      }

      toast("Application assignment removed.", "success");
      closeModal();
      await loadUsers();
    } catch (error) {
      toast(error?.message || "Unable to remove access.", "error");
    } finally {
      el("remove-access-button").disabled = false;
    }
  }

  async function loadUsers() {
    el("refresh-button").disabled = true;
    try {
      const token = window.NexusSession.getToken();

      const result = await window.NexusApi.execute(ACTIONS.USERS_GET, {
        token
      });

      if (!result || result.success !== true) {
        throw new Error(result?.message || "Unable to load NEXUS users.");
      }

      state.administrator = result.administrator || null;
      state.isSuperAdmin = state.administrator?.isSuperAdmin === true;
      state.users = Array.isArray(result.users) ? result.users : [];
      state.catalog = Array.isArray(result.applicationCatalog) ? result.applicationCatalog : [];

      if (state.isSuperAdmin) {
        const governance = await window.NexusApi.execute(
          ACTIONS.GOVERNANCE_SUMMARY_GET,
          { token }
        );

        if (!governance || governance.success !== true) {
          throw new Error(governance?.message || "Unable to load NEXUS governance.");
        }

        state.governance = governance;

        const governanceByAccount = new Map(
          (governance.users || []).map(user => [
            user.account?.accountId,
            user
          ])
        );

        state.users = state.users.map(user => {
          const governed = governanceByAccount.get(user.account?.accountId);
          return governed
            ? {
                ...user,
                account: {
                  ...user.account,
                  ...governed.account
                },
                access: governed.access || user.access,
                canManageRole: governed.canManageNexusRole === true
              }
            : user;
        });
      }

      el("admin-name").textContent = state.administrator?.fullName || "Administrator";
      updateSummary();
      renderUsers();
    } catch (error) {
      console.error(error);
      toast(error?.message || "Unable to load users.", "error");
      if (/session|administrator|valid nexus/i.test(error?.message || "")) {
        redirectToLogin();
      }
    } finally {
      el("refresh-button").disabled = false;
    }
  }

  async function logout() {
    el("logout-button").disabled = true;
    const token = window.NexusSession.getToken();
    try {
      if (token) await window.NexusApi.execute(ACTIONS.LOGOUT, { token });
    } catch (error) {
      console.warn(error);
    } finally {
      window.NexusSession.clear();
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
      const authorization = await window.NexusApi.execute(ACTIONS.PORTAL_AUTHORIZE, { token });

      if (!authorization || authorization.authorized !== true || authorization.role !== "admin") {
        window.location.replace("/index.html");
        return;
      }

      document.documentElement.classList.remove("nexus-auth-pending");
      loading.hidden = true;
      await loadUsers();
    } catch (error) {
      console.error(error);
      redirectToLogin();
    }
  }

  el("refresh-button").addEventListener("click", loadUsers);
  el("back-button").addEventListener("click", () => window.location.assign("/index.html"));
  el("logout-button").addEventListener("click", logout);
  el("search-input").addEventListener("input", renderUsers);
  el("role-filter").addEventListener("change", renderUsers);
  el("access-filter").addEventListener("change", renderUsers);
  el("clear-filter").addEventListener("click", () => {
    el("search-input").value = "";
    el("role-filter").value = "";
    el("access-filter").value = "";
    renderUsers();
  });
  el("modal-close").addEventListener("click", closeModal);
  el("modal-cancel").addEventListener("click", closeModal);
  el("save-access-button").addEventListener("click", saveAccess);
  el("remove-access-button").addEventListener("click", removeAccess);
  el("nexus-role").addEventListener("change", () => {
    const role = String(el("nexus-role").value || "staff").toLowerCase();
    el("coa-readonly-note").hidden = role !== "coa";
    el("nexus-admin-note").hidden = role !== "admin";
    el("application-assignment-field").style.opacity = role === "admin" ? ".58" : "1";
    el("application-assignment-field").style.pointerEvents = role === "admin" ? "none" : "auto";
  });
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  initialize();
})();