"use strict";

/**
 * ==========================================================
 * TAECP Framework Test Harness
 * ==========================================================
 */

(function () {

    const results = document.getElementById("results");

    function pass(message) {

        const div = document.createElement("div");

        div.textContent = "✅ " + message;

        results.appendChild(div);

    }

    function fail(message, error) {

        const div = document.createElement("div");

        div.textContent = "❌ " + message;

        div.style.color = "red";

        results.appendChild(div);

        console.error(error);

    }

    try {

        if (window.TAESF) {

            pass("Enterprise Namespace Loaded");

        }

    } catch (error) {

        fail("Namespace Failed", error);

    }

    try {

    console.log("Configuration Object:", TAESF.Configuration);

    console.log("Version:", TAESF.Configuration.Version);

    if (TAESF.Configuration &&
        TAESF.Configuration.Version) {

        pass("Configuration Loaded");

    } else {

        fail("Configuration Object Missing");

    }

} catch (error) {

    fail("Configuration Failed", error);

}

    try {

    console.log("Manifest:", TAESF.Core.Manifest);

    if (TAESF.Core &&
        TAESF.Core.Manifest) {

        pass("Manifest Loaded");

    } else {

        fail("Manifest Missing");

    }

} catch (error) {

    fail("Manifest Failed", error);

}

    try {

        if (TAESF.Core.Registry) {

            pass("Registry Loaded");

        }

    } catch (error) {

        fail("Registry Failed", error);

    }

    try {

        if (TAESF.Services.Logger) {

            pass("Logger Loaded");

        }

    } catch (error) {

        fail("Logger Failed", error);

    }

    try {

        if (TAESF.Services.Storage) {

            pass("Storage Loaded");

        }

    } catch (error) {

        fail("Storage Failed", error);

    }
    try {

    if (TAESF.Services.Session) {

        pass("Session Loaded");

    }

    } catch (error) {

        fail("Session Failed", error);

    }

    try {

        if (TAESF.Services.Authentication) {

            pass("Authentication Loaded");

        }

    } catch (error) {

        fail("Authentication Failed", error);

    }

    try {

        if (TAESF.Core.Application) {

            pass("Application Loaded");

        }

    } catch (error) {

        fail("Application Failed", error);

    }

    try {

        TAESF.Core.Bootstrap.run();

        pass("Bootstrap Executed");

    } catch (error) {

        fail("Bootstrap Failed", error);

    }

})();