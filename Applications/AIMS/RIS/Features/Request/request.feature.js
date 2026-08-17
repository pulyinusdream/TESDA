/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request Feature
 * Version 1.0.0
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

    global.TAESF.Applications.AIMS.RIS.Features.Request =
        global.TAESF.Applications.AIMS.RIS.Features.Request || {};

    class RequestFeature {

        constructor() {

            this.model =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Request
                    .Model();

            this.validator =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Request
                    .Validator();

            this.service =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Request
                    .Service(
                        this.model,
                        this.validator
                    );

            this.controller =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Request
                    .Controller(
                        this.service
                    );

            this.view =
                new global.TAESF.Applications
                    .AIMS
                    .RIS
                    .Features
                    .Request
                    .View(
                        this.controller
                    );

        }

        createRequest(header, cartItems) {

            return this.controller.createRequest(
                header,
                cartItems
            );

        }

        getRequest() {

            return this.controller.getRequest();

        }

        reset() {

            return this.controller.reset();

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
        .Request
        .Feature = RequestFeature;

})(window);