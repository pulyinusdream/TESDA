/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Service
 * Version 1.3.0
 * ============================================================
 *
 * Application Service
 *
 * Owns all Cart workflow.
 * Coordinates Validator, Model and Legacy Adapter.
 * Contains no UI logic.
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

    class CartService {

        constructor(model, validator, adapter) {

            this.model = model;
            this.validator = validator;
            this.adapter = adapter;

        }

        /**
         * Add an item to the cart.
         * @param {Object} item
         * @returns {Boolean}
         */
        add(item) {

            TAESF.Core.Logger.info(
                "[Cart Service] add()"
            );

            if (!this.validator.validateItem(item)) {

                throw new Error("Invalid cart item.");

            }

            if (!this.validator.validateQuantity(item.req)) {
                throw new Error("Invalid quantity.");

            }

            this.model.addItem(item);

            this.adapter.sync(this.model);

            return true;

        }

        /**
         * Remove item by Stock Number
         */
        remove(stockNo) {

            this.model.removeItem(stockNo);

            this.adapter.sync(this.model);

        }

        /**
         * Update requested quantity
         */
        updateQuantity(stockNo, quantity) {

            if (!this.validator.validateQuantity(quantity)) {

                throw new Error("Invalid quantity.");

            }

            this.model.updateQuantity(
                stockNo,
                quantity
            );

            this.adapter.sync(this.model);

        }

        /**
         * Clear entire cart
         */
        clear() {

            this.model.clear();

            this.adapter.sync(this.model);

        }

        /**
         * Returns current items
         */
        getItems() {

            return this.model.getItems();

        }

        /**
         * Returns one item
         */
        getItem(stockNo) {

            return this.model.getItem(stockNo);

        }

        /**
         * Check if item exists
         */
        hasItem(stockNo) {

            return this.model.hasItem(stockNo);

        }

        /**
         * Number of cart lines
         */
        getCount() {

            return this.model.getCount();

        }

        /**
         * Total requested quantity
         */
        getTotalRequestedQuantity() {

            return this.model.getTotalRequestedQuantity();

        }

        /**
         * Replace model contents from legacy cart.
         * Used only during migration.
         */
        loadLegacyCart() {

            const items = this.adapter.loadCart();

            this.model.clear();

            items.forEach(item => {

                this.model.addItem(item);

            });

        }

    }

    global.TAESF.Applications
        .AIMS
        .RIS
        .Features
        .Cart
        .Service = CartService;

})(window);