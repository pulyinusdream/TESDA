/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Request Validator
 * Version 1.1.0
 * ============================================================
 *
 * Responsibilities:
 * - Validate authenticated requester identity
 * - Validate RIS request header
 * - Validate requested items
 * - Validate enterprise workflow status
 *
 * Inventory availability is not enforced here because
 * shortages may be forwarded to the procurement workflow.
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


class RequestValidator {

    constructor() {

        this.allowedStatuses =
            Object.freeze([

                "DRAFT",

                "SUBMITTED",

                "UNDER_REVIEW",

                "APPROVED",

                "REJECTED",

                "RETURNED",

                "RESERVED",

                "ISSUED",

                "COMPLETED",

                "CANCELLED",

                "VOID"

            ]);

    }


    // =====================================================
    // Main Validation
    // =====================================================

    validate(request) {

        const errors = [];

        if (
            !request ||
            typeof request !== "object" ||
            Array.isArray(request)
        ) {

            return {

                valid:
                    false,

                errors: [
                    "Request is required."
                ]

            };

        }

        this.validateIdentity(
            request,
            errors
        );

        this.validateHeader(
            request,
            errors
        );

        this.validateCart(
            request.items,
            errors
        );

        this.validateStatus(
            request.status,
            errors
        );

        return {

            valid:
                errors.length === 0,

            errors

        };

    }


    // =====================================================
    // Authenticated Identity
    // =====================================================

    validateIdentity(
        request,
        errors
    ) {

        if (
            !normalizeText(
                request.requestedBy
            )
        ) {

            errors.push(
                "Authenticated requester name is required."
            );

        }

        if (
            !normalizeText(
                request.requestedByEmployeeId
            )
        ) {

            errors.push(
                "Authenticated employee ID is required."
            );

        }

        if (
            !normalizeText(
                request.requestedByUsername
            )
        ) {

            errors.push(
                "Authenticated username is required."
            );

        }

    }


    // =====================================================
    // Header Validation
    // =====================================================

    validateHeader(
        request,
        errors
    ) {

        if (
            !normalizeText(
                request.division
            )
        ) {

            errors.push(
                "Division is required."
            );

        }

        if (
            !normalizeText(
                request.office
            )
        ) {

            errors.push(
                "Office is required."
            );

        }

        if (
            !normalizeText(
                request.purpose
            )
        ) {

            errors.push(
                "Purpose is required."
            );

        }

    }


    // =====================================================
    // Item Validation
    // =====================================================

    validateCart(
        items,
        errors
    ) {

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            errors.push(
                "At least one item is required."
            );

            return;

        }

        const itemIds =
            new Set();

        items.forEach(
            (
                item,
                index
            ) => {

                this.validateItem(
                    item,
                    index,
                    itemIds,
                    errors
                );

            }
        );

    }


    validateItem(
        item,
        index,
        itemIds,
        errors
    ) {

        const itemNumber =
            index + 1;

        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {

            errors.push(
                `Item ${itemNumber} is invalid.`
            );

            return;

        }

        const itemId =
            normalizeText(

                item.id ||

                item.stockNo ||

                item.stockNumber

            );

        const description =
            normalizeText(

                item.desc ||

                item.description ||

                item.itemName ||

                item.stock ||

                itemId ||

                `Item ${itemNumber}`

            );

        if (!itemId) {

            errors.push(
                `Item ${itemNumber}: Item ID is required.`
            );

        }
        else {

            const normalizedItemId =
                itemId.toUpperCase();

            if (
                itemIds.has(
                    normalizedItemId
                )
            ) {

                errors.push(
                    `Duplicate item detected (${description}).`
                );

            }
            else {

                itemIds.add(
                    normalizedItemId
                );

            }

        }

        const requestedQuantity =
            Number(

                item.req ??

                item.requestedQty ??

                item.quantity ??

                0

            );

        if (
            !Number.isFinite(
                requestedQuantity
            ) ||
            requestedQuantity <= 0
        ) {

            errors.push(
                `${description}: Requested quantity must be greater than zero.`
            );

        }

        /*
         * Do not reject requests exceeding available stock.
         *
         * RisService.evaluateInventory() determines which
         * quantities are available and which quantities must
         * proceed to procurement.
         */

    }


    // =====================================================
    // Status Validation
    // =====================================================

    validateStatus(
        status,
        errors
    ) {

        const normalizedStatus =
            normalizeText(
                status
            ).toUpperCase();

        if (
            !this.allowedStatuses.includes(
                normalizedStatus
            )
        ) {

            errors.push(
                `Invalid request status (${status || ""}).`
            );

        }

    }

}


/**
 * Converts nullable values into trimmed text.
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


global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .Request
    .Validator =
    RequestValidator;


})(window);