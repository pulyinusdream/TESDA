"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Employee Domain Model
 *
 * Domain Model:
 * EMP-DM1
 *
 * Responsibility
 * - Defines the Employee Business Object
 * - Serves as the canonical Employee structure
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Employee = TAESF.Modules.Employee || {};

TAESF.Modules.Employee.Model = (() => {

    function create() {

        return {

            /*
            ==================================================
            Identity
            ==================================================
            */

            employeeNumber: "",

            lastName: "",

            firstName: "",

            middleName: "",

            extensionName: "",

            birthDate: "",

            sex: "",

            civilStatus: "",

            /*
            ==================================================
            Employment
            ==================================================
            */

            employmentStatus: "Permanent",

            position: "",

            plantillaItemNumber: "",

            salaryGrade: "",

            office: "",

            division: "",

            section: "",

            dateHired: "",

            /*
            ==================================================
            Competency
            ==================================================
            */

            eligibility: "",

            highestEducationalAttainment: "",

            competencyProfile: "",

            supervisoryLevel: "",

            immediateSupervisor: "",

            /*
            ==================================================
            TESDA Qualifications
            ==================================================
            */

            ncCertificates: [],

            tmCertificates: [],

            /*
            ==================================================
            Contact
            ==================================================
            */

            email: "",

            mobileNumber: "",

            /*
            ==================================================
            System
            ==================================================
            */

            status: "Active",

            active: true,

            createdDate: null,

            modifiedDate: null

        };

    }

    return Object.freeze({

        create

    });

})();