/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - History Feature
 * Version 1.0.0
 * ============================================================
 */

(function(global){

"use strict";

global.TAESF = global.TAESF || {};
global.TAESF.Applications = global.TAESF.Applications || {};
global.TAESF.Applications.AIMS =
    global.TAESF.Applications.AIMS || {};
global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};
global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};
global.TAESF.Applications.AIMS.RIS.Features.History =
    global.TAESF.Applications.AIMS.RIS.Features.History || {};

class HistoryFeature {

    constructor(){

        this.service =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .History
                .HistoryService();

        this.controller =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .History
                .HistoryController(
                    this.service
                );

    }

}

global.TAESF
.Applications
.AIMS
.RIS
.Features
.History
.HistoryFeature =
HistoryFeature;

})(window);