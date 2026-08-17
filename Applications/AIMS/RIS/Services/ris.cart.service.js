/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Public Service
 * Version 2.0.0
 * ============================================================
 *
 * Public API
 *
 * Existing application code should ONLY use this service.
 *
 * Internally delegates to the TAESF Cart Feature.
 * ============================================================
 */

(function (global) {

    "use strict";

    let feature = null;

    function getFeature() {

        if (!feature) {

            feature =
                new global.TAESF
                    .Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Feature();

        }

        return feature;

    }

    global.RisCartService = {

        addItem(item) {

            return getFeature().add(item);

        },

        removeItem(stockNo) {

            return getFeature()
                .getService()
                .remove(stockNo);

        },

        updateQuantity(stockNo, qty) {

            return getFeature()
                .getService()
                .updateQuantity(
                    stockNo,
                    qty
                );

        },

        clear() {

            return getFeature().clear();

        },

        getItems() {

            return getFeature().getItems();

        },

        getCount() {

            return getFeature()
                .getService()
                .getCount();

        },

        getTotalRequestedQuantity() {

            return getFeature()
                .getService()
                .getTotalRequestedQuantity();

        },

        getFeature() {

            return getFeature();

        }

    };

})(window);