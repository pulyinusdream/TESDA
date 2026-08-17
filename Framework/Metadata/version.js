/**
 * ==========================================================
 * TAESF Framework
 * Framework Version
 * Version: 1.1.0-alpha
 * ==========================================================
 *
 * Central version descriptor for the TAESF frontend
 * framework.
 *
 * Sprint 11.1 introduces the Inventory Ledger foundation:
 * - Inventory Ledger repository
 * - Inventory Ledger business service
 * - Backend ledger commands
 * - Frontend ledger gateway
 * - Schema and migration metadata
 *
 * This release does not yet make the ledger authoritative
 * for inventory balances. Replay and migration will be
 * introduced in succeeding sprints.
 * ==========================================================
 */

const FrameworkVersion = Object.freeze({

    /**
     * Framework name.
     */
    NAME:
        "TAESF",

    /**
     * Semantic framework version.
     */
    VERSION:
        "1.1.0-alpha",

    /**
     * Release build identifier.
     */
    BUILD:
        "SPRINT-11.1",

    /**
     * Release status.
     */
    STATUS:
        "Development",

    /**
     * Primary release feature.
     */
    RELEASE:
        "Inventory Ledger Foundation",

    /**
     * Inventory architecture version.
     */
    INVENTORY_VERSION:
        11

});