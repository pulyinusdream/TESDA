/**
 * ==========================================================
 * TAESF Sprint 11.1
 * Inventory Ledger End-to-End Test
 * Version: 1.0.0
 * ==========================================================
 *
 * Verifies:
 * - Framework metadata
 * - Frontend InventoryLedgerService
 * - BaseBusinessService
 * - ApiService transport
 * - Backend command routing
 * - Backend ledger validation
 * - Repository persistence
 * - Ledger retrieval
 *
 * This test creates one temporary ledger record.
 * The record must be manually removed from the
 * InventoryLedger sheet after testing.
 * ==========================================================
 */

async function testInventoryLedgerEndToEnd() {

    const uniqueSuffix =
        Date.now();

    const ledgerId =
        "TEST-E2E-LEDGER-" +
        uniqueSuffix;

    const transactionId =
        "TEST-E2E-TRANSACTION-" +
        uniqueSuffix;

    const itemId =
        "TEST-E2E-ITEM-" +
        uniqueSuffix;

    const referenceNo =
        "TEST-E2E-PO-" +
        uniqueSuffix;

    console.log(
        "========================================"
    );

    console.log(
        "TAESF Sprint 11.1 End-to-End Test"
    );

    console.log(
        "========================================"
    );

    /*
     * Test 1:
     * Verify framework metadata.
     */
    verifyFrameworkMetadata();

    console.log(
        "1. Framework metadata passed."
    );

    /*
     * Test 2:
     * Verify frontend services exist.
     */
    verifyFrontendServices();

    console.log(
        "2. Frontend service availability passed."
    );

    /*
     * Test 3:
     * Record one inventory ledger movement.
     */
    const movement = {

        ledgerId:
            ledgerId,

        transactionId:
            transactionId,

        transactionType:
            "RECEIPT",

        transactionDate:
            getLocalIsoDate(),

        itemId:
            itemId,

        quantity:
            "8",

        unitCost:
            "125.50",

        office:
            "TESDA Albay Provincial Office",

        division:
            "Administrative Unit",

        fundCluster:
            "101 - Regular",

        referenceNo:
            referenceNo,

        referenceType:
            "PURCHASE_ORDER",

        remarks:
            "Sprint 11.1 end-to-end verification",

        source:
            "TAESF_E2E_TEST",

        createdBy:
            "FRONTEND_E2E_TEST",

        metadata: {

            testType:
                "SPRINT_11_1_E2E",

            requestedSchema:
                FrameworkSchema
                    .INVENTORY_LEDGER

        }

    };

    const recordResponse =
        await InventoryLedgerService.record(
            movement
        );

    console.log(
        "3. Record response:",
        recordResponse
    );

    verifyBusinessResponse(
        recordResponse,
        "Ledger record"
    );

    const savedEntry =
        InventoryLedgerService.unwrap(
            recordResponse
        );

    verifySavedEntry(
        savedEntry,
        {
            ledgerId,
            transactionId,
            itemId,
            referenceNo
        }
    );

    console.log(
        "4. Ledger persistence passed."
    );

    /*
     * Test 4:
     * Retrieve the same record by ledger ID.
     */
    const idResponse =
        await InventoryLedgerService.getById(
            ledgerId
        );

    verifyBusinessResponse(
        idResponse,
        "Get ledger by ID"
    );

    const foundById =
        InventoryLedgerService.unwrap(
            idResponse
        );

    if (
        !foundById ||
        foundById.ledgerId !== ledgerId
    ) {
        throw new Error(
            "Get-by-ID verification failed."
        );
    }

    console.log(
        "5. Get-by-ID passed."
    );

    /*
     * Test 5:
     * Retrieve by item ID.
     */
    const itemResponse =
        await InventoryLedgerService
            .getByItemId(
                itemId
            );

    verifyBusinessResponse(
        itemResponse,
        "Get ledger by item"
    );

    const itemEntries =
        InventoryLedgerService.unwrap(
            itemResponse
        );

    verifyArrayContainsLedger(
        itemEntries,
        ledgerId,
        "Get-by-item"
    );

    console.log(
        "6. Get-by-item passed."
    );

    /*
     * Test 6:
     * Retrieve by transaction ID.
     */
    const transactionResponse =
        await InventoryLedgerService
            .getByTransactionId(
                transactionId
            );

    verifyBusinessResponse(
        transactionResponse,
        "Get ledger by transaction"
    );

    const transactionEntries =
        InventoryLedgerService.unwrap(
            transactionResponse
        );

    verifyArrayContainsLedger(
        transactionEntries,
        ledgerId,
        "Get-by-transaction"
    );

    console.log(
        "7. Get-by-transaction passed."
    );

    /*
     * Test 7:
     * Retrieve by reference number.
     */
    const referenceResponse =
        await InventoryLedgerService
            .getByReference(
                referenceNo
            );

    verifyBusinessResponse(
        referenceResponse,
        "Get ledger by reference"
    );

    const referenceEntries =
        InventoryLedgerService.unwrap(
            referenceResponse
        );

    verifyArrayContainsLedger(
        referenceEntries,
        ledgerId,
        "Get-by-reference"
    );

    console.log(
        "8. Get-by-reference passed."
    );

    /*
     * Test 8:
     * Retrieve by transaction type.
     */
    const typeResponse =
        await InventoryLedgerService
            .getByType(
                "RECEIPT"
            );

    verifyBusinessResponse(
        typeResponse,
        "Get ledger by type"
    );

    const typeEntries =
        InventoryLedgerService.unwrap(
            typeResponse
        );

    verifyArrayContainsLedger(
        typeEntries,
        ledgerId,
        "Get-by-type"
    );

    console.log(
        "9. Get-by-type passed."
    );

    /*
     * Test 9:
     * Retrieve by fund cluster.
     */
    const fundResponse =
        await InventoryLedgerService
            .getByFundCluster(
                "101 - Regular"
            );

    verifyBusinessResponse(
        fundResponse,
        "Get ledger by fund"
    );

    const fundEntries =
        InventoryLedgerService.unwrap(
            fundResponse
        );

    verifyArrayContainsLedger(
        fundEntries,
        ledgerId,
        "Get-by-fund"
    );

    console.log(
        "10. Get-by-fund passed."
    );

    /*
     * Test 10:
     * Verify supported transaction types.
     */
    const typesResponse =
        await InventoryLedgerService
            .getTransactionTypes();

    verifyBusinessResponse(
        typesResponse,
        "Get transaction types"
    );

    const transactionTypes =
        InventoryLedgerService.unwrap(
            typesResponse
        );

    verifyTransactionTypes(
        transactionTypes
    );

    console.log(
        "11. Transaction type registry passed."
    );

    /*
     * Test 11:
     * Verify ledger summary.
     */
    const summaryResponse =
        await InventoryLedgerService
            .getSummary();

    verifyBusinessResponse(
        summaryResponse,
        "Get ledger summary"
    );

    const summary =
        InventoryLedgerService.unwrap(
            summaryResponse
        );

    verifySummary(
        summary
    );

    console.log(
        "12. Ledger summary passed:",
        summary
    );

    /*
     * Test 12:
     * Confirm frontend validation.
     */
    await verifyFrontendValidation();

    console.log(
        "13. Frontend validation passed."
    );

    console.log(
        "========================================"
    );

    console.log(
        "Sprint 11.1 End-to-End Test PASSED."
    );

    console.log(
        "Temporary ledger ID:",
        ledgerId
    );

    console.log(
        "Remove only the InventoryLedger row containing this ID."
    );

    console.log(
        "========================================"
    );

    return {

        success:
            true,

        ledgerId:
            ledgerId,

        transactionId:
            transactionId,

        itemId:
            itemId,

        referenceNo:
            referenceNo,

        savedEntry:
            savedEntry,

        summary:
            summary

    };

}


