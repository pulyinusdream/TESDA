/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart View
 * Version 1.3.0
 * ============================================================
 *
 * View Layer
 *
 * Responsible ONLY for refreshing the legacy UI.
 * Contains no business logic.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Applications = global.TAESF.Applications || {};
    global.TAESF.Applications.AIMS = global.TAESF.Applications.AIMS || {};
    global.TAESF.Applications.AIMS.RIS =
        global.TAESF.Applications.AIMS.RIS || {};
    global.TAESF.Applications.AIMS.RIS.Features =
        global.TAESF.Applications.AIMS.RIS.Features || {};
    global.TAESF.Applications.AIMS.RIS.Features.Cart =
        global.TAESF.Applications.AIMS.RIS.Features.Cart || {};

    class CartView {

        constructor(controller) {

            this.controller = controller;

        }

        refresh() {

            if (typeof global.renderCart === "function") {

                global.renderCart();

            }

        }

    }

    global.TAESF.Applications
        .AIMS
        .RIS
        .Features
        .Cart
        .View = CartView;

})(window);