"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Workforce Plan Activity Model
 *
 * Feature:
 * WDP-A001
 *
 * Responsibility
 * - Create Strategic Activity Object
 * - Default Values
 * - No Business Logic
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.ActivityModel = (() => {

    function create(data = {}) {

        const now = new Date().toISOString();

        return {

            activityId:

                crypto.randomUUID(),

            planId:

                data.planId ?? "",

            category:

                data.category ?? "TECHNICAL",
            
            strategicClassification:

                data.strategicClassification ??

                "TECHNICAL",

            trainingGap:

                data.trainingGap ?? "",

            trainingCourse:

                data.trainingCourse ?? "",

            startYear:

                data.startYear ?? new Date().getFullYear(),

            endYear:

                data.endYear ?? new Date().getFullYear(),

            implementationFrequency:

                data.implementationFrequency ?? "ANNUAL",

            estimatedDays:

                Number(data.estimatedDays ?? 1),

            estimatedParticipants:

                Number(data.estimatedParticipants ?? 1),

            estimatedBudget:

                Number(data.estimatedBudget ?? 0),

            modeOfTraining:

                data.modeOfTraining ?? "FACE_TO_FACE",

            activitySource:

                data.activitySource ?? "STRATEGIC_PLAN",

            status:

                data.status ?? "PLANNED",

            remarks:

                data.remarks ?? "",

            createdDate:

                now,

            updatedDate:

                now

        };

    }

    return Object.freeze({

        create

    });

})();