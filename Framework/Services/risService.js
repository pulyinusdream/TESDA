/**
 * ==========================================================
 * TAESF Framework
 * RisService
 * Version : 2.0.0
 * RC-RIS-1.1B Enterprise Business Engine
 * ==========================================================
 *
 * Responsibilities
 * ----------------------------------------------------------
 * • Enterprise Domain Model
 * • Validation Engine
 * • Lifecycle Engine
 * • Draft Management
 * • Submission
 * • Review
 * • Reservation
 * • Issuance
 * • Completion
 * • Audit Trail
 * • Dashboard Statistics
 *
 * Persistence
 * ----------------------------------------------------------
 * RisRegistryService
 *
 * External Services
 * ----------------------------------------------------------
 * BaseBusinessService
 *
 * ==========================================================
 */

const RisService = (() => {

    "use strict";

    // ======================================================
    // Enterprise Status Constants
    // ======================================================

    const STATUS = Object.freeze({

        DRAFT: "DRAFT",

        SUBMITTED: "SUBMITTED",

        UNDER_REVIEW: "UNDER_REVIEW",

        APPROVED: "APPROVED",

        REJECTED: "REJECTED",

        RETURNED: "RETURNED",

        RESERVED: "RESERVED",

        ISSUED: "ISSUED",

        COMPLETED: "COMPLETED",

        CANCELLED: "CANCELLED",

        VOID: "VOID"

    });

    // ======================================================
    // Allowed Workflow
    // ======================================================

    const TRANSITIONS = Object.freeze({

        DRAFT: [
            STATUS.SUBMITTED,
            STATUS.CANCELLED
        ],

        SUBMITTED: [
            STATUS.UNDER_REVIEW
        ],

        UNDER_REVIEW: [
            STATUS.APPROVED,
            STATUS.REJECTED,
            STATUS.RETURNED
        ],

        RETURNED: [
            STATUS.DRAFT
        ],

        APPROVED: [
            STATUS.RESERVED
        ],

        RESERVED: [
            STATUS.ISSUED
        ],

        ISSUED: [
            STATUS.COMPLETED
        ],

        COMPLETED: [],

        REJECTED: [],

        CANCELLED: [],

        VOID: []

    });

    // ======================================================
    // Utility
    // ======================================================

    function now() {

        return new Date().toISOString();

    }

    function generateUUID() {

        if (
            window.crypto &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();

        }

        return "RIS-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10);

    }

    function clone(object) {

        return JSON.parse(

            JSON.stringify(object)

        );

    }
    /**
     * Resolves the designated authenticated requester.
     *
     * New RIS documents may only be created from a valid
     * designated-user session. Requester identity is never
     * accepted from editable form fields.
     *
     * @returns {Object}
     */
    function getAuthenticatedRequester() {

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

        if (
            String(
                currentUser.status || ""
            ).toUpperCase() !== "ACTIVE"
        ) {

            throw new Error(
                "The authenticated user account is not active."
            );

        }

        return {

            accountId:
                currentUser.accountId || "",

            employeeId:
                currentUser.employeeId,

            employeeNo:
                currentUser.employeeNo || "",

            username:
                currentUser.username || "",

            fullName:
                currentUser.fullName,

            position:
                currentUser.position || "",

            code:
                currentUser.code || "",

            office:
                currentUser.office || "",

            division:
                currentUser.division || "",

            section:
                currentUser.section || "",

            email:
                currentUser.email || "",

            role:
                currentUser.role || "",

            status:
                currentUser.status || ""

        };

    }

    // ======================================================
    // Audit Engine
    // ======================================================

    function createAuditEntry({

        action,

        user = "",

        previousStatus = null,

        newStatus = null,

        remarks = ""

    }) {

        return {

            id: generateUUID(),

            timestamp: now(),

            action,

            user,

            previousStatus,

            newStatus,

            remarks

        };

    }

    function appendAudit(

        document,

        entry

    ) {

        if (!Array.isArray(document.audit)) {

            document.audit = [];

        }

        document.audit.push(entry);

    }

    // ======================================================
    // Enterprise Domain Factory
    // ======================================================

    function createDocument(data = {}) {

    if (
        data === null ||
        data === undefined
    ) {

        data = {};

    }

    if (
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        throw new Error(
            "RIS document data must be an object."
        );

    }

    const requester =
        getAuthenticatedRequester();

    const timestamp =
        now();

    const document = {

        risId:
            generateUUID(),

        risNo:
            null,

        status:
            STATUS.DRAFT,

        requestDate:
            data.requestDate || timestamp,

        /*
         * Requesting organization is derived from the
         * authenticated Employee Master.
         */
        division:
            requester.division,

        office:
            requester.office,

        section:
            requester.section,

        rcc:
            data.rcc || "",

        purpose:
            data.purpose || "",

        /*
         * Human-readable requester name retained for existing
         * forms, printing, validation, and compatibility.
         */
        requestedBy:
            requester.fullName,

        /*
         * Stable requester identity fields.
         */
        requestedByAccountId:
            requester.accountId,

        requestedByEmployeeId:
            requester.employeeId,

        requestedByEmployeeNo:
            requester.employeeNo,

        requestedByUsername:
            requester.username,

        requestedByPosition:
            requester.position,

        requestedByCode:
            requester.code,

        requestedByEmail:
            requester.email,

        approvedBy:
            "",

        issuedBy:
            "",

        receivedBy:
            "",

        remarks:
            data.remarks || "",

        items:
            clone(
                data.items || []
            ),

        audit:
            [],

        metadata: {

            version:
                "2.1.0",

            schemaVersion:
                2,

            source:
                "TAESF",

            identitySource:
                "CURRENT_USER_SESSION",

            requester: {

                accountId:
                    requester.accountId,

                employeeId:
                    requester.employeeId,

                employeeNo:
                    requester.employeeNo,

                username:
                    requester.username,

                fullName:
                    requester.fullName,

                position:
                    requester.position,

                office:
                    requester.office,

                division:
                    requester.division,

                section:
                    requester.section,

                role:
                    requester.role

            }

        },

        createdAt:
            timestamp,

        createdBy:
            requester.username ||
            requester.fullName,

        updatedAt:
            timestamp,

        updatedBy:
            requester.username ||
            requester.fullName,

        submittedDate:
            null,

        approvedDate:
            null,

        reservedDate:
            null,

        issuedDate:
            null,

        completedDate:
            null,

        cancelledDate:
            null,

        archived:
            false

    };

    return document;

}

    // ======================================================
    // Validation Engine
    // ======================================================

    function validateDocument(document) {

        const errors = [];

        if (!document.requestedBy) {

            errors.push(
                "Requester is required."
            );

        }

        if (!document.office) {

            errors.push(
                "Office is required."
            );

        }

        if (!document.purpose) {

            errors.push(
                "Purpose is required."
            );

        }

        if (
            !Array.isArray(document.items) ||
            document.items.length === 0
        ) {

            errors.push(
                "At least one requested item is required."
            );

        }

        const ids = new Set();

        document.items.forEach(item => {

            const itemId =
                item.id ||
                item.stockNo ||
                item.stockNumber ||
                "";

            if (!itemId) {

                errors.push(
                    "Item ID is missing."
                );

                return;

            }

            if (ids.has(itemId)) {

                errors.push(
                    "Duplicate item: " +
                    itemId
                );

            }

            ids.add(itemId);

            const qty = Number(

                item.req ??
                item.requestedQty ??
                item.quantity ??
                0

            );

            if (

                Number.isNaN(qty) ||

                qty <= 0

            ) {

                errors.push(

                    "Invalid quantity for item " +

                    itemId

                );

            }

            if (

                Number.isNaN(qty) ||

                qty <= 0

            ) {

                errors.push(

                    "Invalid quantity for item " +

                    item.id

                );

            }

        });

        return {

            valid:

                errors.length === 0,

            errors

        };

    }

    // ======================================================
    // Lifecycle Engine
    // ======================================================

    function canTransition(

        current,

        next

    ) {

        const allowed =

            TRANSITIONS[current] || [];

        return allowed.includes(next);

    }

    function changeStatus(

        document,

        nextStatus,

        user,

        remarks = ""

    ) {

        if (

            !canTransition(

                document.status,

                nextStatus

            )

        ) {

            throw new Error(

                "Illegal workflow transition: " +

                document.status +

                " → " +

                nextStatus

            );

        }

        const previous =

            document.status;

        document.status = nextStatus;

        document.updatedBy = user;

        document.updatedAt = now();
                switch (nextStatus) {

            case STATUS.SUBMITTED:
                document.submittedDate = now();
                break;

            case STATUS.APPROVED:
                document.approvedDate = now();
                break;

            case STATUS.RESERVED:
                document.reservedDate = now();
                break;

            case STATUS.ISSUED:
                document.issuedDate = now();
                break;

            case STATUS.COMPLETED:
                document.completedDate = now();
                break;

            case STATUS.CANCELLED:
                document.cancelledDate = now();
                break;

        }

        appendAudit(

            document,

            createAuditEntry({

                action: "STATUS_CHANGED",

                user,

                previousStatus: previous,

                newStatus: nextStatus,

                remarks

            })

        );

        return document;

    }

    // ======================================================
    // Registry Helpers
    // ======================================================

    function getDocument(risId) {

        const document =

            RisRegistryService.findById(risId);

        if (!document) {

            throw new Error(

                "RIS document not found."

            );

        }

        return document;

    }

    async function saveDocument(document, syncContext = {}) {

    const existing =
        RisRegistryService.findById(document.risId);

    if (existing) {

        RisRegistryService.update(document);

    }
    else {

        RisRegistryService.save(document);

    }

    if (typeof RisPersistenceAdapter === "undefined") {

        throw new Error(
            "RisPersistenceAdapter is not available."
        );

    }

    const result =
        await RisPersistenceAdapter.sync({

            risHeader: document,

            procurementQueue:
                syncContext.procurementQueue || [],

            inventory:
                syncContext.inventory || null

        });

    if (!result.success) {

        throw new Error(result.message);

    }

    return document;

}

    // ======================================================
    // Draft Engine
    // ======================================================

    async function createDraft(data = {}) {

        const document =

            createDocument(data);

        appendAudit(

            document,

            createAuditEntry({

                action: "DRAFT_CREATED",

                user:

                    document.requestedBy,

                newStatus:

                    STATUS.DRAFT

            })

        );

        await saveDocument(document);

        return document;

    }

    async function updateDraft(

        risId,

        updates = {}

    ) {

        const document =

            getDocument(risId);

        if (

            document.status !==

            STATUS.DRAFT

        ) {

            throw new Error(

                "Only draft documents can be edited."

            );

        }

        // ======================================================
        // Editable Fields Only
        // ======================================================

        const editableFields = [

            "division",

            "office",

            "rcc",

            "purpose",

            "remarks",

            "items",

            "requestDate"

        ];

        editableFields.forEach(field => {

            if (

                Object.prototype.hasOwnProperty.call(

                    updates,

                    field

                )

            ) {

                document[field] = clone(

                    updates[field]

                );

            }

        });

        document.updatedAt = now();

        appendAudit(

            document,

            createAuditEntry({

                action: "DRAFT_UPDATED",

                user:

                    updates.updatedBy ||

                    document.requestedBy,

                previousStatus:

                    STATUS.DRAFT,

                newStatus:

                    STATUS.DRAFT

            })

        );

        await saveDocument(document);

        return document;

    }

    async function deleteDraft(risId) {

        const document =

            getDocument(risId);

        if (

            document.status !==

            STATUS.DRAFT

        ) {

            throw new Error(

                "Only draft documents can be deleted."

            );

        }

        RisRegistryService.remove(risId);

        return true;

    }

    // ======================================================
    // Submission Engine
    // ======================================================

    async function submit(

        risId,

        submittedBy

    ) {

        const document =

            getDocument(risId);

        const validation =

            validateDocument(

                document

            );

        if (!validation.valid) {

            throw new Error(

                validation.errors.join("\n")

            );

        }

        if (!document.risNo) {

            document.risNo =
                generateNextRISNumber();

        }

        changeStatus(

            document,

            STATUS.SUBMITTED,

            submittedBy,

            "RIS submitted."

        );

        await saveDocument(document);

        return document;

    }

    function generateNextRISNumber() {

        const year = new Date().getFullYear();

        const documents = RisRegistryService.getAll() || [];

        let highest = 0;

        documents.forEach(doc => {

            if (!doc.risNo) return;

            const match = doc.risNo.match(
                /^RIS-(\d{4})-(\d{6})$/
            );

            if (!match) return;

            if (parseInt(match[1], 10) !== year)
                return;

            const sequence =
                parseInt(match[2], 10);

            if (sequence > highest)
                highest = sequence;

        });

        highest++;

        return `RIS-${year}-${String(highest).padStart(6, "0")}`;

    }
    
    // ======================================================
        // Inventory Evaluation Engine
        // ======================================================

        function evaluateInventory(
            requestItems = []
        ) {

            const inventory =
                getData(DB.INV) || [];

            const evaluatedItems = [];

            const availableItems = [];

            const procurementItems = [];

            requestItems.forEach(
                requestItem => {

                    const item =
                        clone(
                            requestItem
                        );

                    const itemId =
                        item.id ||
                        item.itemId ||
                        item.inventoryId ||
                        item.stockNo ||
                        item.stockNumber ||
                        "";

                    const requestedQty =
                        Number(
                            item.req ??
                            item.requestedQty ??
                            item.quantity ??
                            item.qty ??
                            0
                        );

                    const inventoryItem =
                        inventory.find(record => {

                            const inventoryId =
                                record.id ||
                                record.itemId ||
                                record.stockNo ||
                                record.stockNumber ||
                                "";

                            return String(
                                inventoryId
                            ) === String(
                                itemId
                            );

                        });

                    let availableQty = 0;

                    if (inventoryItem) {

                        availableQty =
                            Math.max(
                                0,
                                Number(
                                    availableStock(
                                        inventoryItem
                                    )
                                ) || 0
                            );

                    }

                    const issueQty =
                        Math.min(
                            requestedQty,
                            availableQty
                        );

                    const procurementQty =
                        Math.max(
                            0,
                            requestedQty -
                            issueQty
                        );

                    let availabilityStatus =
                        "OUT_OF_STOCK";

                    let disposition =
                        "FOR_PROCUREMENT";

                    if (
                        issueQty > 0 &&
                        procurementQty === 0
                    ) {

                        availabilityStatus =
                            "AVAILABLE";

                        disposition =
                            "FOR_ISSUANCE";

                    }
                    else if (
                        issueQty > 0 &&
                        procurementQty > 0
                    ) {

                        availabilityStatus =
                            "PARTIALLY_AVAILABLE";

                        disposition =
                            "PARTIAL_ISSUANCE_AND_PROCUREMENT";

                    }

                    const evaluatedItem = {

                        ...item,

                        id:
                            itemId,

                        req:
                            requestedQty,

                        requestedQty,

                        availableQty,

                        approvedQty:
                            issueQty,

                        issueQty,

                        procurementQty,

                        availabilityStatus,

                        disposition,

                        evaluationDate:
                            now()

                    };

                    evaluatedItems.push(
                        evaluatedItem
                    );

                    if (issueQty > 0) {

                        availableItems.push({

                            ...clone(
                                evaluatedItem
                            ),

                            req:
                                issueQty

                        });

                    }

                    if (procurementQty > 0) {

                        procurementItems.push({

                            ...clone(
                                evaluatedItem
                            ),

                            req:
                                procurementQty,

                            remainingQty:
                                procurementQty

                        });

                    }

                }
            );

            return {

                evaluatedItems,

                availableItems,

                procurementItems,

                summary: {

                    totalRequestedItems:
                        evaluatedItems.length,

                    fullyAvailableItems:
                        evaluatedItems.filter(
                            item =>
                                item.availabilityStatus ===
                                "AVAILABLE"
                        ).length,

                    partiallyAvailableItems:
                        evaluatedItems.filter(
                            item =>
                                item.availabilityStatus ===
                                "PARTIALLY_AVAILABLE"
                        ).length,

                    outOfStockItems:
                        evaluatedItems.filter(
                            item =>
                                item.availabilityStatus ===
                                "OUT_OF_STOCK"
                        ).length,

                    totalIssueQuantity:
                        evaluatedItems.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.issueQty || 0
                                ),
                            0
                        ),

                    totalProcurementQuantity:
                        evaluatedItems.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.procurementQty || 0
                                ),
                            0
                        )

                }

            };

        }
    
    
    // ======================================================
    // Review Engine
    // ======================================================

    async function startReview(

        risId,

        reviewer

    ) {

        const document =

            getDocument(risId);

        changeStatus(

            document,

            STATUS.UNDER_REVIEW,

            reviewer,

            "Review started."

        );

        await saveDocument(document);

        return document;

    }

    async function approve(

        risId,

        approver,

        remarks = ""

    ) {

        const document =
            getDocument(
                risId
            );

        /*
        * A newly submitted RIS must first enter
        * UNDER_REVIEW before it can be approved.
        */
        if (
            document.status ===
            STATUS.SUBMITTED
        ) {

            changeStatus(

                document,

                STATUS.UNDER_REVIEW,

                approver,

                "Review started automatically before approval."

            );

        }

        if (
            document.status !==
            STATUS.UNDER_REVIEW
        ) {

            throw new Error(

                "Only SUBMITTED or UNDER_REVIEW " +
                "RIS documents can be approved. " +
                "Current status: " +
                document.status

            );

        }

        const inventoryEvaluation =
    evaluateInventory(
        document.items
    );

/*
 * Preserve every requested item in the RIS.
 *
 * Available quantities are marked for issuance.
 * Unavailable quantities remain in the same RIS
 * and are marked for future procurement.
 */
document.items =
    inventoryEvaluation
        .evaluatedItems;

document.inventoryEvaluation = {

    evaluatedAt:
        now(),

    evaluatedBy:
        approver,

    summary:
        inventoryEvaluation.summary

};

document.approvedBy =
    approver;

changeStatus(

    document,

    STATUS.APPROVED,

    approver,

    remarks ||
    "RIS approved and inventory availability evaluated."

);

await saveDocument(
    document
);

        return document;

    }

    async function reject(

    risId,

    approver,

    remarks = ""

) {

    const document =
        getDocument(
            risId
        );

    /*
     * A newly submitted RIS must first enter
     * UNDER_REVIEW before it can be rejected.
     */
    if (
        document.status ===
        STATUS.SUBMITTED
    ) {

        changeStatus(

            document,

            STATUS.UNDER_REVIEW,

            approver,

            "Review started automatically before rejection."

        );

    }

    if (
        document.status !==
        STATUS.UNDER_REVIEW
    ) {

        throw new Error(

            "Only SUBMITTED or UNDER_REVIEW " +
            "RIS documents can be rejected. " +
            "Current status: " +
            document.status

        );

    }

    changeStatus(

        document,

        STATUS.REJECTED,

        approver,

        remarks ||
        "RIS rejected."

    );

    await saveDocument(
        document
    );

    return document;

}

    async function returnForRevision(

        risId,

        reviewer,

        remarks = ""

    ) {

        const document =

            getDocument(risId);

        changeStatus(

            document,

            STATUS.RETURNED,

            reviewer,

            remarks

        );

        await saveDocument(document);

        return document;

    }
        
    // ======================================================
