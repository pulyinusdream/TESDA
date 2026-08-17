"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : constants.js
 * Module      : Configuration
 * Description : Enterprise Application Constants
 *
 * Version     : 1.0.0
 * ==========================================================
 */

TAESF.Configuration.Constants = Object.freeze({

    /**
     * ======================================================
     * Learning Intervention
     * ======================================================
     */
    Learning: Object.freeze({

        reapThresholdHours: 40,

        terminalReportDueDays: 5,

        treapDueDays: 15,

        tdorDueMonths: 6

    }),

    /**
     * ======================================================
     * Authentication & Security
     * ======================================================
     */
    Security: Object.freeze({

        minimumPasswordLength: 8,

        maximumLoginAttempts: 5,

        sessionTimeoutMinutes: 30

    }),

    /**
     * ======================================================
     * Dashboard
     * ======================================================
     */
    Dashboard: Object.freeze({

        defaultPageSize: 10,

        maximumNotifications: 20

    }),

    /**
     * ======================================================
     * Upload Configuration
     * ======================================================
     */
    Upload: Object.freeze({

        maximumUploadSizeMB: 20

    }),

    /**
     * ======================================================
     * Document Numbering
     * ======================================================
     */
    Numbering: Object.freeze({

        documentNumberPadding: 6

    }),

    /**
     * ======================================================
     * Employee
     * ======================================================
     */
    Employee: Object.freeze({

        employeeCodeLength: 9

    }),

    /**
     * ======================================================
     * Date & Time
     * ======================================================
     */
    DateTime: Object.freeze({

        defaultDateFormat: "MMMM DD, YYYY",

        defaultTimeFormat: "HH:mm"

    }),

    /**
     * ======================================================
     * Workflow Status
     * ======================================================
     */
    Status: Object.freeze({

        draft: "Draft",

        submitted: "Submitted",

        returned: "Returned",

        approved: "Approved",

        completed: "Completed",

        cancelled: "Cancelled",

        archived: "Archived"

    })

});