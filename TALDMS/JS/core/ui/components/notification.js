"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Notification System
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Notification = (() => {

    function render(options = {}) {

        return `

<div class="notification ${options.type ?? "notification-info"}">

    <div>

        <div class="notification-title">

            ${options.title ?? ""}

        </div>

        <div class="notification-message">

            ${options.message ?? ""}

        </div>

    </div>

</div>

`;

    }

    return Object.freeze({

        render

    });

})();