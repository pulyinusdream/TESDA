"use strict";

/**
 * ==========================================================
 * TALDMS
 * ----------------------------------------------------------
 * Strategic Activity Repository
 *
 * Feature:
 * WDP-A002
 *
 * Responsibility
 * - Persist Strategic Activities
 * - Retrieve Strategic Activities
 * - Update Strategic Activities
 * - Delete Strategic Activities
 * ==========================================================
 */

TAESF.Modules = TAESF.Modules || {};
TAESF.Modules.Workforce = TAESF.Modules.Workforce || {};
TAESF.Modules.Workforce.WDP = TAESF.Modules.Workforce.WDP || {};

TAESF.Modules.Workforce.WDP.ActivityRepository = (() => {

    const STORAGE_KEY = "taldms.wdp.activities";

    function loadActivities() {

        return TAESF.Services.Storage.load(STORAGE_KEY) || [];

    }

    function saveActivities(activities) {

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            activities

        );

    }

    function getAll() {

        return loadActivities();

    }

    function getByActivityId(activityId) {

        return loadActivities().find(

            activity =>

                activity.activityId === activityId

        ) || null;

    }

    function getByPlanId(planId) {

        return loadActivities().filter(

            activity =>

                activity.planId === planId

        );

    }

    function getByCategory(planId, category) {

        return loadActivities().filter(

            activity =>

                activity.planId === planId &&

                activity.category === category

        );

    }

    function save(activity) {

        const activities = loadActivities();

        activities.push(activity);

        saveActivities(activities);

        return activity;

    }

    function update(activityId, updatedActivity) {

        const activities = loadActivities();

        const index = activities.findIndex(

            activity =>

                activity.activityId === activityId

        );

        if (index === -1) {

            return null;

        }

        activities[index] = updatedActivity;

        saveActivities(activities);

        return updatedActivity;

    }

    function remove(activityId) {

        const activities = loadActivities();

        const index = activities.findIndex(

            activity =>

                activity.activityId === activityId

        );

        if (index === -1) {

            return false;

        }

        activities.splice(index, 1);

        saveActivities(activities);

        return true;

    }

    function clear() {

        TAESF.Services.Storage.save(

            STORAGE_KEY,

            []

        );

    }

    return Object.freeze({

        getAll,

        getByActivityId,

        getByPlanId,

        getByCategory,

        save,

        update,

        remove,

        clear

    });

})();