"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Dialog System
 * ----------------------------------------------------------
 * Enterprise Modal
 *
 * Framework Sprint : F2.1
 *
 * Features
 * - Responsive Sizes
 * - Scrollable Body
 * - Sticky Footer
 * - Reusable
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Modal = (() => {

    function render(options = {}) {

        const size = options.size ?? "medium";

        return `

<div class="modal-overlay">

    <div class="modal modal-${size}">

        <div class="modal-header">

            <div class="modal-title">

                ${options.title ?? ""}

            </div>

        </div>

        <div class="modal-body">

            ${options.body ?? ""}

        </div>

        <div class="modal-footer">

            ${options.footer ?? ""}

        </div>

    </div>

</div>

`;

    }

    return Object.freeze({

        render

    });

})();