"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Activity Service
 *
 * Feature:
 * WDP-A004
 *
 * Responsibility
 * - Business Logic
 * - Validation
 * - Activity Number Generation
 * - Repository Orchestration
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.ActivityService = (() => {

    const Repository =
        TAESF.Modules.Workforce.WDP.ActivityRepository;

    const Validator =
        TAESF.Modules.Workforce.WDP.ActivityValidator;

    function generateActivityNumber(activity) {

        const year = activity.startYear;

        const count =

            Repository.getAll().length + 1;

        return `WDP-ACT-${year}-${String(count).padStart(6,"0")}`;

    }

    function create(activity) {

        const validation =

            Validator.validate(activity);

        if (!validation.success) {

            return validation;

        }

        activity.activityNumber =

            generateActivityNumber(activity);

        Repository.save(activity);

        return {

            success:true,

            message:"Strategic Activity successfully created.",

            data:activity

        };

    }

    function update(activityId, activity) {

        const validation =

            Validator.validate(activity);

        if (!validation.success) {

            return validation;

        }

        activity.updatedDate =

            new Date().toISOString();

        const updated =

            Repository.update(

                activityId,

                activity

            );

        if (!updated) {

            return {

                success:false,

                message:"Strategic Activity not found."

            };

        }

        return {

            success:true,

            message:"Strategic Activity successfully updated.",

            data:updated

        };

    }

    function remove(activityId) {

        const deleted =

            Repository.remove(activityId);

        if (!deleted) {

            return {

                success:false,

                message:"Strategic Activity not found."

            };

        }

        return {

            success:true,

            message:"Strategic Activity successfully deleted."

        };

    }

    function getAll() {

        return Repository.getAll();

    }

    function getByActivityId(activityId) {

        return Repository.getByActivityId(activityId);

    }

    function getByPlanId(planId) {

        return Repository.getByPlanId(planId);

    }

    function getByCategory(planId, category) {

        return Repository.getByCategory(

            planId,

            category

        );

    }

    return Object.freeze({

        create,

        update,

        remove,

        getAll,

        getByActivityId,

        getByPlanId,

        getByCategory

    });

})();