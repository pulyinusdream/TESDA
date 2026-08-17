/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request Model
 * Version 1.1.1
 * ============================================================
 *
 * Request-feature working model.
 *
 * Supports:
 * - Authenticated requester identity
 * - Requesting office/division information
 * - RIS header information
 * - Requested item collection
 *
 * The enterprise RIS document remains owned by RisService.
 * ============================================================
 */

(function (global) {

"use strict";


global.TAESF =
    global.TAESF || {};

global.TAESF.Applications =
    global.TAESF.Applications || {};

global.TAESF.Applications.AIMS =
    global.TAESF.Applications.AIMS || {};

global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};

global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};

global.TAESF.Applications.AIMS.RIS.Features.Request =
    global.TAESF.Applications.AIMS.RIS.Features.Request || {};


/**
 * Normalizes text values.
 *
 * @param {*} value
 * @returns {string}
 */
function normalizeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(
        value
    ).trim();

}


/**
 * Creates a safe copy of a value.
 *
 * @param {*} value
 * @returns {*}
 */
function clone(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return value;

    }

    if (
        typeof structuredClone ===
            "function"
    ) {

        return structuredClone(
            value
        );

    }

    return JSON.parse(
        JSON.stringify(
            value
        )
    );

}


class RequestModel {

    constructor() {

        this.clear();

    }


    clear() {

        this.request = {

            risNo:
                "",

            division:
                "",

            office:
                "",

            section:
                "",

            rcc:
                "",

            purpose:
                "",

            status:
                "DRAFT",

            requestedBy:
                "",

            requestedByAccountId:
                "",

            requestedByEmployeeId:
                "",

            requestedByEmployeeNo:
                "",

            requestedByUsername:
                "",

            requestedByPosition:
                "",

            requestedByCode:
                "",

            requestedByEmail:
                "",

            requestedDate:
                null,

            items:
                []

        };

    }


    setRISNo(risNo) {

        this.request.risNo =
            normalizeText(
                risNo
            );

    }


    setDivision(division) {

        this.request.division =
            normalizeText(
                division
            );

    }


    setOffice(office) {

        this.request.office =
            normalizeText(
                office
            );

    }


    setSection(section) {

        this.request.section =
            normalizeText(
                section
            );

    }


    setRCC(rcc) {

        this.request.rcc =
            normalizeText(
                rcc
            );

    }


    setPurpose(purpose) {

        this.request.purpose =
            normalizeText(
                purpose
            );

    }


    setRequestedBy(requestedBy) {

        this.request.requestedBy =
            normalizeText(
                requestedBy
            );

    }


    setRequestedByAccountId(accountId) {

        this.request.requestedByAccountId =
            normalizeText(
                accountId
            );

    }


    setRequestedByEmployeeId(employeeId) {

        this.request.requestedByEmployeeId =
            normalizeText(
                employeeId
            );

    }


    setRequestedByEmployeeNo(employeeNo) {

        this.request.requestedByEmployeeNo =
            normalizeText(
                employeeNo
            );

    }


    setRequestedByUsername(username) {

        this.request.requestedByUsername =
            normalizeText(
                username
            ).toLowerCase();

    }


    setRequestedByPosition(position) {

        this.request.requestedByPosition =
            normalizeText(
                position
            );

    }


    setRequestedByCode(code) {

        this.request.requestedByCode =
            normalizeText(
                code
            );

    }


    setRequestedByEmail(email) {

        this.request.requestedByEmail =
            normalizeText(
                email
            );

    }


    setRequestedDate(requestedDate) {

        this.request.requestedDate =
            requestedDate || null;

    }


    setStatus(status) {

        this.request.status =
            normalizeText(
                status
            ) || "DRAFT";

    }


    setItems(items) {

        if (!Array.isArray(items)) {

            this.request.items = [];

            return;

        }

        this.request.items =
            clone(
                items
            );

    }


    getRISNo() {

        return this.request.risNo;

    }


    getDivision() {

        return this.request.division;

    }


    getOffice() {

        return this.request.office;

    }


    getSection() {

        return this.request.section;

    }


    getRCC() {

        return this.request.rcc;

    }


    getPurpose() {

        return this.request.purpose;

    }


    getRequestedBy() {

        return this.request.requestedBy;

    }


    getRequestedByAccountId() {

        return this.request
            .requestedByAccountId;

    }


    getRequestedByEmployeeId() {

        return this.request
            .requestedByEmployeeId;

    }


    getRequestedByEmployeeNo() {

        return this.request
            .requestedByEmployeeNo;

    }


    getRequestedByUsername() {

        return this.request
            .requestedByUsername;

    }


    getRequestedByPosition() {

        return this.request
            .requestedByPosition;

    }


    getRequestedByCode() {

        return this.request
            .requestedByCode;

    }


    getRequestedByEmail() {

        return this.request
            .requestedByEmail;

    }


    getRequestedDate() {

        return this.request.requestedDate;

    }


    getStatus() {

        return this.request.status;

    }


    getItems() {

        return clone(
            this.request.items
        );

    }


    getRequest() {

        return clone(
            this.request
        );

    }

}


global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .Request
    .Model =
    RequestModel;


})(window);