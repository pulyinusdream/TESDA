/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request Service
 * Version 1.1.0
 * ============================================================
 *
 * Responsibilities:
 * - Build the RIS request working model
 * - Resolve authenticated requester identity
 * - Validate request data
 * - Submit normalized requests to RisService
 * - Delegate enterprise workflow operations
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


class RequestService {

    constructor() {

        this.model =
            new RequestFeature.Model();

        this.validator =
            new RequestFeature.Validator();

    }


    // =====================================================
    // Authenticated Requester
    // =====================================================

    getAuthenticatedRequester() {

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
    // Request Creation
    // =====================================================

    createRequest(
        header = {},
        cartItems = []
    ) {

        try {

            const requester =
                this.getAuthenticatedRequester();

            this.reset();

            /*
             * Identity and organization fields are derived
             * exclusively from the authenticated session.
             */

            this.model.setDivision(
                requester.division || ""
            );

            this.model.setOffice(
                requester.office || ""
            );

            this.model.setSection(
                requester.section || ""
            );

            this.model.setRequestedBy(
                requester.fullName || ""
            );

            this.model.setRequestedByAccountId(
                requester.accountId || ""
            );

            this.model.setRequestedByEmployeeId(
                requester.employeeId || ""
            );

            this.model.setRequestedByEmployeeNo(
                requester.employeeNo || ""
            );

            this.model.setRequestedByUsername(
                requester.username || ""
            );

            this.model.setRequestedByPosition(
                requester.position || ""
            );

            this.model.setRequestedByCode(
                requester.code || ""
            );

            this.model.setRequestedByEmail(
                requester.email || ""
            );

            /*
             * Editable request fields remain sourced from
             * the RIS form.
             */

            this.model.setRCC(
                header.rcc || ""
            );

            this.model.setPurpose(
                header.purpose || ""
            );

            this.model.setRequestedDate(
                header.requestedDate ||
                header.requestDate ||
                new Date().toISOString()
            );

            this.model.setStatus(
                header.status || "DRAFT"
            );

            this.model.setItems(
                Array.isArray(cartItems)
                    ? cartItems
                    : []
            );

            const request =
                this.model.getRequest();

            const validation =
                this.validator.validate(
                    request
                );

            if (!validation.valid) {

                return {

                    success:
                        false,

                    request:
                        null,

                    errors:
                        validation.errors

                };

            }

            return {

                success:
                    true,

                request,

                errors:
                    []

            };

        }
        catch (error) {

            return {

                success:
                    false,

                request:
                    null,

                errors: [
                    error.message
                ]

            };

        }

    }


    // =====================================================
    // Submission
    // =====================================================

    async submit(header = {}) {

        TAESF.Core.Logger.info(
            "[RequestService] Preparing authenticated RIS request..."
        );

        const items =
            Array.isArray(header.items)
                ? header.items
                : [];

        const result =
            this.createRequest(
                header,
                items
            );

        if (!result.success) {

            return {

                success:
                    false,

                message:
                    "Request validation failed.",

                errors:
                    result.errors || [],

                document:
                    null

            };

        }

        const request =
            result.request;

        TAESF.Core.Logger.info(
            "[RequestService] Validation successful."
        );

        TAESF.Core.Logger.info(
            "[RequestService] Calling Enterprise RIS Service..."
        );

        /*
         * Convert the request-feature model into the
         * enterprise RisService payload.
         *
         * requestDate is used by RisService, while the
         * working model retains requestedDate for compatibility.
         */

        const enterprisePayload = {

            risNo:
                request.risNo,

            division:
                request.division,

            office:
                request.office,

            section:
                request.section,

            rcc:
                request.rcc,

            purpose:
                request.purpose,

            status:
                request.status,

            requestedBy:
                request.requestedBy,

            requestedByAccountId:
                request.requestedByAccountId,

            requestedByEmployeeId:
                request.requestedByEmployeeId,

            requestedByEmployeeNo:
                request.requestedByEmployeeNo,

            requestedByUsername:
                request.requestedByUsername,

            requestedByPosition:
                request.requestedByPosition,

            requestedByCode:
                request.requestedByCode,

            requestedByEmail:
                request.requestedByEmail,

            requestDate:
                request.requestedDate,

            requestedDate:
                request.requestedDate,

            remarks:
                header.remarks || "",

            items:
                request.items,

            user:
                request.requestedByUsername ||
                request.requestedBy

        };

        return await RisService.process(
            enterprisePayload
        );

    }


    // =====================================================
    // Enterprise Workflow
    // =====================================================

    async startReview(
        risId,
        reviewer
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Starting review..."
        );

        return RisService.startReview(
            risId,
            reviewer
        );

    }


    async approve(
        risId,
        approver,
        remarks = ""
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Approving RIS..."
        );

        return RisService.approve(
            risId,
            approver,
            remarks
        );

    }


    async reject(
        risId,
        approver,
        remarks = ""
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Rejecting RIS..."
        );

        return RisService.reject(
            risId,
            approver,
            remarks
        );

    }


    async returnForRevision(
        risId,
        reviewer,
        remarks = ""
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Returning RIS for revision..."
        );

        return RisService.returnForRevision(
            risId,
            reviewer,
            remarks
        );

    }


    async reserve(
        risId,
        reservedBy
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Reserving inventory..."
        );

        return await RisService.reserve(
            risId,
            reservedBy
        );

    }


    async issue(
        risId,
        issuedBy
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Issuing inventory..."
        );

        return await RisService.issue(
            risId,
            issuedBy
        );

    }


    async complete(
        risId,
        completedBy,
        remarks = ""
    ) {

        TAESF.Core.Logger.info(
            "[RequestService] Completing RIS..."
        );

        return RisService.complete(
            risId,
            completedBy,
            remarks
        );

    }


    // =====================================================
    // Working Model
    // =====================================================

    getRequest() {

        return this.model.getRequest();

    }


    reset() {

        this.model.clear();

    }

}


RequestFeature.Service =
    RequestService;


})(window);