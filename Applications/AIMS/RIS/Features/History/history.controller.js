/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - History Controller
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
global.TAESF.Applications.AIMS.RIS.Features.History =
    global.TAESF.Applications.AIMS.RIS.Features.History || {};

class HistoryController {

    constructor(service){

        this.service = service;

    }

    add(entry){

        return this.service.add(entry);

    }

    getAll(){

        return this.service.getAll();

    }

    getByRIS(risNo){

        return this.service.getByRIS(risNo);

    }

    clear(){

        this.service.clear();

    }

}

global.TAESF
.Applications
.AIMS
.RIS
.Features
.History
.HistoryController =
HistoryController;

})(window);