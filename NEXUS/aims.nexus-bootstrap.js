/**
 * ==========================================================
 * NEXUS AIMS Authorization Bootstrap
 * Version: 1.0.0
 * ==========================================================
 *
 * AIMS-specific bootstrap that avoids dependence on the
 * shared NexusApi response parser.
 * ==========================================================
 */

(() => {

  "use strict";

  const ACTION =
    "nexus.authorization.application";

  const APPLICATION_CODE =
    "AIMS";

  const LOGIN_PAGE =
    "/login.html";

  const PORTAL_PAGE =
    "/index.html";


  function normalize(
    value
  ) {

    return String(
      value === null ||
      value === undefined
        ? ""
        : value
    ).trim();

  }


  function getToken() {

    if (
      window.NexusSession &&
      typeof window.NexusSession.getToken ===
        "function"
    ) {

      return normalize(
        window.NexusSession.getToken()
      );

    }

    return normalize(
      sessionStorage.getItem(
        "tesda_albay_nexus_token"
      )
    );

  }


  function parseJsonRepeatedly(
    value,
    maximumDepth = 4
  ) {

    let current =
      value;

    for (
      let depth = 0;
      depth < maximumDepth;
      depth += 1
    ) {

      if (
        typeof current !==
          "string"
      ) {

        break;

      }

      const trimmed =
        current.trim();

      if (
        !trimmed ||
        (
          !trimmed.startsWith("{") &&
          !trimmed.startsWith("[")
        )
      ) {

        break;

      }

      try {

        current =
          JSON.parse(
            trimmed
          );

      }
      catch (error) {

        break;

      }

    }

    return current;

  }


  function unwrapBackendResponse(
    responseText
  ) {

    let value =
      parseJsonRepeatedly(
        responseText
      );

    for (
      let depth = 0;
      depth < 5;
      depth += 1
    ) {

      if (
        !value ||
        typeof value !==
          "object"
      ) {

        break;

      }

      /*
       * Standard TAESF success envelope.
       */
      if (
        value.success === true ||
        value.success === "true"
      ) {

        if (
          Object.prototype.hasOwnProperty.call(
            value,
            "data"
          )
        ) {

          value =
            parseJsonRepeatedly(
              value.data
            );

          continue;

        }

        /*
         * Direct successful command result.
         */
        if (
          value.authorized !==
            undefined ||
          value.authenticated !==
            undefined ||
          value.result
        ) {

          return value;

        }

      }

      /*
       * Some wrappers use result, payload, response or body.
       */
      const wrapperKeys = [
        "result",
        "payload",
        "response",
        "body"
      ];

      const wrapperKey =
        wrapperKeys.find(
          key =>
            Object.prototype.hasOwnProperty.call(
              value,
              key
            ) &&
            (
              typeof value[key] === "object" ||
              typeof value[key] === "string"
            )
        );

      if (wrapperKey) {

        value =
          parseJsonRepeatedly(
            value[wrapperKey]
          );

        continue;

      }

      break;

    }

    return value;

  }


  function showDiagnostic(
    title,
    message,
    details = ""
  ) {

    document.documentElement.classList.remove(
      "nexus-app-auth-pending"
    );

    const existing =
      document.getElementById(
        "aims-nexus-diagnostic"
      );

    if (existing) {

      existing.remove();

    }

    const panel =
      document.createElement(
        "div"
      );

    panel.id =
      "aims-nexus-diagnostic";

    panel.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "display:grid",
      "place-items:center",
      "padding:24px",
      "background:linear-gradient(135deg,#0f172a,#003399)",
      "font-family:Segoe UI,Arial,sans-serif"
    ].join(";");

    panel.innerHTML =
      '<div style="width:min(720px,96vw);background:#fff;border-radius:18px;padding:26px;box-shadow:0 24px 70px #0008;color:#172033">' +
        '<h2 style="margin:0 0 10px;color:#b42318">' +
          escapeHtml(title) +
        '</h2>' +
        '<p style="line-height:1.55;margin:0 0 14px">' +
          escapeHtml(message) +
        '</p>' +
        (
          details
            ? '<pre style="white-space:pre-wrap;max-height:260px;overflow:auto;background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px;font-size:12px">' +
                escapeHtml(details) +
              '</pre>'
            : ""
        ) +
        '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px">' +
          '<button id="aimsNexusBack" style="border:1px solid #cbd5e1;background:#fff;border-radius:9px;padding:10px 14px;font-weight:800;cursor:pointer">Back to NEXUS</button>' +
          '<button id="aimsNexusRetry" style="border:0;background:#003399;color:#fff;border-radius:9px;padding:10px 14px;font-weight:800;cursor:pointer">Retry</button>' +
        '</div>' +
      '</div>';

    document.documentElement.appendChild(
      panel
    );

    document
      .getElementById(
        "aimsNexusBack"
      )
      .addEventListener(
        "click",
        () =>
          window.location.assign(
            PORTAL_PAGE
          )
      );

    document
      .getElementById(
        "aimsNexusRetry"
      )
      .addEventListener(
        "click",
        () =>
          window.location.reload()
      );

  }


  function escapeHtml(
    value
  ) {

    return normalize(
      value
    ).replace(
      /[&<>"']/g,
      character =>
        ({

          "&":
            "&amp;",

          "<":
            "&lt;",

          ">":
            "&gt;",

          '"':
            "&quot;",

          "'":
            "&#039;"

        })[character]
    );

  }


  function publishAuthorization(
    authorization
  ) {

    const context =
      Object.freeze({

        applicationCode:
          normalize(
            authorization.applicationCode
          ) ||
          APPLICATION_CODE,

        account:
          authorization.account ||
          null,

        employee:
          authorization.employee ||
          null,

        role:
          normalize(
            authorization.role
          ).toLowerCase(),

        readOnly:
          authorization.readOnly === true,

        access:
          authorization.access ||
          null,

        authorizedAt:
          authorization.authorizedAt ||
          new Date().toISOString()

      });

    window.NEXUS_APP_CONTEXT =
      context;

    window.dispatchEvent(
      new CustomEvent(
        "nexus:application-authorized",
        {

          detail:
            context

        }
      )
    );

    document.documentElement.classList.remove(
      "nexus-app-auth-pending"
    );

    console.log(
      "[AIMS NEXUS BOOTSTRAP] Authorized:",
      context
    );

  }


  async function authorize() {

    const token =
      getToken();

    if (!token) {

      window.location.replace(
        LOGIN_PAGE +
        "?returnUrl=" +
        encodeURIComponent(
          window.location.pathname
        )
      );

      return;

    }

    const config =
      window.NEXUS_CONFIG;

    if (
      !config ||
      !config.API_URL
    ) {

      showDiagnostic(
        "NEXUS configuration is missing",
        "AIMS could not find the NEXUS backend URL."
      );

      return;

    }

    try {

      const response =
        await fetch(
          config.API_URL,
          {

            method:
              "POST",

            redirect:
              "follow",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify({

                action:
                  ACTION,

                token:
                  token,

                applicationCode:
                  APPLICATION_CODE

              })

          }
        );

      const responseText =
        await response.text();

      console.log(
        "[AIMS NEXUS BOOTSTRAP] Raw response:",
        {

          status:
            response.status,

          url:
            response.url,

          responseText:
            responseText

        }
      );

      const result =
        unwrapBackendResponse(
          responseText
        );

      console.log(
        "[AIMS NEXUS BOOTSTRAP] Parsed result:",
        result
      );

      if (
        result &&
        result.authorized === true
      ) {

        publishAuthorization(
          result
        );

        return;

      }

      if (
        result &&
        result.authenticated === false
      ) {

        if (
          window.NexusSession &&
          typeof window.NexusSession.clear ===
            "function"
        ) {

          window.NexusSession.clear();

        }

        window.location.replace(
          LOGIN_PAGE +
          "?returnUrl=" +
          encodeURIComponent(
            window.location.pathname
          )
        );

        return;

      }

      showDiagnostic(
        "AIMS authorization was not accepted",
        result &&
        result.message
          ? result.message
          : "The backend response did not contain an authorized AIMS result.",
        JSON.stringify(
          result,
          null,
          2
        )
      );

    }
    catch (error) {

      console.error(
        "[AIMS NEXUS BOOTSTRAP] Failed:",
        error
      );

      showDiagnostic(
        "Unable to verify AIMS access",
        error &&
        error.message
          ? error.message
          : "AIMS could not reach the NEXUS backend."
      );

    }

  }


  /*
   * Hide the legacy AIMS login while NEXUS authorization is
   * being resolved.
   */
  const style =
    document.createElement(
      "style"
    );

  style.textContent =
    "html.nexus-app-auth-pending body{visibility:hidden!important}";

  document.head.appendChild(
    style
  );

  authorize();

})();
