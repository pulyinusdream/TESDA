/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - Supply Feature
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

"use strict";

global.TAESF = global.TAESF || {};
global.TAESF.Applications = global.TAESF.Applications || {};
global.TAESF.Applications.AIMS =
    global.TAESF.Applications.AIMS || {};
global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};
global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};
global.TAESF.Applications.AIMS.RIS.Features.Supply =
    global.TAESF.Applications.AIMS.RIS.Features.Supply || {};

class SupplyFeature {

    constructor() {

        this.model =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Supply
                .SupplyModel();

        this.service =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Supply
                .SupplyService();

        this.controller =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Supply
                .SupplyController(
                    this.service
                );

        // View will be attached in the next sprint.
        this.view =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Supply
                .SupplyView();

    }

}

global.TAESF
.Applications
.AIMS
.RIS
.Features
.Supply
.SupplyFeature =
SupplyFeature;

})(window);