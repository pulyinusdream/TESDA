"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Calculation Utility
 * ----------------------------------------------------------
 * Framework Sprint : F2.3
 *
 * Responsibility
 * - Date Calculations
 * - Learning Hour Calculations
 * - Duration Calculations
 * ==========================================================
 */

TAESF.Utilities = TAESF.Utilities || {};

TAESF.Utilities.Calculation = (() => {

    /**
     * ======================================================
     * Calendar Days
     * ======================================================
     */

    function calculateDuration(startDate, endDate) {

        if (!startDate || !endDate) {

            return 0;

        }

        const start = new Date(startDate);

        const end = new Date(endDate);

        const milliseconds =

            end - start;

        const days =

            Math.floor(

                milliseconds / (1000 * 60 * 60 * 24)

            ) + 1;

        return Math.max(days, 0);

    }

    /**
     * ======================================================
     * Training Hours
     * ======================================================
     */

    function calculateTrainingHours(

        startDate,

        endDate,

        attendanceType,

        customHours = 0

    ) {

        const days =

            calculateDuration(

                startDate,

                endDate

            );

        switch (attendanceType) {

            case "WHOLE_DAY":

                return days * 8;

            case "HALF_DAY":

                return days * 4;

            case "CUSTOM":

                return Number(customHours);

            default:

                return 0;

        }

    }

    /**
     * ======================================================
     * Working Days
     * ======================================================
     */

    function calculateWorkingDays(startDate, endDate) {

        if (!startDate || !endDate) {

            return 0;

        }

        let count = 0;

        let current =

            new Date(startDate);

        const end =

            new Date(endDate);

        while (current <= end) {

            const day =

                current.getDay();

            if (

                day !== 0 &&

                day !== 6

            ) {

                count++;

            }

            current.setDate(

                current.getDate() + 1

            );

        }

        return count;

    }

    return Object.freeze({

        calculateDuration,

        calculateTrainingHours,

        calculateWorkingDays

    });

})();