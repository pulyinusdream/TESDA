/**
 * ============================================================
 * TAESF Enterprise Framework
 * AIMS - RIS Cart Model
 * Version 1.3.0
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
global.TAESF.Applications.AIMS.RIS.Features.Cart =
    global.TAESF.Applications.AIMS.RIS.Features.Cart || {};

class CartModel {

    constructor() {

        this.items = [];

    }

    addItem(item) {

    const existing = this.getItem(item.id);

        if (existing) {

            existing.req += Number(item.req);

            return;

        }

        this.items.push({

            id: item.id,

            stock: item.stock,

            desc: item.desc,

            unit: item.unit,

            req: Number(item.req ?? 0),

            avail: Number(item.avail ?? 0),

            cost: Number(item.cost ?? 0)

        });

    }

    getItem(id) {

        return this.items.find(item => item.id === id);

    }

    updateQuantity(id, qty) {

        const item = this.getItem(id);

        if (item) {

            item.req = Number(qty);

        }

    }

    removeItem(id) {

        this.items = this.items.filter(

            item => item.id !== id

        );

    }
    clear() {

        this.items = [];

    }

    getItems() {

        return structuredClone(this.items);

    }
    
    hasItem(id) {

        return this.items.some(
            item => item.id === id
        );

    }

    getCount() {

        return this.items.length;

    }

    getTotalRequestedQuantity() {

        return this.items.reduce(

            (sum, item) => sum + item.req,

            0

        );

    }

    clone() {

        return structuredClone(this.items);

    }

}

global.TAESF.Applications
.AIMS
.RIS
.Features
.Cart
.Model = CartModel;

})(window);