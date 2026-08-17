/**
 * ============================================================
 * TAESF Permission Service
 * RC-3 Sprint 3.0B.3.2
 * Version 2.0.0
 * ============================================================
 *
 * Responsibility:
 * Evaluates authorization.
 *
 * Does NOT:
 * - define permissions
 * - define role policy
 *
 * Role policy belongs to AuthorizationMatrix.
 * ============================================================
 */

const PermissionService = (function () {

    "use strict";

    const P = AuthorizationConstants.PERMISSIONS;

    /**
     * ============================================================
     * Private Helpers
     * ============================================================
     */

    function getCurrentRole() {

        if (!CurrentUserService.isLoggedIn()) {
            return null;
        }

        return CurrentUserService.getRole();

    }

    function can(permission) {

        const role = getCurrentRole();

        if (!role) {
            return false;
        }

        return AuthorizationMatrix
            .getPermissions(role)
            .includes(permission);

    }

    /**
     * ============================================================
     * Public API
     * ============================================================
     */

    return Object.freeze({

        VERSION: "2.0.0",

        can,

        hasPermission(permission) {

            return can(permission);

        },

        canManageInventory() {

            return can(P.INVENTORY_EDIT);

        },

        canReceiveInventory() {

            return can(P.RECEIVING_PROCESS);

        },

        canGenerateRIS() {

            return can(P.RIS_CREATE);

        },

        canApproveRIS() {

            return can(P.RIS_APPROVE);

        },

        canIssueRIS() {

            return can(P.RIS_ISSUE);

        },

        canViewReports() {

            return can(P.REPORT_VIEW);

        },

        canManageSettings() {

            return can(P.SETTINGS_MANAGE);

        },

        canManageUsers() {

            return can(P.USER_MANAGEMENT);

        },

        canIssueProperty() {

            return can(P.PROPERTY_ISSUE);

        }

    });

})();