/**
 * Verifies framework metadata.
 */
function verifyFrameworkMetadata() {

    if (
        typeof FrameworkVersion ===
        "undefined"
    ) {
        throw new Error(
            "FrameworkVersion is not loaded."
        );
    }

    if (
        typeof FrameworkSchema ===
        "undefined"
    ) {
        throw new Error(
            "FrameworkSchema is not loaded."
        );
    }

    if (
        typeof MigrationKeys ===
        "undefined"
    ) {
        throw new Error(
            "MigrationKeys is not loaded."
        );
    }

    if (
        FrameworkVersion.NAME !==
        "TAESF"
    ) {
        throw new Error(
            "Framework name is invalid."
        );
    }

    if (
        FrameworkVersion.VERSION !==
        "1.1.0-alpha"
    ) {
        throw new Error(
            "Framework version is invalid."
        );
    }

    if (
        FrameworkVersion.BUILD !==
        "SPRINT-11.1"
    ) {
        throw new Error(
            "Framework build is invalid."
        );
    }

    if (
        FrameworkVersion
            .INVENTORY_VERSION !== 11
    ) {
        throw new Error(
            "Inventory architecture version is invalid."
        );
    }

    if (
        FrameworkSchema
            .INVENTORY_LEDGER !== 11
    ) {
        throw new Error(
            "Inventory Ledger schema is invalid."
        );
    }

    if (
        FrameworkVersion
            .INVENTORY_VERSION !==
        FrameworkSchema
            .INVENTORY_LEDGER
    ) {
        throw new Error(
            "Inventory version and ledger schema do not match."
        );
    }

    if (
        MigrationKeys
            .INVENTORY_LEDGER_V11 !==
        "TAESF_MIGRATION_INVENTORY_LEDGER_V11"
    ) {
        throw new Error(
            "Inventory Ledger migration key is invalid."
        );
    }

    if (
        !Object.isFrozen(
            FrameworkVersion
        )
    ) {
        throw new Error(
            "FrameworkVersion must be frozen."
        );
    }

    if (
        !Object.isFrozen(
            FrameworkSchema
        )
    ) {
        throw new Error(
            "FrameworkSchema must be frozen."
        );
    }

    if (
        !Object.isFrozen(
            MigrationKeys
        )
    ) {
        throw new Error(
            "MigrationKeys must be frozen."
        );
    }

}


