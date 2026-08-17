/**
 * ==========================================================
 * TAESF Authentication Manifest
 * RC-2 Sprint 2.0E
 * Version 1.0.0
 * ==========================================================
 *
 * Purpose:
 * Describes the Authentication module.
 *
 * This file contains metadata only.
 *
 * It does NOT:
 * - execute business logic
 * - initialize services
 * - modify the application
 * ==========================================================
 */

const AuthenticationManifest = Object.freeze({

    module: {

        code: "AUTH",

        name: "Authentication",

        version: "1.0.0",

        description:
            "Authentication Framework for TAESF."

    },

    dependencies: [

    ],

    constants: [

        "AuthenticationConstants"

    ],

    services: [

        "SessionManager",

        "CurrentUserService",

        "AuthenticationService"

    ],

    future: [

        "PermissionService",

        "AuthorizationService",

        "IdentityService",

        "PasswordPolicyService"

    ]

});