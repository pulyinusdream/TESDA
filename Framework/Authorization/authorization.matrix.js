/**
 * ============================================================
 * TAESF Authorization Matrix
 * RC-3 Sprint 3.0B.3.1
 * Version 1.0.0
 * ============================================================
 *
 * Responsibility:
 * Defines the Role → Permission policy.
 *
 * This module does NOT evaluate permissions.
 * It simply returns the permissions assigned to a role.
 * ============================================================
 */

const AuthorizationMatrix = (function () {

    "use strict";

    const P = AuthorizationConstants.PERMISSIONS;

    const MATRIX = Object.freeze({

        admin: Object.freeze([

            // Inventory
            P.INVENTORY_VIEW,
            P.INVENTORY_EDIT,
            P.INVENTORY_DELETE,

            // Receiving
            P.RECEIVING_VIEW,
            P.RECEIVING_PROCESS,

            // RIS
            P.RIS_CREATE,
            P.RIS_APPROVE,
            P.RIS_REJECT,
            P.RIS_ISSUE,

            // Reports
            P.REPORT_VIEW,
            P.REPORT_PRINT,

            // Settings
            P.SETTINGS_MANAGE,

            // Users
            P.USER_MANAGEMENT,

            // Property
            P.PROPERTY_ISSUE,
            P.PROPERTY_RECEIVE,
            P.PROPERTY_TRANSFER

        ]),

        staff: Object.freeze([

            P.INVENTORY_VIEW,

            P.RECEIVING_VIEW,
            P.RECEIVING_PROCESS,

            P.RIS_CREATE,

            P.REPORT_VIEW

        ]),

        coa: Object.freeze([

            P.INVENTORY_VIEW,

            P.REPORT_VIEW,
            P.REPORT_PRINT

        ])

    });

    function getPermissions(role) {

        if (!role) {
            return Object.freeze([]);
        }

        return MATRIX[role] || Object.freeze([]);

    }

    function hasRole(role) {

        return Object.prototype.hasOwnProperty.call(MATRIX, role);

    }

    return Object.freeze({

        VERSION: "1.0.0",

        getPermissions,

        hasRole

    });

})();