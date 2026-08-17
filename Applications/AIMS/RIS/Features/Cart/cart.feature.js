/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Feature
 * Version 1.3.0
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

    class CartFeature {

        constructor() {

            this.model =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Model();

            this.validator =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Validator();

            this.adapter =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Legacy
                    .CartAdapter();

            this.service =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Service(

                        this.model,

                        this.validator,

                        this.adapter

                    );

            this.controller =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Controller(
                        this.service
                    );

            this.view =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .View(
                        this.controller
                    );

        }

        add(item) {

            return this.controller.add(item);

        }

        clear() {

            return this.controller.clear();

        }

        getItems() {

            return this.service.getItems();

        }

        getController() {

            return this.controller;

        }

        getService() {

            return this.service;

        }

        getModel() {

            return this.model;

        }

        getView() {

            return this.view;

        }

    }

    global.TAESF.Applications
        .AIMS
        .RIS
        .Features
        .Cart
        .Feature = CartFeature;

})(window);