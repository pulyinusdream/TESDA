/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - Supply Service
 * Version 2.0.0
 * Sprint 4.2.1
 * Enterprise Data Source Migration
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

class SupplyService {

    constructor() {

        this.model =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Supply
                .SupplyModel();

        this.lifecycle =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .Request
                .LifecycleService();

    }

    /**
     * --------------------------------------------------------
     * Enterprise Data Source
     * --------------------------------------------------------
     */

    getRequests() {

        return RisService.getAll() || [];

    }

    /**
     * --------------------------------------------------------
     * Convert Enterprise Documents into Supply Queue
     * --------------------------------------------------------
     */

    getQueue(requests = null) {

        const source =
            requests || this.getRequests();

        return source.map(request =>
            this.model.create(request)
        );

    }

    /**
     * --------------------------------------------------------
     * Pending Supply Queue
     * --------------------------------------------------------
     */

    getPendingQueue(requests = null) {

        return this
            .getQueue(requests)
            .filter(item =>
                item.availableAction !== ""
            );

    }

    /**
     * --------------------------------------------------------
     * Dashboard Statistics
     * --------------------------------------------------------
     */

    getStatistics() {

        return RisService.statistics();

    }

    /**
     * --------------------------------------------------------
     * Workflow
     * --------------------------------------------------------
     */

    verify(request, user) {

        return this.lifecycle.verify(
            request,
            user
        );

    }

    reserve(request, user) {

        return this.lifecycle.reserve(
            request,
            user
        );

    }

    issue(request, user) {

        return this.lifecycle.issue(
            request,
            user
        );

    }

}

global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .Supply
    .SupplyService =
    SupplyService;

})(window);