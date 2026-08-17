"use strict";

/**
 * ==========================================================
 * TAESF Enterprise Framework
 * ----------------------------------------------------------
 * Action Button Group
 *
 * Framework Sprint:
 * F2.7
 *
 * Responsibility
 * - Render standardized action buttons
 * - No business logic
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.ActionButtons = (() => {

    function render({

        edit = false,

        delete: remove = false,

        view = false,

        print = false,

        download = false,

        approve = false,

        reject = false,

        archive = false,

        id = ""

    }) {

        let html = `<div class="action-buttons">`;

        if (view) {

            html += `
<button
    class="btn-action btn-view"
    data-id="${id}"
    data-action="view">

    View

</button>
`;

        }

        if (edit) {

            html += `
<button
    class="btn-action btn-edit"
    data-id="${id}"
    data-action="edit">

    Edit

</button>
`;

        }

        if (remove) {

            html += `
<button
    class="btn-action btn-delete"
    data-id="${id}"
    data-action="delete">

    Delete

</button>
`;

        }

        if (approve) {

            html += `
<button
    class="btn-action btn-approve"
    data-id="${id}"
    data-action="approve">

    Approve

</button>
`;

        }

        if (reject) {

            html += `
<button
    class="btn-action btn-reject"
    data-id="${id}"
    data-action="reject">

    Reject

</button>
`;

        }

        if (print) {

            html += `
<button
    class="btn-action btn-print"
    data-id="${id}"
    data-action="print">

    Print

</button>
`;

        }

        if (download) {

            html += `
<button
    class="btn-action btn-download"
    data-id="${id}"
    data-action="download">

    Download

</button>
`;

        }

        if (archive) {

            html += `
<button
    class="btn-action btn-archive"
    data-id="${id}"
    data-action="archive">

    Archive

</button>
`;

        }

        html += `</div>`;

        return html;

    }

    return Object.freeze({

        render

    });

})();