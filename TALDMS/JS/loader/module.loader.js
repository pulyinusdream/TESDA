"use strict";

/**
 * ==========================================================
 * TAESF Module Registry
 * ==========================================================
 */

window.TAESF = window.TAESF || {};
TAESF.Loader = TAESF.Loader || {};

TAESF.Loader.modules = {

    employee: [

        "modules/employee/models/employee.model.js",

        "modules/employee/repository/employee.repository.js",

        "modules/employee/validation/employee.validator.js",

        "modules/employee/services/employee.service.js",

        "modules/employee/controllers/employee.controller.js",

        "modules/employee/views/employee.list.view.js"

    ]

};