// Reservation Engine
// ======================================================

async function reserve(

    risId,

    reservedBy

) {

    const document =
        getDocument(
            risId
        );

    if (
        document.status !==
        STATUS.APPROVED
    ) {

        throw new Error(
            "Only APPROVED RIS documents can be reserved. " +
            "Current status: " +
            document.status
        );

    }

    const actor =
        String(
            reservedBy || ""
        ).trim();

    if (!actor) {

        throw new Error(
            "Reservation user is required."
        );

    }

    if (
        !Array.isArray(
            document.items
        ) ||
        document.items.length === 0
    ) {

        throw new Error(
            "The RIS has no items."
        );

    }

    // ==================================================
    // Select only quantities approved for issuance.
    //
    // All requested items remain in document.items.
    // Out-of-stock quantities remain tagged as
    // FOR_PROCUREMENT but are not sent for reservation.
    // ==================================================

    const issuableItems =
        document.items.filter(item => {

            const issueQty =
                Number(
                    item.issueQty ??
                    item.approvedQty ??
                    0
                );

            return (
                Number.isFinite(
                    issueQty
                ) &&
                issueQty > 0
            );

        });

    if (issuableItems.length === 0) {

        throw new Error(
            "This RIS has no available items to reserve. " +
            "All requested items are for procurement."
        );

    }

    const reservationRequest = {

        risId:
            document.risId,

        risNo:
            document.risNo,

        requestedBy:
            document.requestedBy ||
            document.requestedByEmployeeId ||
            "",

        office:
            document.office || "",

        division:
            document.division || "",

        purpose:
            document.purpose || "",

        user:
            actor,

        items:
            issuableItems.map(item => {

                const itemId =
                    item.id ||
                    item.itemId ||
                    item.inventoryId ||
                    item.stockNo ||
                    item.stockNumber ||
                    "";

                const issueQty =
                    Number(
                        item.issueQty ??
                        item.approvedQty ??
                        0
                    );

                if (!itemId) {

                    throw new Error(
                        "An issuable RIS item has no inventory item ID."
                    );

                }

                if (
                    !Number.isFinite(
                        issueQty
                    ) ||
                    issueQty <= 0
                ) {

                    throw new Error(
                        "Invalid issue quantity for item " +
                        itemId +
                        "."
                    );

                }

                return {

                    id:
                        itemId,

                    req:
                        issueQty

                };

            })

    };

    console.log(
        "[RIS RESERVE] Issuable items only:",
        reservationRequest
    );

    const response =
        await BaseBusinessService.execute(

            "inventory.reserve",

            reservationRequest

        );

    if (
        !response ||
        response.success !== true
    ) {

        throw new Error(
            response &&
            response.message
                ? response.message
                : "Inventory reservation failed."
        );

    }

    document.reservedBy =
        actor;

    document.reservedDate =
        now();

    document.reservationSummary = {

        reservedItemCount:
            issuableItems.length,

        reservedQuantity:
            issuableItems.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.issueQty ||
                        item.approvedQty ||
                        0
                    ),
                0
            ),

        procurementItemCount:
            document.items.filter(
                item =>
                    Number(
                        item.procurementQty || 0
                    ) > 0
            ).length,

        procurementQuantity:
            document.items.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.procurementQty || 0
                    ),
                0
            )

    };

    changeStatus(

        document,

        STATUS.RESERVED,

        actor,

        "Available inventory reserved. " +
        "Out-of-stock quantities retained for procurement."

    );

    await saveDocument(
        document
    );

    return {

        success: true,

        message:
            "Available RIS items reserved successfully.",

        document,

        reservation:
            response,

        issuableItems,

        procurementItems:
            document.items.filter(
                item =>
                    Number(
                        item.procurementQty || 0
                    ) > 0
            ),

        errors: []

    };

}


