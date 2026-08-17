"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Breadcrumb
 * Framework Sprint F9.3
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Breadcrumb = (() => {

    function render(items = []) {

        return items.join(" / ");

    }

    return Object.freeze({

        render

    });

})();