/**
 * ==========================================================
 * TAESF Authentication Constants
 * RC-2 Sprint 2.0A
 * Version 1.0.0
 * ==========================================================
 */

const AuthenticationConstants = Object.freeze({

    SESSION_KEY: "TAESF_SESSION",

    DEFAULT_TIMEOUT_MINUTES: 30,

    PASSWORD_MIN_LENGTH: 8,

    ROLES: Object.freeze({

        STAFF: "staff",

        ADMIN: "admin",

        COA: "coa"

    }),

    USER_STATUS: Object.freeze({

        ACTIVE: "ACTIVE",

        INACTIVE: "INACTIVE",

        LOCKED: "LOCKED"

    }),

    LOGIN_RESULT: Object.freeze({

        SUCCESS: "SUCCESS",

        INVALID_USERNAME: "INVALID_USERNAME",

        INVALID_PASSWORD: "INVALID_PASSWORD",

        ACCOUNT_DISABLED: "ACCOUNT_DISABLED",

        ACCOUNT_LOCKED: "ACCOUNT_LOCKED",

        SESSION_EXPIRED: "SESSION_EXPIRED"

    })

});