/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - History Model
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

class HistoryModel {

    create(data = {}) {

        return {

            historyId:
                data.historyId ||
                crypto.randomUUID(),

            risNo:
                data.risNo || "",

            action:
                data.action || "",

            previousStatus:
                data.previousStatus || "",

            newStatus:
                data.newStatus || "",

            performedBy:
                data.performedBy || "",

            performedDate:
                data.performedDate ||
                new Date().toISOString(),

            remarks:
                data.remarks || ""

        };

    }

}

global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .History
    .HistoryModel = HistoryModel;

})(window);