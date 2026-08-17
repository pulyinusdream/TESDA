/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Legacy Cart Adapter
 * Version 1.3.0
 * ============================================================
 *
 * Compatibility Layer
 *
 * Synchronizes the TAESF CartModel with the existing
 * legacy RIS user interface.
 *
 * This adapter is temporary and will be removed once
 * the UI is fully migrated to TAESF.
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Applications = global.TAESF.Applications || {};
    global.TAESF.Applications.AIMS = global.TAESF.Applications.AIMS || {};
    global.TAESF.Applications.AIMS.RIS =
        global.TAESF.Applications.AIMS.RIS || {};

    global.TAESF.Applications.AIMS.RIS.Legacy =
        global.TAESF.Applications.AIMS.RIS.Legacy || {};

    class LegacyCartAdapter {

        constructor() {

            if (!global.cart) {
                global.cart = [];
            }

        }

        loadCart() {

            return Array.isArray(global.cart)
                ? global.cart
                : [];

        }

        saveCart(items) {

            global.cart = JSON.parse(
                JSON.stringify(items)
            );

        }

        render() {

            if (typeof global.renderCart === "function") {

                global.renderCart();

            }

        }

        sync(model) {

            this.saveCart(model.getItems());

            this.render();

        }

        legacyAdd() {

            if (typeof global.addToCart === "function") {

                return global.addToCart();

            }

            throw new Error(
                "Legacy addToCart() was not found."
            );

        }

    }

    global.TAESF.Applications.AIMS.RIS.Legacy.CartAdapter =
        LegacyCartAdapter;

})(window);