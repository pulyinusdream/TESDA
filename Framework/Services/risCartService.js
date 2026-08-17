/**
 * ==========================================================
 * TAESF Framework
 * RIS Cart Service (Application Facade)
 * Version: 2.0.0
 * ==========================================================
 *
 * Public Cart API
 *
 * This service is the only public entry point used by
 * the AIMS RIS application.
 *
 * The cart state is owned by the TAESF Cart Feature.
 * ==========================================================
 */

const RisCartService = (() => {

    let feature = null;

    function getFeature() {

        if (!feature) {

            feature =
                new TAESF
                    .Applications
                    .AIMS
                    .RIS
                    .Features
                    .Cart
                    .Feature();

        }

        return feature;

    }

    function getService() {

        return getFeature().getService();

    }

    function addItem(item) {

        return getService().add(item);

    }

    function removeItem(itemId) {

        return getService().remove(itemId);

    }

    function updateQuantity(itemId, quantity) {

        return getService().updateQuantity(
            itemId,
            quantity
        );

    }

    function clear() {

        return getService().clear();

    }

    function getItems() {

        return getService().getItems();

    }

    function getItem(itemId) {

        return getService().getItem(itemId);

    }

    function getTotalItems() {

        return getService().getCount();

    }

    function isEmpty() {

        return getService().getCount() === 0;

    }

    return {

        addItem,

        removeItem,

        updateQuantity,

        clear,

        getItems,

        getItem,

        getTotalItems,

        isEmpty

    };

})();