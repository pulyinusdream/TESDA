"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Table System
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Table = (() => {

    function render(columns = [], rows = [], options = {}) {

        const header = columns
            .map(column => `<th>${column}</th>`)
            .join("");

        const body = rows
            .map(row => `

<tr>

${row.map(value => `<td>${value}</td>`).join("")}

</tr>

`)
            .join("");

        return `

<div class="table-container">

<table

id="${options.id ?? ""}"

class="table">

<thead>

<tr>

${header}

</tr>

</thead>

<tbody>

${body}

</tbody>

</table>

</div>

`;

    }

    return Object.freeze({

        render

    });

})();