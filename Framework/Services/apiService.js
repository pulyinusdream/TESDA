/**
 * ==========================================================
 * TAESF Framework
 * ApiService
 * Version: 1.0.0
 * ==========================================================
 */

const ApiService = (() => {

    async function execute(action, payload = {}) {

    const request = {

        action,

        ...payload

    };

    const response = await fetch(CLOUD_URL, {

    method: "POST",

    body: JSON.stringify(request)

});

    const text = await response.text();
    console.log(
    "Raw Backend Response:",
    text
    );

    let result;

    try {

        result = JSON.parse(text);

    }
    catch {

        result = {

            success: text === "Success",

            message: text,

            data: null

        };

    }

    if (!result.success) {

        throw new Error(

            result.message ||

            "Server Error"

        );

    }

        return result.data;

    }

    return {

        execute

    };

})();