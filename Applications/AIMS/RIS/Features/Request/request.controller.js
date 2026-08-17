/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request Controller
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

"use strict";

global.TAESF = global.TAESF || {};
global.TAESF.Applications = global.TAESF.Applications || {};
global.TAESF.Applications.AIMS = global.TAESF.Applications.AIMS || {};
global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};
global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};
global.TAESF.Applications.AIMS.RIS.Features.Request =
    global.TAESF.Applications.AIMS.RIS.Features.Request || {};

const RequestFeature =
    global.TAESF.Applications.AIMS.RIS.Features.Request;

class RequestController {

    constructor(cartService) {

        this.service =
            new RequestFeature.Service();

        this.cartService = cartService;

    }

    // =====================================================
    // Request Creation
    // =====================================================

    createRequest(header) {

        const cartItems =
            this.cartService
                ? this.cartService.getItems()
                : [];

        return this.service.createRequest(
            header,
            cartItems
        );

    }

    getRequest() {

        return this.service.getRequest();

    }

    reset() {

        this.service.reset();

    }

    // =====================================================
    // Submission
    // =====================================================

    async submitRequest(requestData) {

        TAESF.Core.Logger.info(
            "[RequestController] Submitting RIS request..."
        );

        return await this.service.submit(
            requestData
        );

    }

    // =====================================================
    // Enterprise Workflow
    // =====================================================

    async startReview(risId, reviewer) {

        TAESF.Core.Logger.info(
            "[RequestController] Starting review..."
        );

        return await this.service.startReview(
            risId,
            reviewer
        );

    }

    async approve(risId, approver, remarks = "") {

        TAESF.Core.Logger.info(
            "[RequestController] Approving RIS..."
        );

        return await this.service.approve(
            risId,
            approver,
            remarks
        );

    }

    async reject(risId, approver, remarks = "") {

        TAESF.Core.Logger.info(
            "[RequestController] Rejecting RIS..."
        );

        return await this.service.reject(
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
            "[RequestController] Returning RIS..."
        );

        return await this.service.returnForRevision(
            risId,
            reviewer,
            remarks
        );

    }

    async reserve(risId, reservedBy) {

        TAESF.Core.Logger.info(
            "[RequestController] Reserving inventory..."
        );

        return await this.service.reserve(
            risId,
            reservedBy
        );

    }

    async issue(risId, issuedBy) {

        TAESF.Core.Logger.info(
            "[RequestController] Issuing inventory..."
        );

        return await this.service.issue(
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
            "[RequestController] Completing RIS..."
        );

        return await this.service.complete(
            risId,
            completedBy,
            remarks
        );

    }

}

RequestFeature.Controller = RequestController;

})(window);