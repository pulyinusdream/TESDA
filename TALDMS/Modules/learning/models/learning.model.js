"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Learning Event Domain Model
 *
 * Business Sprint : B2.1
 *
 * Responsibility
 * - Defines the Learning Event Business Object
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Learning = TAESF.Modules.Learning || {};

TAESF.Modules.Learning.Model = (() => {

    function create() {

        return {

            /*
            ==================================================
            Identity
            ==================================================
            */

            learningId: "",

            employeeNumber: "",

            /*
            ==================================================
            Training Information
            ==================================================
            */

            trainingTitle: "",

            provider: "",

            trainingType: "",

            competencyArea: "",

            fundingSource: "",

            /*
            ==================================================
            Schedule
            ==================================================
            */

            trainingYear: "",

            startDate: "",

            endDate: "",

            trainingHours: 0,

            /*
            ==================================================
            Monitoring
            ==================================================
            */

            trainingStatus: "Completed",

            linkedWDP: "",

            linkedTDOR: "",

            linkedTREAP: "",

            /*
            ==================================================
            Certificate
            ==================================================
            */

            certificateNumber: "",

            /*
            ==================================================
            Remarks
            ==================================================
            */

            remarks: "",

            /*
            ==================================================
            System
            ==================================================
            */

            active: true,

            createdDate: null,

            modifiedDate: null

        };

    }

    return Object.freeze({

        create

    });

})();