// ======================================================
// Issuance Engine
// ======================================================

async function issue(

    risId,

    issuedBy

) {

    const document =
        getDocument(
            risId
        );

    if (
        document.status !==
        STATUS.RESERVED
    ) {

        throw new Error(
            "Only RESERVED RIS documents can be issued. " +
            "Current status: " +
            document.status
        );

    }

    const actor =
        String(
            issuedBy || ""
        ).trim();

    if (!actor) {

        throw new Error(
            "Issuance user is required."
        );

    }

    if (!document.risNo) {

        throw new Error(
            "RIS number is required."
        );

    }

    if (
        !Array.isArray(
            document.items
        ) ||
        document.items.length === 0
    ) {

        throw new Error(
            "The RIS has no items."
        );

    }

    // ==================================================
    // Include only quantities approved for issuance.
    // Items for procurement remain in the RIS document
    // but are excluded from the inventory transaction.
    // ==================================================

    const issuableItems =
        document.items.filter(item => {

            const issueQty =
                Number(
                    item.issueQty ??
                    item.approvedQty ??
                    0
                );

            return (
                Number.isFinite(
                    issueQty
                ) &&
                issueQty > 0
            );

        });

    if (issuableItems.length === 0) {

        throw new Error(
            "This RIS has no available items to issue."
        );

    }

    const issuanceRequest = {

        risId:
            document.risId,

        risNo:
            document.risNo,

        office:
            document.office || "",

        division:
            document.division || "",

        requestedBy:
            document.requestedBy ||
            document.requestedByEmployeeId ||
            "",

        user:
            actor,

        items:
            issuableItems.map(item => {

                const itemId =
                    item.id ||
                    item.itemId ||
                    item.inventoryId ||
                    item.stockNo ||
                    item.stockNumber ||
                    "";

                const issueQty =
                    Number(
                        item.issueQty ??
                        item.approvedQty ??
                        0
                    );

                if (!itemId) {

                    throw new Error(
                        "An issuable RIS item has no inventory item ID."
                    );

                }

                if (
                    !Number.isFinite(
                        issueQty
                    ) ||
                    issueQty <= 0
                ) {

                    throw new Error(
                        "Invalid issuance quantity for item " +
                        itemId +
                        "."
                    );

                }

                return {

                    id:
                        itemId,

                    req:
                        issueQty

                };

            })

    };

    console.log(
        "[RIS ISSUE] Issuable items only:",
        issuanceRequest
    );

    const response =
        await BaseBusinessService.execute(

            "inventory.issue",

            issuanceRequest

        );

    if (
        !response ||
        response.success !== true
    ) {

        throw new Error(
            response &&
            response.message
                ? response.message
                : "Inventory issuance failed."
        );

    }

    document.items =
        document.items.map(item => {

            const issueQty =
                Number(
                    item.issueQty ??
                    item.approvedQty ??
                    0
                );

            const procurementQty =
                Number(
                    item.procurementQty || 0
                );

            let issuanceStatus =
                "FOR_PROCUREMENT";

            if (
                issueQty > 0 &&
                procurementQty === 0
            ) {

                issuanceStatus =
                    "ISSUED";

            }
            else if (
                issueQty > 0 &&
                procurementQty > 0
            ) {

                issuanceStatus =
                    "PARTIALLY_ISSUED";

            }

            return {

                ...item,

                issuedQty:
                    issueQty,

                issuanceStatus,

                issuedDate:
                    issueQty > 0
                        ? now()
                        : null,

                issuedBy:
                    issueQty > 0
                        ? actor
                        : ""

            };

        });

    document.issuedBy =
        actor;

    document.issuedDate =
        now();

    document.issuanceSummary = {

        issuedItemCount:
            issuableItems.length,

        issuedQuantity:
            issuableItems.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.issueQty ||
                        item.approvedQty ||
                        0
                    ),
                0
            ),

        procurementItemCount:
            document.items.filter(
                item =>
                    Number(
                        item.procurementQty || 0
                    ) > 0
            ).length,

        procurementQuantity:
            document.items.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.procurementQty || 0
                    ),
                0
            )

    };

    changeStatus(

        document,

        STATUS.ISSUED,

        actor,

        document.issuanceSummary
            .procurementQuantity > 0
            ? "Available quantities issued. " +
                "Unavailable quantities retained for procurement."
            : "All approved quantities issued."

    );

    await saveDocument(
        document
    );

    return {

        success: true,

        message:
            document.issuanceSummary
                .procurementQuantity > 0
                ? "Available items issued; remaining items are for procurement."
                : "RIS issued successfully.",

        document,

        inventory:
            response,

        issuedItems:
            document.items.filter(
                item =>
                    Number(
                        item.issuedQty || 0
                    ) > 0
            ),

        procurementItems:
            document.items.filter(
                item =>
                    Number(
                        item.procurementQty || 0
                    ) > 0
            ),

        errors: []

    };

}

    // ======================================================
    // Completion Engine
    // ======================================================

    async function complete(

        risId,

        completedBy,

        remarks = ""

    ) {

        const document =

            getDocument(risId);

        changeStatus(

            document,

            STATUS.COMPLETED,

            completedBy,

            remarks

        );

        await saveDocument(document);

        return document;

    }

    // ======================================================
    // Dashboard Statistics
    // ======================================================

    function statistics() {

    return RisRegistryService.statistics();

    }

    // ======================================================
    // Lookup Helpers
    // ======================================================

    function find(risId) {

        return RisRegistryService.findById(risId);

    }

    function getAll() {

        return RisRegistryService.getAll();

    }

    function findDrafts() {

        return RisRegistryService.findDrafts();

    }

    function findPending() {

        return RisRegistryService.findPending();

    }

    function findOutstanding() {

        return RisRegistryService.findOutstanding();

    }

    // ======================================================
    // Legacy Compatibility
    // ======================================================

    async function process(request = {}) {

        console.log("STEP 1 - process() entered");


        try {
            console.log("STEP 2 - before createDraft");
            // =====================================
            // Step 1 : Create Draft
            // =====================================

            const draft = await createDraft({

                requestedBy: request.requestedBy,

                division: request.division,

                office: request.office,

                rcc: request.rcc,

                purpose: request.purpose,

                remarks: request.remarks,

                items: request.items,

                requestDate: request.requestDate

            });
            console.log("STEP 3 - draft created", draft);

            console.log(
                "Registry after draft:",
                localStorage.getItem("TAESF_RIS_REGISTRY")
            );
            // =====================================
            // Step 2 : Submit Draft
            // =====================================

            const document = await submit(

                draft.risId,

                request.user ||

                request.requestedBy

            );
            console.log("STEP 4 - submit complete", document);
            const inventoryEvaluation =

            evaluateInventory(

                document.items

            );

            // =====================================
            // Step 3 : Return Enterprise Response
            // =====================================

            return {

            success: true,

            message:
                "RIS successfully created.",

            document,

            availableItems:

                inventoryEvaluation
                    .availableItems,

            procurementItems:

                inventoryEvaluation
                    .procurementItems

        };

        }
        catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message,

                document: null

            };

        }

    }

    // ======================================================
    // Public API
    // ======================================================

    return Object.freeze({

        STATUS,

        createDocument,

        validateDocument,

        createDraft,

        updateDraft,

        deleteDraft,

        submit,

        startReview,

        approve,

        reject,

        returnForRevision,

        reserve,

        issue,

        complete,

        statistics,

        find,

        getAll,

        findDrafts,

        findPending,

        findOutstanding,

        process

    });

})();