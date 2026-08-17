"use strict";

/**
 * ==========================================================
 * TAEDS Enterprise Sidebar
 * Framework Sprint F9.1
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Sidebar = (() => {

    function render() {

        return `

<div class="sidebar-brand">

    TAEDS

</div>

<nav class="sidebar-menu">

    <a href="#" class="sidebar-item active">

        Dashboard

    </a>

    <a href="#" class="sidebar-item">

        Employees

    </a>

    <a href="#" class="sidebar-item">

        Learning

    </a>

    <a href="#" class="sidebar-item">

        TREAP

    </a>

    <a href="#" class="sidebar-item">

        Reports

    </a>

</nav>

`;

    }

    return Object.freeze({

        render

    });

})();