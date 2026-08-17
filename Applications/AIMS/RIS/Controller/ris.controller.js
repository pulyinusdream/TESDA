/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Controller
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

    "use strict";

    class RISController {

        constructor(module) {

            this.module = module;

        }

        showStaffRIS() {

            if (typeof global.nav === "function") {

                global.nav("staffRIS");

            }

        }

        showSupplyRIS() {

            if (typeof global.nav === "function") {

                global.nav("supplyRIS");

            }

        }

        generateRIS() {

            if (typeof global.generateRIS === "function") {

                return global.generateRIS();

            }

        }

        addToCart() {

            TAESF.Core.Logger.info(
                "[RIS Controller] addToCart()"
            );

            const cartFeature =
                this.module.getFeature("cart");

            if (!cartFeature) {

                throw new Error(
                    "Cart Feature is not registered."
                );

            }

            return cartFeature.add();

        }

        refresh() {

            if (typeof global.refreshAll === "function") {

                global.refreshAll();

            }

        }

    }

    global.TAESF =
        global.TAESF || {};

    global.TAESF.Applications =
        global.TAESF.Applications || {};

    global.TAESF.Applications.AIMS =
        global.TAESF.Applications.AIMS || {};

    global.TAESF.Applications.AIMS.RISController =
        RISController;

})(window);