/**
 * ==========================================================
 * TAESF Framework
 * Schema Registry
 * Version: 1.1.0-alpha
 * ==========================================================
 *
 * Central registry for all TAESF storage and domain schema
 * versions.
 *
 * Rules:
 * - Services must reference this registry.
 * - Schema version numbers must not be hard-coded in
 *   business services.
 * - A schema number increases only when the persisted
 *   structure changes.
 * ==========================================================
 */

const FrameworkSchema = Object.freeze({

    /**
     * Employee master data schema.
     */
    EMPLOYEE:
        1,

    /**
     * Inventory Ledger schema.
     *
     * Version 11 introduces:
     * - transaction-driven inventory
     * - immutable inventory movements
     * - ledger-based replay
     * - inventory reconstruction
     */
    INVENTORY_LEDGER:
        11

});