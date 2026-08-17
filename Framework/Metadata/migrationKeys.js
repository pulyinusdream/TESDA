/**
 * ==========================================================
 * TAESF Framework
 * Migration Keys
 * Version: 1.1.0-alpha
 * ==========================================================
 *
 * Central registry for all TAESF migration identifiers.
 *
 * Rules:
 * - Migration services must reference this registry.
 * - Migration identifiers must never be hard-coded in
 *   business services.
 * - A migration key must remain permanent once released.
 * - Completed migration keys must not be renamed or reused.
 * ==========================================================
 */

const MigrationKeys = Object.freeze({

    /**
     * Employee master data migration.
     */
    EMPLOYEE_V1:
        "TAESF_MIGRATION_EMPLOYEE_V1",

    /**
     * Inventory Ledger Version 11 migration.
     *
     * This key will mark completion of the controlled import
     * of legacy inventory transactions into the immutable
     * Inventory Ledger.
     */
    INVENTORY_LEDGER_V11:
        "TAESF_MIGRATION_INVENTORY_LEDGER_V11"

});