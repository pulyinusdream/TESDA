"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : constants.js
 * Module      : Configuration
 * Description : Enterprise Technical Constants
 *
 * Version     : 1.0.0
 * ==========================================================
 */

TAESF.Configuration.Constants = Object.freeze({

    /**
     * ======================================================
     * Security
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
     * Upload
     * ======================================================
     */
    Upload: Object.freeze({

        maximumUploadSizeMB: 20,

        allowedImageTypes: Object.freeze([
            "jpg",
            "jpeg",
            "png"
        ]),

        allowedDocumentTypes: Object.freeze([
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx"
        ])

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

        defaultTimeFormat: "HH:mm",

        timezone: "Asia/Manila"

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