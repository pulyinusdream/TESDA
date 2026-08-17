/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Controller
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

    "use strict";

    // ==========================================================
    // Namespace
    // ==========================================================

    global.TAESF = global.TAESF || {};
    global.TAESF.Applications = global.TAESF.Applications || {};
    global.TAESF.Applications.AIMS = global.TAESF.Applications.AIMS || {};
    global.TAESF.Applications.AIMS.RIS =
        global.TAESF.Applications.AIMS.RIS || {};
    global.TAESF.Applications.AIMS.RIS.Features =
        global.TAESF.Applications.AIMS.RIS.Features || {};
    global.TAESF.Applications.AIMS.RIS.Features.Cart =
        global.TAESF.Applications.AIMS.RIS.Features.Cart || {};

    // ==========================================================
    // Cart Controller
    // ==========================================================

    class CartController {

        constructor(service) {

            this.service = service;

        }

        add(item) {

            return this.service.add(item);

        }

        clear() {

            return this.service.clear();

        }

    }

    // ==========================================================
    // Export
    // ==========================================================

    global.TAESF.Applications.AIMS.RIS.Features.Cart.Controller =
        CartController;

})(window);