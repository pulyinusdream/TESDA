/**
 * ==========================================================
 * TAESF Framework
 * RIS UI Adapter
 * Version : 1.0.0
 * ==========================================================
 *
 * Bridges the legacy UI (risNo) to the Enterprise
 * document model (risId).
 * ==========================================================
 */

const RisUIAdapter = (() => {

    "use strict";

    function getHeaderByNumber(risNo) {

        const headers =
            getData(DB.RIS_HDR) || [];

        const header =
            headers.find(h => h.risNo === risNo);

        if (!header) {

            throw new Error(
                "RIS document not found."
            );

        }

        return header;

    }

    function getDocumentId(risNo) {

        const header =
            getHeaderByNumber(risNo);

        if (!header.risId) {

            throw new Error(

                `RIS ${risNo} has no Enterprise ID.`

            );

        }

        return header.risId;

    }

    function getDocument(risNo) {

        const risId =
            getDocumentId(risNo);

        const document =
            RisService.find(risId);

        if (!document) {

            throw new Error(

                "Enterprise document not found."

            );

        }

        return document;

    }

    return Object.freeze({

        getHeaderByNumber,

        getDocumentId,

        getDocument

    });

})();