"use strict";

/**
 * ==========================================================
 * TESDA Albay Enterprise Systems Framework (TAESF)
 * ----------------------------------------------------------
 * File        : storage.service.js
 * Module      : Enterprise Storage Service
 * Description : Storage abstraction layer.
 *
 * Framework   : TAECP v1.0.0
 * ==========================================================
 */
console.log("storage.service.js executing");
console.log("TAESF.Storage:", TAESF.Storage);
TAESF = TAESF || {};

TAESF.Services = TAESF.Services || {};

TAESF.Services.Storage = (() => {

    let provider = TAESF.Storage.Local;

    function getProvider() {

        return provider;

    }

    function setProvider(newProvider) {

        provider = newProvider;

    }

    function save(key, value) {

        provider.set(key, value);

    }

    function load(key) {

        return provider.get(key);

    }

    function remove(key) {

        provider.remove(key);

    }

    function clear() {

        provider.clear();

    }

    return Object.freeze({

        getProvider,

        setProvider,

        save,

        load,

        remove,

        clear

    });

})();