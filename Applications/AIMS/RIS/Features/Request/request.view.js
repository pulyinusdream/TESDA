/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request View
 * Version 1.1.0
 * ============================================================
 *
 * Responsibilities:
 * - Display authenticated requester identity
 * - Lock identity-controlled form fields
 * - Read editable RIS form values
 * - Perform lightweight UI validation
 * - Delegate request creation to RequestController
 *
 * Requester identity is resolved by CurrentUserService and
 * enforced again by RequestService and RisService.
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


const RequestFeature =
    global.TAESF
        .Applications
        .AIMS
        .RIS
        .Features
        .Request;


class RequestView {

    constructor(
        controller,
        elements = {}
    ) {

        this.controller =
            controller;

        this.elements =
            elements;

        this.currentUser =
            null;

        this.initialize();

    }


    // =====================================================
    // Initialization
    // =====================================================

    initialize() {

        try {

            this.currentUser =
                this.getAuthenticatedUser();

            this.populateAuthenticatedFields(
                this.currentUser
            );

            return {

                success:
                    true,

                user:
                    this.currentUser

            };

        }
        catch (error) {

            console.error(
                "[RequestView] Initialization failed:",
                error
            );

            return {

                success:
                    false,

                message:
                    error.message,

                user:
                    null

            };

        }

    }


    getAuthenticatedUser() {

        if (
            typeof CurrentUserService ===
                "undefined"
        ) {

            throw new Error(
                "CurrentUserService is not available."
            );

        }

        if (
            !CurrentUserService.isLoggedIn()
        ) {

            throw new Error(
                "You must log in before creating an RIS."
            );

        }

        if (
            !CurrentUserService.isDesignatedUser()
        ) {

            throw new Error(
                "A designated user account is required to create an RIS."
            );

        }

        const currentUser =
            CurrentUserService.getCurrentUser();

        if (
            !currentUser ||
            !currentUser.employeeId ||
            !currentUser.fullName
        ) {

            throw new Error(
                "The authenticated employee identity is incomplete."
            );

        }

        return currentUser;

    }


    // =====================================================
    // Authenticated Fields
    // =====================================================

    populateAuthenticatedFields(
        currentUser
    ) {

        if (!currentUser) {

            return;

        }

        this.setIdentityField(
            "risDiv",
            currentUser.division || ""
        );

        this.setIdentityField(
            "risOffice",
            currentUser.office || ""
        );

        /*
        * risReqBy stores the Employee ID as its option value,
        * not the employee's full name.
        */
        this.setIdentityField(
            "risReqBy",
            currentUser.employeeId || "",
            currentUser.fullName || ""
        );

    }


    setIdentityField(
    elementId,
    value,
    displayText = ""
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {

            return;

        }

        const normalizedValue =
            String(
                value || ""
            ).trim();

        const normalizedDisplayText =
            String(
                displayText || ""
            ).trim();

        if (
            element.tagName ===
                "SELECT"
        ) {

            const options =
                Array.from(
                    element.options
                );

            /*
            * First preference:
            * Match the actual option value.
            *
            * For risReqBy, this is the employee ID.
            */
            let option =
                options.find(existingOption =>
                    String(
                        existingOption.value || ""
                    ).trim() ===
                        normalizedValue
                );

            /*
            * Compatibility fallback:
            * Match exact or partial visible text.
            */
            if (
                !option &&
                normalizedDisplayText
            ) {

                option =
                    options.find(existingOption => {

                        const optionText =
                            String(
                                existingOption.textContent || ""
                            ).trim();

                        return (
                            optionText ===
                                normalizedDisplayText ||
                            optionText.startsWith(
                                normalizedDisplayText + " "
                            ) ||
                            optionText.startsWith(
                                normalizedDisplayText + "("
                            )
                        );

                    });

            }

            /*
            * Generic fallback for selects whose text and
            * value use the same data.
            */
            if (!option) {

                option =
                    options.find(existingOption =>
                        String(
                            existingOption.textContent || ""
                        ).trim() ===
                            normalizedValue
                    );

            }

            /*
            * Create an option only when the authenticated value
            * is not already present.
            */
            if (
                !option &&
                normalizedValue
            ) {

                option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    normalizedValue;

                option.textContent =
                    normalizedDisplayText ||
                    normalizedValue;

                element.appendChild(
                    option
                );

            }

            if (option) {

                element.value =
                    option.value;

                option.selected =
                    true;

            }

            element.disabled =
                true;

            element.dataset.identityControlled =
                "true";

            return;

        }

        element.value =
            normalizedDisplayText ||
            normalizedValue;

        element.readOnly =
            true;

        element.dataset.identityControlled =
            "true";

    }


    // =====================================================
    // UI Validation
    // =====================================================

    validate(form = {}) {

        if (
            !this.currentUser
        ) {

            return {

                valid:
                    false,

                message:
                    "No authenticated requester is available."

            };

        }

        if (
            !String(
                form.purpose || ""
            ).trim()
        ) {

            return {

                valid:
                    false,

                message:
                    "Please enter the Purpose."

            };

        }

        return {

            valid:
                true,

            message:
                ""

        };

    }


    // =====================================================
    // Form Data
    // =====================================================

    getFormData() {

        return {

            fund:
                this.getElementValue(
                    "risFund"
                ),

            rcc:
                this.getElementValue(
                    "risRcc"
                ),

            purpose:
                this.getElementValue(
                    "risPurpose"
                ),

            receivedBy:
                this.getElementValue(
                    "risRecBy"
                ),

            requestedDate:
                new Date().toISOString(),

            status:
                "DRAFT"

        };

    }


    /**
     * Compatibility alias for older callers.
     */
    getHeader() {

        return this.getFormData();

    }


    getElementValue(
        elementId
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {

            return "";

        }

        return String(
            element.value || ""
        ).trim();

    }


    // =====================================================
    // Request Creation
    // =====================================================

    createRequest() {

        const form =
            this.getFormData();

        const validation =
            this.validate(
                form
            );

        if (!validation.valid) {

            return {

                success:
                    false,

                request:
                    null,

                errors: [
                    validation.message
                ]

            };

        }

        return this.controller.createRequest(
            form
        );

    }


    // =====================================================
    // Form Reset
    // =====================================================

    clearForm() {

        this.setElementValue(
            "risFund",
            "101 - Regular"
        );

        this.setElementValue(
            "risRcc",
            ""
        );

        this.setElementValue(
            "risPurpose",
            ""
        );

        this.resetSelect(
            "risRecBy"
        );

        /*
         * Do not clear risDiv, risOffice, or risReqBy.
         * These fields represent the authenticated user.
         */

        this.populateAuthenticatedFields(
            this.currentUser
        );

    }


    setElementValue(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {

            return;

        }

        element.value =
            value;

    }


    resetSelect(
        elementId
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (
            !element ||
            element.tagName !==
                "SELECT"
        ) {

            return;

        }

        element.selectedIndex =
            0;

    }


    // =====================================================
    // Submission Result
    // =====================================================

    afterSubmit(response) {

        if (!response) {

            return;

        }

        if (response.success) {

            this.clearForm();

        }

    }


    getRequest() {

        return this.controller.getRequest();

    }

}


RequestFeature.View =
    RequestView;


})(window);