/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Validator
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
    // Cart Validator
    // ==========================================================

    class CartValidator {

        validateQuantity(quantity) {

            return Number(quantity) > 0;

        }

        validateItem(item) {

            return !!(
                item &&
                item.id &&
                item.stock &&
                item.desc &&
                item.unit
            );

        }

    }

    // ==========================================================
    // Export
    // ==========================================================

    global.TAESF.Applications.AIMS.RIS.Features.Cart.Validator =
        CartValidator;

})(window);