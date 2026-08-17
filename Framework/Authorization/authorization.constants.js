/**
 * ============================================================
 * TAESF Authorization Constants
 * Version : 1.0.0
 * Module  : Authorization Framework
 * ============================================================
 *
 * Defines all permissions available within the application.
 * Permissions represent capabilities—not user roles.
 *
 * Roles are mapped to permissions by PermissionService.
 *
 * This object is immutable.
 * ============================================================
 */

(function (global) {
    'use strict';

    const AuthorizationConstants = Object.freeze({

        VERSION: "1.0.0",

        PERMISSIONS: Object.freeze({

            // ==================================================
            // Inventory
            // ==================================================

            INVENTORY_VIEW: "inventory.view",
            INVENTORY_EDIT: "inventory.edit",
            INVENTORY_DELETE: "inventory.delete",

            // ==================================================
            // Receiving
            // ==================================================

            RECEIVING_VIEW: "receiving.view",
            RECEIVING_PROCESS: "receiving.process",

            // ==================================================
            // RIS
            // ==================================================

            RIS_CREATE: "ris.create",
            RIS_APPROVE: "ris.approve",
            RIS_REJECT: "ris.reject",
            RIS_ISSUE: "ris.issue",

            // ==================================================
            // Reports
            // ==================================================

            REPORT_VIEW: "report.view",
            REPORT_PRINT: "report.print",

            // ==================================================
            // Settings
            // ==================================================

            SETTINGS_MANAGE: "settings.manage",

            // ==================================================
            // User Management
            // ==================================================

            USER_MANAGEMENT: "user.management",

            // ==================================================
            // Assets
            // ==================================================

            PROPERTY_ISSUE: "property.issue",
            PROPERTY_RECEIVE: "property.receive",
            PROPERTY_TRANSFER: "property.transfer"

        })

    });

    Object.freeze(AuthorizationConstants);

    global.AuthorizationConstants = AuthorizationConstants;

    console.info(
        "[TAESF] Authorization Constants v" +
        AuthorizationConstants.VERSION +
        " Loaded"
    );

})(window);