/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS RIS - Supply Model
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

class SupplyModel {

    create(request = {}) {

        return {

            risNo:
                request.risNo || "",

            requestedBy:
                request.requestedBy || "",

            division:
                request.division || "",

            office:
                request.office || "",

            purpose:
                request.purpose || "",

            status:
                request.status || "DRAFT",

            availableAction:
                this.getAvailableAction(
                    request.status || "DRAFT"
                )

        };

    }

    getAvailableAction(status) {

        switch (status) {

            case "SUBMITTED":
                return "VERIFY";

            case "APPROVED":
                return "RESERVE";

            case "RESERVED":
                return "ISSUE";

            default:
                return "";

        }

    }

}

global.TAESF
.Applications
.AIMS
.RIS
.Features
.Supply
.SupplyModel =
SupplyModel;

})(window);