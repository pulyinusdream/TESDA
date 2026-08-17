/**
 * ==========================================================
 * Sprint 11.1 Frontend Test
 * InventoryLedgerService
 * ==========================================================
 */

async function testFrontendInventoryLedgerService() {

    const uniqueSuffix =
        Date.now();

    const ledgerId =
        "TEST-FRONTEND-LEDGER-" +
        uniqueSuffix;

    const transactionId =
        "TEST-FRONTEND-TRANSACTION-" +
        uniqueSuffix;

    console.log(
        "========================================"
    );

    console.log(
        "Starting frontend Inventory Ledger test."
    );

    console.log(
        "========================================"
    );

    const recordResponse =
        await InventoryLedgerService.record({

            ledgerId,

            transactionId,

            transactionType:
                "RECEIPT",

            transactionDate:
                "2026-07-25",

            itemId:
                "TEST-FRONTEND-ITEM",

            quantity:
                "5",

            unitCost:
                "20",

            fundCluster:
                "101 - Regular",

            referenceNo:
                "TEST-FRONTEND-PO-" +
                uniqueSuffix,

            referenceType:
                "PURCHASE_ORDER",

            source:
                "FRONTEND_SERVICE_TEST",

            createdBy:
                "FRONTEND_TEST"

        });

    console.log(
        "1. Record response:",
        recordResponse
    );

    if (
        !InventoryLedgerService
            .isSuccessful(recordResponse)
    ) {
        throw new Error(
            "Frontend record command failed: " +
            recordResponse.message
        );
    }

    const savedEntry =
        InventoryLedgerService.unwrap(
            recordResponse
        );

    if (
        !savedEntry ||
        savedEntry.ledgerId !== ledgerId
    ) {
        throw new Error(
            "Saved ledger entry is invalid."
        );
    }

    if (savedEntry.totalCost !== 100) {
        throw new Error(
            "Expected total cost of 100."
        );
    }

    console.log(
        "2. Record command passed."
    );

    const idResponse =
        await InventoryLedgerService.getById(
            ledgerId
        );

    const foundEntry =
        InventoryLedgerService.unwrap(
            idResponse
        );

    if (
        !foundEntry ||
        foundEntry.ledgerId !== ledgerId
    ) {
        throw new Error(
            "Get-by-ID command failed."
        );
    }

    console.log(
        "3. Get-by-ID passed."
    );

    const itemResponse =
        await InventoryLedgerService
            .getByItemId(
                "TEST-FRONTEND-ITEM"
            );

    const itemEntries =
        InventoryLedgerService.unwrap(
            itemResponse
        );

    const foundByItem =
        itemEntries.some(entry =>
            entry.ledgerId === ledgerId
        );

    if (!foundByItem) {
        throw new Error(
            "Get-by-item command failed."
        );
    }

    console.log(
        "4. Get-by-item passed."
    );

    const transactionResponse =
        await InventoryLedgerService
            .getByTransactionId(
                transactionId
            );

    const transactionEntries =
        InventoryLedgerService.unwrap(
            transactionResponse
        );

    if (
        transactionEntries.length !== 1
    ) {
        throw new Error(
            "Expected one transaction entry."
        );
    }

    console.log(
        "5. Get-by-transaction passed."
    );

    const summaryResponse =
        await InventoryLedgerService.getSummary();

    const summary =
        InventoryLedgerService.unwrap(
            summaryResponse
        );

    if (
        !summary ||
        typeof summary.totalRecords !== "number"
    ) {
        throw new Error(
            "Ledger summary response is invalid."
        );
    }

    console.log(
        "6. Summary passed:",
        summary
    );

    const typesResponse =
        await InventoryLedgerService
            .getTransactionTypes();

    const transactionTypes =
        InventoryLedgerService.unwrap(
            typesResponse
        );

    if (
        !Array.isArray(transactionTypes) ||
        !transactionTypes.includes(
            "RECEIPT"
        ) ||
        !transactionTypes.includes(
            "ISSUE"
        )
    ) {
        throw new Error(
            "Transaction type response is invalid."
        );
    }

    console.log(
        "7. Transaction types passed."
    );

    console.log(
        "========================================"
    );

    console.log(
        "Frontend Inventory Ledger test PASSED."
    );

    console.log(
        "========================================"
    );

}