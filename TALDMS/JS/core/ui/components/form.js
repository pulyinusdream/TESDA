"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Form System
 * ----------------------------------------------------------
 * Framework Sprint : F2.2
 *
 * Enterprise Controls
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Form = (() => {

    /*
    ==========================================================
    Text
    ==========================================================
    */

    function textField(options = {}) {

        return `

<div class="form-group">

<label
    class="form-label"
    for="${options.id ?? ""}">

${options.label ?? ""}

</label>

<input

id="${options.id ?? ""}"

name="${options.name ?? ""}"

class="form-control"

type="${options.type ?? "text"}"

value="${options.value ?? ""}"

placeholder="${options.placeholder ?? ""}"

${options.required ? "required" : ""}

${options.readonly ? "readonly" : ""}

${options.disabled ? "disabled" : ""}

>

${options.help ? `

<div class="form-help">

${options.help}

</div>

` : ""}

</div>

`;

    }

    /*
    ==========================================================
    Number
    ==========================================================
    */

    function numberField(options = {}) {

        return textField({

            ...options,

            type: "number"

        });

    }

    /*
    ==========================================================
    Date
    ==========================================================
    */

    function dateField(options = {}) {

        return textField({

            ...options,

            type: "date"

        });

    }

    /*
    ==========================================================
    Select
    ==========================================================
    */

    function selectField(options = {}) {

        const items =
            options.items ?? [];

        const html =
            items.map(item => `

<option

value="${item.value}"

${item.value === options.value ? "selected" : ""}

>

${item.label}

</option>

`).join("");

        return `

<div class="form-group">

<label
class="form-label"
for="${options.id ?? ""}">

${options.label ?? ""}

</label>

<select

id="${options.id ?? ""}"

class="form-control"

${options.required ? "required" : ""}

>

${html}

</select>

</div>

`;

    }

    /*
    ==========================================================
    Text Area
    ==========================================================
    */

    function textArea(options = {}) {

        return `

<div class="form-group">

<label

class="form-label"

for="${options.id ?? ""}">

${options.label ?? ""}

</label>

<textarea

id="${options.id ?? ""}"

class="form-control"

placeholder="${options.placeholder ?? ""}"

${options.required ? "required" : ""}

>

${options.value ?? ""}

</textarea>

</div>

`;

    }

    return Object.freeze({

        textField,

        numberField,

        dateField,

        selectField,

        textArea

    });

})();