/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - Supply Controller
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

class SupplyController {

    constructor(service){

        this.service = service;

    }

    getQueue(requests){

        return this.service.getQueue(requests);

    }

    getPendingQueue(requests){

        return this.service.getPendingQueue(requests);

    }

    verify(request,user){

        return this.service.verify(request,user);

    }

    reserve(request,user){

        return this.service.reserve(request,user);

    }

    issue(request,user){

        return this.service.issue(request,user);

    }

}

global.TAESF
.Applications
.AIMS
.RIS
.Features
.Supply
.SupplyController =
SupplyController;

})(window);