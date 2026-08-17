"use strict";

/**
 * ==========================================================
 * TAESF Script Loader
 * Framework Enhancement FE2
 * ==========================================================
 */

window.TAESF = window.TAESF || {};
TAESF.Loader = TAESF.Loader || {};

TAESF.Loader.loadScripts = function (files, callback) {

    let index = 0;

    function loadNext() {

        if (index >= files.length) {

            if (callback) {

                callback();

            }

            return;

        }

        const script = document.createElement("script");

        script.src =

        TAESF.Loader.config.root +

        files[index];

        script.onload = function () {

    if (TAESF.Loader.config.debug) {

        console.log(

            "Loaded:",

            files[index]

        );

    }

    index++;

    loadNext();

    };

        script.onerror = function () {

            console.error(

            "[TAESF Loader]",

            "Failed:",

            script.src

);

        };

        document.head.appendChild(script);

    }

    loadNext();

};