"use strict";

NEXUS_RRMS.Services.Storage = (() => {
    const settings = NEXUS_RRMS.Configuration.Settings;
    let provider = NEXUS_RRMS.Storage.Local;

    function buildKey(key) {
        return `${settings.STORAGE_PREFIX}:${key}`;
    }

    function setProvider(nextProvider) {
        if (!nextProvider || typeof nextProvider.set !== "function" || typeof nextProvider.get !== "function") {
            throw new TypeError("A valid RRMS storage provider is required.");
        }
        provider = nextProvider;
    }

    function save(key, value) {
        provider.set(buildKey(key), value);
    }

    function load(key, fallbackValue = null) {
        const value = provider.get(buildKey(key));
        return value === null ? fallbackValue : value;
    }

    function remove(key) {
        provider.remove(buildKey(key));
    }

    function clearApplicationData() {
        provider.clearByPrefix(`${settings.STORAGE_PREFIX}:`);
    }

    return Object.freeze({ setProvider, save, load, remove, clearApplicationData });
})();
