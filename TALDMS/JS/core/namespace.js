"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : namespace.js
 * Module      : Enterprise Core
 * Description : Initializes the global enterprise namespace.
 *               This file MUST be loaded before all other
 *               JavaScript files.
 *
 * Version     : 1.0.0
 * Author      : TESDA Albay Enterprise Systems Framework
 * ==========================================================
 */

/**
 * ----------------------------------------------------------
 * Create the global TAESF namespace if it does not yet exist.
 * ----------------------------------------------------------
 */
window.TAESF = window.TAESF || {};

/**
 * ----------------------------------------------------------
 * Core Framework
 * ----------------------------------------------------------
 * Contains the reusable framework components.
 */
TAESF.Core = TAESF.Core || {};

/**
 * ----------------------------------------------------------
 * Configuration
 * ----------------------------------------------------------
 * Contains application configuration, constants,
 * routes, environment settings, and version information.
 */
TAESF.Configuration = TAESF.Configuration || {};

/**
 * ----------------------------------------------------------
 * Services
 * ----------------------------------------------------------
 * Contains reusable business services.
 */
TAESF.Services = TAESF.Services || {};

/**
 * ----------------------------------------------------------
 * Modules
 * ----------------------------------------------------------
 * Contains business modules.
 */
TAESF.Modules = TAESF.Modules || {};

/**
 * ----------------------------------------------------------
 * Shared
 * ----------------------------------------------------------
 * Shared helper functions and reusable components.
 */
TAESF.Shared = TAESF.Shared || {};

/**
 * ----------------------------------------------------------
 * Utilities
 * ----------------------------------------------------------
 * Generic utility functions.
 */
TAESF.Utilities = TAESF.Utilities || {};

/**
 * ----------------------------------------------------------
 * Models
 * ----------------------------------------------------------
 * Data models.
 */
TAESF.Models = TAESF.Models || {};

/**
 * ----------------------------------------------------------
 * Repositories
 * ----------------------------------------------------------
 * Data access layer.
 */
TAESF.Repositories = TAESF.Repositories || {};

/**
 * ----------------------------------------------------------
 * Controllers
 * ----------------------------------------------------------
 * Application controllers.
 */
TAESF.Controllers = TAESF.Controllers || {};

/**
 * ----------------------------------------------------------
 * Application State
 * ----------------------------------------------------------
 * Runtime information shared across modules.
 */
TAESF.State = TAESF.State || {};

/**
 * ----------------------------------------------------------
 * Freeze only the root namespace to prevent accidental
 * replacement. Child objects remain extendable.
 * ----------------------------------------------------------
 */
