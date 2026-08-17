/**
 * ==========================================================
 * TAESF Framework
 * ReceivingService
 * Version: 1.1.0-alpha
 * ==========================================================
 */

const ReceivingService = (() => {

    async function receive(movement) {

        if (!FEATURE_FLAGS.USE_TAESF_RECEIVING) {

            console.log(
                "TAESF Receiving disabled."
            );

            return {

                success: false,

                mode: "legacy",

                backendReachable: false,

                message:
                    "Feature flag disabled."

            };

        }   

        console.log(
        "Calling inventory.receive...",
        movement
        );

        const result =
            await BaseBusinessService.execute(
                "inventory.receive",
                movement
            );

        console.log(
            "Receiving Result:",
            result
        );

        return result;

    }

    return {

        receive

    };

})();