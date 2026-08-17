"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * Workspace Manager
 *
 * Responsibility
 * - Manage the central application workspace
 * - Load views
 * - Clear views
 * - Prevent business modules from manipulating the DOM
 * ==========================================================
 */

TAESF.Core = TAESF.Core || {};

TAESF.Core.Workspace = (() => {

    function load(html) {

        const workspace = document.getElementById(

            "applicationWorkspace"

        );

        if (!workspace) {

            console.error(

                "[TAECP] Application workspace not found."

            );

            return;

        }

        workspace.innerHTML = html;

    }

    function clear() {

        load("");

    }

    return Object.freeze({

        load,

        clear

    });

})();