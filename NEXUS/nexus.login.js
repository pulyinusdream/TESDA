(() => {
  "use strict";

  const ACTIONS = Object.freeze({
    LOGIN: "nexus.authentication.login",
    PORTAL_AUTHORIZE: "nexus.authorization.portal"
  });

  const form = document.getElementById("nexus-login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("login-button");
  const message = document.getElementById("login-message");
  const togglePassword = document.getElementById("toggle-password");

  function showMessage(text, type = "error") {
    message.textContent = text || "";
    message.className = `message ${type}`;
    message.hidden = !text;
  }

  function setBusy(busy) {
    submitButton.disabled = busy;
    usernameInput.disabled = busy;
    passwordInput.disabled = busy;
    submitButton.innerHTML = busy
      ? '<i class="fas fa-circle-notch fa-spin"></i> Signing in…'
      : '<i class="fas fa-right-to-bracket"></i> Sign in to NEXUS';
  }

  function getReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("returnUrl");
    if (!requested || !requested.startsWith("/") || requested.startsWith("//")) {
      return window.NEXUS_CONFIG.DEFAULT_AFTER_LOGIN;
    }
    return requested;
  }

  togglePassword.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    togglePassword.innerHTML = showing
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
    passwordInput.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showMessage("Enter both your username and password.");
      return;
    }

    setBusy(true);

    try {
      const loginResult = await window.NexusApi.execute(ACTIONS.LOGIN, {
        username,
        password,
        source: "NEXUS_FIREBASE_PORTAL",
        userAgent: navigator.userAgent
      });

      if (!loginResult || loginResult.authenticated !== true) {
        throw new Error(loginResult?.message || "Invalid username or password.");
      }

      window.NexusSession.save(loginResult);

      const authorization = await window.NexusApi.execute(ACTIONS.PORTAL_AUTHORIZE, {
        token: loginResult.token
      });

      if (!authorization || authorization.authorized !== true) {
        window.NexusSession.clear();
        throw new Error(authorization?.message || "Your account has no assigned NEXUS applications.");
      }

      showMessage("Login successful. Opening NEXUS…", "success");
      window.location.replace(getReturnUrl());
    } catch (error) {
      window.NexusSession.clear();
      showMessage(error?.message || "Unable to sign in. Please try again.");
      passwordInput.select();
    } finally {
      setBusy(false);
    }
  });

  if (window.NexusSession.isAuthenticated()) {
    window.location.replace(getReturnUrl());
  } else {
    usernameInput.focus();
  }
})();
