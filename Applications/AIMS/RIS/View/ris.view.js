/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS View
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

    "use strict";

    class RISView {

        showStaff() {

            if (typeof global.nav === "function") {

                global.nav("staffRIS");

            }

        }

        showSupply() {

            if (typeof global.nav === "function") {

                global.nav("supplyRIS");

            }

        }

    }

    global.TAESF =
        global.TAESF || {};

    global.TAESF.Applications =
        global.TAESF.Applications || {};

    global.TAESF.Applications.AIMS =
        global.TAESF.Applications.AIMS || {};

    global.TAESF.Applications.AIMS.RISView =
        RISView;

})(window);