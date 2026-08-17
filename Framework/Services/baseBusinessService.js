/**
 * ==========================================================
 * TAESF Framework
 * BaseBusinessService
 * Version: 1.0.0
 * ==========================================================
 *
 * Shared execution layer for all business services.
 */

const BaseBusinessService = (() => {

    async function execute(command, payload) {

        try {

            const result =
                await ApiService.execute(
                    command,
                    payload
                );

            return {

                success: true,

                mode: "taesf",

                backendReachable: true,

                message: "Operation completed successfully.",

                data: result

            };

        }
        catch (error) {

            console.error(
                "BusinessService Error:",
                error
            );

            return {

                success: false,

                mode: "taesf",

                backendReachable: false,

                message: error.message,

                data: null

            };

        }

    }

    return {

        execute

    };

})();