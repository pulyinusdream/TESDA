"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Workforce Development Plan Model
 *
 * Sprint:
 * W1.1
 *
 * Responsibility
 * - Create WDP Header Object
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP =
    TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.Model = (() => {

    function create(data = {}) {

        const startYear =
            Number(data.startYear ?? new Date().getFullYear());

        const endYear =
            Number(data.endYear ?? startYear);

        return {

            /*
            ======================================
            Enterprise Key
            ======================================
            */

            planId:
                data.planId ?? crypto.randomUUID(),

            /*
            ======================================
            Business Number
            ======================================
            */

            wdpNumber:
                data.wdpNumber ?? "",

            /*
            ======================================
            Planning
            ======================================
            */

            planningCycle:
                `${startYear}-${endYear}`,

            startYear,

            endYear,

            /*
            ======================================
            Office
            ======================================
            */

            office:
                data.office ?? "",

            /*
            ======================================
            Signatories
            ======================================
            */

            preparedBy:
                data.preparedBy ?? "",

            preparedPosition:
                data.preparedPosition ?? "",

            approvedBy:
                data.approvedBy ?? "",

            approvedPosition:
                data.approvedPosition ?? "",

            approvalDate:
                data.approvalDate ?? "",

            /*
            ======================================
            Status
            ======================================
            */

            status:
                data.status ?? "Draft",

            remarks:
                data.remarks ?? "",

            /*
            ======================================
            Audit
            ======================================
            */

            createdDate:
                data.createdDate ??
                new Date().toISOString(),

            updatedDate:
                data.updatedDate ??
                new Date().toISOString()

        };

    }

    return Object.freeze({

        create

    });

})();