/**
 * Verifies required frontend services.
 */
function verifyFrontendServices() {

    if (
        typeof ApiService ===
        "undefined"
    ) {
        throw new Error(
            "ApiService is not loaded."
        );
    }

    if (
        typeof BaseBusinessService ===
        "undefined"
    ) {
        throw new Error(
            "BaseBusinessService is not loaded."
        );
    }

    if (
        typeof InventoryLedgerService ===
        "undefined"
    ) {
        throw new Error(
            "InventoryLedgerService is not loaded."
        );
    }

    const requiredFunctions = [

        "record",

        "recordMany",

        "getAll",

        "getById",

        "getByItemId",

        "getByTransactionId",

        "getByReference",

        "getByType",

        "getByFundCluster",

        "getSummary",

        "getTransactionTypes",

        "isSuccessful",

        "unwrap"

    ];

    requiredFunctions.forEach(
        functionName => {

            if (
                typeof InventoryLedgerService[
                    functionName
                ] !== "function"
            ) {
                throw new Error(
                    "InventoryLedgerService." +
                    functionName +
                    " is not available."
                );
            }

        }
    );

}


/**
 * Verifies the standard BaseBusinessService response.
 */
function verifyBusinessResponse(
    response,
    operationName
) {

    if (!response) {
        throw new Error(
            operationName +
            " returned no response."
        );
    }

    if (
        response.success !== true
    ) {
        throw new Error(
            operationName +
            " failed: " +
            (
                response.message ||
                "Unknown business error."
            )
        );
    }

    if (
        response.mode !== "taesf"
    ) {
        throw new Error(
            operationName +
            " returned an invalid mode."
        );
    }

    if (
        response.backendReachable !== true
    ) {
        throw new Error(
            operationName +
            " could not reach the backend."
        );
    }

}


/**
 * Verifies the normalized saved ledger entry.
 */
function verifySavedEntry(
    entry,
    expected
) {

    if (!entry) {
        throw new Error(
            "The saved ledger entry is empty."
        );
    }

    if (
        entry.ledgerId !==
        expected.ledgerId
    ) {
        throw new Error(
            "Saved ledger ID does not match."
        );
    }

    if (
        entry.transactionId !==
        expected.transactionId
    ) {
        throw new Error(
            "Saved transaction ID does not match."
        );
    }

    if (
        entry.itemId !==
        expected.itemId
    ) {
        throw new Error(
            "Saved item ID does not match."
        );
    }

    if (
        entry.referenceNo !==
        expected.referenceNo
    ) {
        throw new Error(
            "Saved reference number does not match."
        );
    }

    if (
        entry.transactionType !==
        "RECEIPT"
    ) {
        throw new Error(
            "Transaction type was not normalized."
        );
    }

    if (
        entry.quantity !== 8
    ) {
        throw new Error(
            "Quantity was not normalized."
        );
    }

    if (
        entry.unitCost !== 125.5
    ) {
        throw new Error(
            "Unit cost was not normalized."
        );
    }

    if (
        entry.totalCost !== 1004
    ) {
        throw new Error(
            "Expected total cost of 1004."
        );
    }

    if (
        !entry.metadata
    ) {
        throw new Error(
            "Ledger metadata is missing."
        );
    }

    if (
        entry.metadata.schemaVersion !==
        FrameworkSchema
            .INVENTORY_LEDGER
    ) {
        throw new Error(
            "Ledger schema metadata is invalid."
        );
    }

    if (
        entry.metadata.framework !==
        FrameworkVersion.NAME
    ) {
        throw new Error(
            "Ledger framework metadata is invalid."
        );
    }

    if (
        !entry.metadata.createdAt
    ) {
        throw new Error(
            "Ledger creation timestamp is missing."
        );
    }

    if (
        entry.metadata.createdBy !==
        "FRONTEND_E2E_TEST"
    ) {
        throw new Error(
            "Ledger createdBy metadata is invalid."
        );
    }

    if (
        entry.metadata.testType !==
        "SPRINT_11_1_E2E"
    ) {
        throw new Error(
            "Custom metadata was not preserved."
        );
    }

}


