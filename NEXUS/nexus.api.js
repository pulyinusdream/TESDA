window.NexusApi = (() => {

  "use strict";


  async function execute(
    action,
    payload = {}
  ) {

    const config =
      window.NEXUS_CONFIG;

    if (
      !config ||
      !config.API_URL
    ) {

      throw new Error(
        "NEXUS API configuration is missing."
      );

    }

    let response;

    try {

      response = await fetch(
        config.API_URL,
        {

          method:
            "POST",

          redirect:
            "follow",

          headers: {

            "Content-Type":
              "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify({

              action:
                action,

              ...payload

            })

        }
      );

    }
    catch (error) {

      console.error(
        "NEXUS NETWORK ERROR",
        error
      );

      throw new Error(
        "Unable to connect to the NEXUS backend. Check the Apps Script deployment URL and internet connection."
      );

    }


    const responseText =
      await response.text();


    console.log(
      "NEXUS BACKEND RESPONSE",
      {
        action:
          action,

        httpStatus:
          response.status,

        responseUrl:
          response.url,

        responseText:
          responseText
      }
    );


    let envelope;

    try {

      envelope =
        JSON.parse(
          responseText
        );

    }
    catch (error) {

      const preview =
        responseText
          .replace(
            /\s+/g,
            " "
          )
          .trim()
          .slice(
            0,
            300
          );

      console.error(
        "NEXUS INVALID RESPONSE",
        preview
      );

      if (
        preview.includes(
          "<!DOCTYPE html"
        ) ||
        preview.includes(
          "<html"
        )
      ) {

        throw new Error(
          "The Apps Script deployment returned an HTML page instead of JSON. Confirm that the web app is deployed as 'Execute as Me' and accessible to 'Anyone'."
        );

      }

      throw new Error(
        preview
          ? "Invalid backend response: " +
            preview
          : "The NEXUS backend returned an empty response."
      );

    }


    /*
     * Standard TAESF response:
     *
     * {
     *   success: true,
     *   message: "...",
     *   data: {...}
     * }
     */
    if (
      envelope &&
      (
        envelope.success === true ||
        envelope.success === "true"
      )
    ) {

      let data =
        envelope.data;

      /*
       * Some Apps Script response paths serialize data twice:
       *
       * {
       *   success: true,
       *   data: "{\"result\":\"AUTHORIZED\",...}"
       * }
       *
       * Parse nested JSON strings before returning them.
       */
      for (
        let depth = 0;
        depth < 3;
        depth += 1
      ) {

        if (
          typeof data !== "string"
        ) {

          break;

        }

        const trimmed =
          data.trim();

        if (
          !trimmed ||
          (
            !trimmed.startsWith("{") &&
            !trimmed.startsWith("[")
          )
        ) {

          break;

        }

        try {

          data =
            JSON.parse(
              trimmed
            );

        }
        catch (error) {

          break;

        }

      }

      /*
       * Also unwrap a nested TAESF envelope when one response
       * has been wrapped inside another.
       */
      if (
        data &&
        typeof data === "object" &&
        (
          data.success === true ||
          data.success === "true"
        ) &&
        Object.prototype.hasOwnProperty.call(
          data,
          "data"
        )
      ) {

        data =
          data.data;

        if (
          typeof data === "string"
        ) {

          try {

            data =
              JSON.parse(
                data
              );

          }
          catch (error) {

            // Keep the original string when it is not JSON.
          }

        }

      }

      return data;

    }


    /*
     * Some Apps Script errors may return:
     *
     * {
     *   error: "..."
     * }
     */
    if (
      envelope &&
      envelope.error
    ) {

      throw new Error(
        String(
          envelope.error
        )
      );

    }


    /*
     * Standard TAESF error envelope.
     */
    if (
      envelope &&
      envelope.success === false
    ) {

      let backendMessage =
        envelope.message ||
        "The NEXUS backend rejected the request.";

      if (
        Array.isArray(
          envelope.errors
        ) &&
        envelope.errors.length
      ) {

        backendMessage +=
          " " +
          envelope.errors
            .map(
              item =>
                typeof item === "string"
                  ? item
                  : JSON.stringify(
                      item
                    )
            )
            .join(
              "; "
            );

      }

      throw new Error(
        backendMessage
      );

    }


    /*
     * Accept a direct command result only when it clearly
     * contains a NEXUS result property.
     */
    if (
      envelope &&
      typeof envelope === "object" &&
      (
        envelope.result ||
        envelope.authenticated !==
          undefined ||
        envelope.authorized !==
          undefined
      )
    ) {

      return envelope;

    }


    console.error(
      "UNRECOGNIZED NEXUS RESPONSE",
      {
        action:
          action,

        envelope:
          envelope,

        envelopeType:
          typeof envelope,

        successValue:
          envelope &&
          envelope.success,

        dataType:
          envelope &&
          typeof envelope.data
      }
    );

    throw new Error(
      envelope &&
      envelope.message
        ? envelope.message
        : "The NEXUS backend returned an unrecognized response."
    );

  }


  return Object.freeze({

    execute

  });

})();