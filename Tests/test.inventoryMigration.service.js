/**
 * ==========================================================
 * TAESF Sprint 11.2
 * Inventory Migration Frontend Service Test
 * ==========================================================
 *
 * Verifies:
 * - Frontend service availability
 * - Migration command registry
 * - Backend connectivity
 * - Migration state retrieval
 * - Response helpers
 *
 * This test does not start validation or migration.
 * ==========================================================
 */

async function testInventoryMigrationService() {

    console.log(
        "========================================"
    );

    console.log(
        "Starting InventoryMigrationService frontend test."
    );

    console.log(
        "========================================"
    );

    verifyInventoryMigrationService();

    console.log(
        "1. Frontend service structure passed."
    );

    const response =
        await InventoryMigrationService
            .getState();

    console.log(
        "2. Raw business response:",
        response
    );

    verifyBusinessResponse(
        response
    );

    console.log(
        "3. Backend response structure passed."
    );

    const state =
        InventoryMigrationService.unwrap(
            response
        );

    verifyMigrationState(
        state
    );

    console.log(
        "4. Migration state passed:",
        state
    );

    verifyStateHelpers(
        state
    );

    console.log(
        "5. State helper functions passed."
    );

    console.log(
        "========================================"
    );

    console.log(
        "InventoryMigrationService frontend test PASSED."
    );

    console.log(
        "========================================"
    );

    return {
        success:
            true,

        state:
            state
    };

}


/**
 * Verifies the public frontend service.
 */
function verifyInventoryMigrationService() {

    if (
        typeof InventoryMigrationService !==
        "object"
    ) {
        throw new Error(
            "InventoryMigrationService is not loaded."
        );
    }

    if (
        InventoryMigrationService
            .ACTIONS
            .VALIDATE !==
        "inventory.migration.validate"
    ) {
        throw new Error(
            "Migration validation command is invalid."
        );
    }

    if (
        InventoryMigrationService
            .ACTIONS
            .GET_STATE !==
        "inventory.migration.getState"
    ) {
        throw new Error(
            "Migration state command is invalid."
        );
    }

    if (
        !Object.isFrozen(
            InventoryMigrationService
        )
    ) {
        throw new Error(
            "InventoryMigrationService must be frozen."
        );
    }

    const requiredMethods = [
        "validate",
        "getState",
        "isSuccessful",
        "unwrap",
        "isCompleted",
        "isReady",
        "isRunning"
    ];

    requiredMethods.forEach(
        method => {

            if (
                typeof InventoryMigrationService[
                    method
                ] !== "function"
            ) {
                throw new Error(
                    "Missing frontend method: " +
                    method
                );
            }

        }
    );

}


/**
 * Verifies the standard business response.
 */
function verifyBusinessResponse(response) {

    if (!response) {
        throw new Error(
            "Migration state returned no response."
        );
    }

    if (
        response.success !== true
    ) {
        throw new Error(
            response.message ||
            "Migration state request failed."
        );
    }

    if (
        response.mode !== "taesf"
    ) {
        throw new Error(
            "Invalid business response mode."
        );
    }

    if (
        response.backendReachable !== true
    ) {
        throw new Error(
            "Backend is not reachable."
        );
    }

    if (
        !InventoryMigrationService
            .isSuccessful(response)
    ) {
        throw new Error(
            "isSuccessful returned false."
        );
    }

}


/**
 * Verifies the migration state object.
 */
function verifyMigrationState(state) {

    if (
        !state ||
        typeof state !== "object"
    ) {
        throw new Error(
            "Migration state is invalid."
        );
    }

    if (
        state.key !==
        "TAESF_MIGRATION_INVENTORY_LEDGER_V11"
    ) {
        throw new Error(
            "Migration key is invalid."
        );
    }

    if (!state.status) {
        throw new Error(
            "Migration status is missing."
        );
    }

    if (
        state.sourceSheet !==
        "Transactions"
    ) {
        throw new Error(
            "Migration source sheet is invalid."
        );
    }

    if (
        state.targetSheet !==
        "InventoryLedger"
    ) {
        throw new Error(
            "Migration target sheet is invalid."
        );
    }

    if (
        state.schemaVersion !== 11
    ) {
        throw new Error(
            "Migration schema version is invalid."
        );
    }

    if (
        !Array.isArray(
            state.errors
        )
    ) {
        throw new Error(
            "Migration errors must be an array."
        );
    }

}


/**
 * Verifies state helper behavior.
 */
function verifyStateHelpers(state) {

    const expectedReady =
        state.status === "READY";

    const expectedRunning =
        state.status === "RUNNING";

    const expectedCompleted =
        (
            state.status === "COMPLETED" ||
            state.status ===
                "COMPLETED_WITH_ERRORS"
        );

    if (
        InventoryMigrationService
            .isReady(state) !==
        expectedReady
    ) {
        throw new Error(
            "isReady returned an incorrect result."
        );
    }

    if (
        InventoryMigrationService
            .isRunning(state) !==
        expectedRunning
    ) {
        throw new Error(
            "isRunning returned an incorrect result."
        );
    }

    if (
        InventoryMigrationService
            .isCompleted(state) !==
        expectedCompleted
    ) {
        throw new Error(
            "isCompleted returned an incorrect result."
        );
    }

}