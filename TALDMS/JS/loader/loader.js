"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Loader
 * ==========================================================
 */

window.TAESF = window.TAESF || {};
TAESF.Loader = TAESF.Loader || {};

TAESF.Loader.loadFramework = function (callback) {

    TAESF.Loader.loadScripts(

        TAESF.Loader.framework,

        callback

    );

};

TAESF.Loader.loadModule = function (

    module,

    callback

) {

    const files = TAESF.Loader.modules[module];

    if (!files) {

        console.error(

            "Unknown module:",

            module

        );

        return;

    }

    TAESF.Loader.loadScripts(

        files,

        callback

    );

};