"use strict";

/**
 * ==========================================================
 * TAEDS Loading & Empty State System
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Loading = (() => {

    function spinner(message="Loading..."){

        return `

<div class="loading">

    <div class="loading-spinner"></div>

    <div>${message}</div>

</div>

`;

    }

    function empty(title,message){

        return `

<div class="empty-state">

    <div class="empty-icon">

        📄

    </div>

    <div class="empty-title">

        ${title}

    </div>

    <div class="empty-message">

        ${message}

    </div>

</div>

`;

    }

    return Object.freeze({

        spinner,

        empty

    });

})();