/**
 * Confirms an array contains the expected ledger record.
 */
function verifyArrayContainsLedger(
    entries,
    ledgerId,
    operationName
) {

    if (!Array.isArray(entries)) {
        throw new Error(
            operationName +
            " did not return an array."
        );
    }

    const found =
        entries.some(entry =>
            entry &&
            entry.ledgerId === ledgerId
        );

    if (!found) {
        throw new Error(
            operationName +
            " did not return the test ledger entry."
        );
    }

}


/**
 * Verifies required transaction types.
 */
function verifyTransactionTypes(
    transactionTypes
) {

    if (
        !Array.isArray(
            transactionTypes
        )
    ) {
        throw new Error(
            "Transaction types must be an array."
        );
    }

    const requiredTypes = [

        "BEGINNING_BALANCE",

        "MIGRATION",

        "RECEIPT",

        "ISSUE",

        "RESERVE",

        "RELEASE",

        "RETURN",

        "TRANSFER_IN",

        "TRANSFER_OUT",

        "ADJUSTMENT"

    ];

    requiredTypes.forEach(type => {

        if (
            !transactionTypes.includes(
                type
            )
        ) {
            throw new Error(
                "Missing transaction type: " +
                type
            );
        }

    });

}


/**
 * Verifies repository-level summary.
 */
function verifySummary(summary) {

    if (
        !summary ||
        typeof summary !== "object"
    ) {
        throw new Error(
            "Ledger summary is invalid."
        );
    }

    if (
        typeof summary.totalRecords !==
        "number"
    ) {
        throw new Error(
            "Ledger totalRecords is invalid."
        );
    }

    if (
        summary.totalRecords < 1
    ) {
        throw new Error(
            "Ledger summary contains no records."
        );
    }

    if (
        !summary.transactionTypes ||
        typeof summary.transactionTypes !==
        "object"
    ) {
        throw new Error(
            "Ledger transaction type summary is invalid."
        );
    }

    if (
        !summary.transactionTypes.RECEIPT
    ) {
        throw new Error(
            "Ledger summary does not include RECEIPT."
        );
    }

    if (
        summary.sheetName !==
        "InventoryLedger"
    ) {
        throw new Error(
            "Ledger sheet name is invalid."
        );
    }

}


/**
 * Verifies frontend input validation.
 */
/**
 * Verifies frontend input validation.
 *
 * InventoryLedgerService methods are asynchronous.
 * Validation errors therefore surface as rejected Promises
 * and must be awaited inside try/catch blocks.
 */
async function verifyFrontendValidation() {

    let missingLedgerIdRejected =
        false;

    try {

        await InventoryLedgerService.getById(
            ""
        );

    }
    catch (error) {

        missingLedgerIdRejected =
            true;

        console.log(
            "Frontend correctly rejected empty ledger ID:",
            error.message
        );

    }

    if (!missingLedgerIdRejected) {
        throw new Error(
            "Empty ledger ID was not rejected."
        );
    }

    let invalidMovementRejected =
        false;

    try {

        await InventoryLedgerService.record(
            null
        );

    }
    catch (error) {

        invalidMovementRejected =
            true;

        console.log(
            "Frontend correctly rejected invalid movement:",
            error.message
        );

    }

    if (!invalidMovementRejected) {
        throw new Error(
            "Invalid ledger movement was not rejected."
        );
    }

    let emptyBatchRejected =
        false;

    try {

        await InventoryLedgerService.recordMany(
            []
        );

    }
    catch (error) {

        emptyBatchRejected =
            true;

        console.log(
            "Frontend correctly rejected empty batch:",
            error.message
        );

    }

    if (!emptyBatchRejected) {
        throw new Error(
            "Empty ledger batch was not rejected."
        );
    }

}


/**
 * Returns the current local date in YYYY-MM-DD format.
 */
function getLocalIsoDate() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}