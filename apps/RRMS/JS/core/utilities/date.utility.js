"use strict";

NEXUS_RRMS.Utilities.Date = (() => {
    function nowIso() {
        return new Date().toISOString();
    }

    function yearOf(dateValue) {
        const date = new Date(dateValue);
        return Number.isNaN(date.getTime()) ? null : date.getFullYear();
    }

    function format(dateValue) {
        if (!dateValue) return "—";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "—";
        return new Intl.DateTimeFormat("en-PH", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        }).format(date);
    }

    return Object.freeze({ nowIso, yearOf, format });
})();
