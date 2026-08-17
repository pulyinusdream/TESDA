/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - Request Lifecycle Service
 * Version 1.0.0
 * ============================================================
 */

(function (global) {

"use strict";

global.TAESF = global.TAESF || {};
global.TAESF.Applications = global.TAESF.Applications || {};
global.TAESF.Applications.AIMS = global.TAESF.Applications.AIMS || {};
global.TAESF.Applications.AIMS.RIS =
    global.TAESF.Applications.AIMS.RIS || {};
global.TAESF.Applications.AIMS.RIS.Features =
    global.TAESF.Applications.AIMS.RIS.Features || {};
global.TAESF.Applications.AIMS.RIS.Features.Request =
    global.TAESF.Applications.AIMS.RIS.Features.Request || {};

class RequestLifecycleService {

    constructor(){

        this.transitions = {

            DRAFT: ["SUBMITTED"],

            SUBMITTED: ["VERIFIED","REJECTED"],

            VERIFIED: ["APPROVED","REJECTED"],

            APPROVED: ["RESERVED","CANCELLED"],

            RESERVED: ["ISSUED"],

            ISSUED: ["COMPLETED"],

            COMPLETED: [],

            REJECTED: [],

            CANCELLED: []

        };

        this.historyFeature =
            new global.TAESF
                .Applications
                .AIMS
                .RIS
                .Features
                .History
                .HistoryFeature();

    }

    canTransition(from,to){

        const allowed =
            this.transitions[from] || [];

        return allowed.includes(to);

    }

    transition(request,to,user,remarks=""){

        if(!request){

            return {

                success:false,

                message:"Request is required."

            };

        }

        const from =
            request.status || "DRAFT";

        if(!this.canTransition(from,to)){

            return{

                success:false,

                message:
                    `Cannot transition from ${from} to ${to}.`

            };

        }

        request.status = to;

        request.lastUpdated = new Date().toISOString();

        request.lastUpdatedBy = user || "";

        request.remarks = remarks;

        this.historyFeature
        .controller
        .add({

            risNo:
                request.risNo || "",

            action:
                to,

            previousStatus:
                from,

            newStatus:
                to,

            performedBy:
                user || "",

            remarks:
                remarks || ""

        });
        return{

            success:true,

            request

        };

    }

    submit(request,user){

        return this.transition(
            request,
            "SUBMITTED",
            user
        );

    }

    verify(request,user){

        return this.transition(
            request,
            "VERIFIED",
            user
        );

    }

    approve(request,user){

        return this.transition(
            request,
            "APPROVED",
            user
        );

    }

    reserve(request,user){

        return this.transition(
            request,
            "RESERVED",
            user
        );

    }

    issue(request,user){

        return this.transition(
            request,
            "ISSUED",
            user
        );

    }

    complete(request,user){

        return this.transition(
            request,
            "COMPLETED",
            user
        );

    }

    reject(request,user,remarks=""){

        return this.transition(
            request,
            "REJECTED",
            user,
            remarks
        );

    }

    cancel(request,user,remarks=""){

        return this.transition(
            request,
            "CANCELLED",
            user,
            remarks
        );

    }

}

global.TAESF
    .Applications
    .AIMS
    .RIS
    .Features
    .Request
    .LifecycleService =
        RequestLifecycleService;

})(window);