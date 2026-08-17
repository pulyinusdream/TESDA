/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - History Service
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

class HistoryService {
    
    constructor() {

        if (HistoryService.instance) {

            return HistoryService.instance;

        }

        this.model =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .History
                .HistoryModel();

        this.records = [];

        HistoryService.instance = this;

    }

    add(data) {

        const record =
            this.model.create(data);

        this.records.push(record);

        return {

            success: true,

            record

        };

    }

    getAll() {

        return [...this.records];

    }

    getByRIS(risNo) {

        return this.records.filter(r =>
            r.risNo === risNo
        );

    }

    clear() {

        this.records = [];

    }

}
HistoryService.instance = null;
global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .History
    .HistoryService =
        HistoryService;

})(window);