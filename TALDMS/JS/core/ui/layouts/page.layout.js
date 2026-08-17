"use strict";

/**
 * ==========================================================
 * Enterprise Layout Manager
 * ==========================================================
 */

TAESF.UI = TAESF.UI || {};

TAESF.UI.Layout = (()=>{

    function render(content){

        return `

<div class="app-layout">

    <aside class="sidebar">

        <div class="sidebar-title">

            TALDMS

        </div>

        <nav class="sidebar-nav">

            <a class="sidebar-link">Dashboard</a>

            <a class="sidebar-link">Employees</a>

            <a class="sidebar-link">Learning</a>

            <a class="sidebar-link">TREAP</a>

            <a class="sidebar-link">Reports</a>

        </nav>

    </aside>

    <header class="header">

        <div class="header-title">

            TESDA Albay

        </div>

        <div class="header-user">

            Enterprise Framework

        </div>

    </header>

    <main class="app-content">

        ${content}

    </main>

</div>

`;

    }

    return Object.freeze({

        render

    });

})();