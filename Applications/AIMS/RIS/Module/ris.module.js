/**
 * ============================================================
 * TAESF Enterprise Framework
 * ------------------------------------------------------------
 * Application : AIMS
 * Module      : RIS Module
 * Version     : 1.0.0
 * Sprint      : 1.1
 * ============================================================
 */

(function (global) {

    "use strict";

    global.TAESF = global.TAESF || {};
    global.TAESF.Applications =
        global.TAESF.Applications || {};

    global.TAESF.Applications.AIMS =
        global.TAESF.Applications.AIMS || {};

    class RISModule extends TAESF.Application.BaseModule {

    constructor() {

            super({

                id: "ris",

                name: "Requisition and Issue Slip",

                version: "1.0.0",

                dependencies: []

            });

            this.features = Object.create(null);

            this.controller =
                new TAESF.Applications.AIMS.RISController(this);

            this.view =
                new TAESF.Applications.AIMS.RISView(this);

        }

       initialize() {

            TAESF.Core.Logger.info("[RIS] initialize()");

            // --------------------------------------------------
            // Register Cart Feature
            // --------------------------------------------------

            if (!this.hasFeature("cart")) {

                const cartFeature =
                    new TAESF.Applications
                        .AIMS
                        .RIS
                        .Features
                        .Cart
                        .Feature();

                this.registerFeature(
                    "cart",
                    cartFeature
                );

            }

            // --------------------------------------------------
            // Register Request Feature
            // --------------------------------------------------

            if (!this.hasFeature("request")) {

                const requestFeature =
                    new TAESF.Applications
                        .AIMS
                        .RIS
                        .Features
                        .Request
                        .Feature();

                this.registerFeature(
                    "request",
                    requestFeature
                );

            }

            // --------------------------------------------------
            // Register Supply Feature
            // --------------------------------------------------

            if (!this.hasFeature("supply")) {

                const supplyFeature =
                    new TAESF
                        .Applications
                        .AIMS
                        .RIS
                        .Features
                        .Supply
                        .SupplyFeature();

                this.registerFeature(
                    "supply",
                    supplyFeature
                );

            }
            // --------------------------------------------------
            // Register History Feature
            // --------------------------------------------------

            if (!this.hasFeature("history")) {

                const historyFeature =
                    new TAESF
                        .Applications
                        .AIMS
                        .RIS
                        .Features
                        .History
                        .HistoryFeature();

                this.registerFeature(
                    "history",
                    historyFeature
                );

            }
            return true;

        }

        load() {

            TAESF.Core.Logger.info("[RIS] load()");

            return true;

        }

        render() {

            TAESF.Core.Logger.info("[RIS] render()");

            return this.view;

        }

        refresh() {

            TAESF.Core.Logger.info("[RIS] refresh()");

            this.controller.refresh();

            return true;

        }

        destroy() {

            TAESF.Core.Logger.info("[RIS] destroy()");

            return true;

        }

        getController() {

            return this.controller;

        }

        getView() {

            return this.view;

        }
        registerFeature(name, feature) {

            if (!name)
                throw new Error("Feature name is required.");

            if (!feature)
                throw new Error("Feature instance is required.");

            if (this.hasFeature(name))
                throw new Error(
                    "Feature '" + name + "' already exists."
                );

            this.features[name] = feature;

            TAESF.Core.Logger.info(
                "[RIS] Feature Registered : " + name
            );

            return feature;

        }

        getFeature(name) {

            return this.features[name];

        }

        hasFeature(name) {

            return Object.prototype.hasOwnProperty.call(
                this.features,
                name
            );

        }

        getFeatures() {

            return Object.freeze(
                Object.assign({}, this.features)
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Public Module API
        |--------------------------------------------------------------------------
        */

        addToCart() {

            return this.controller.addToCart();

        }

    }

    global.TAESF.Applications.AIMS.RISModule =
        RISModule;

})(window);