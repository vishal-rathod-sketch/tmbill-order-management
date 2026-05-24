"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRouter = void 0;
const express_1 = require("express");
const order_validator_1 = require("../validators/order.validator");
const orderService = __importStar(require("../services/order.service"));
// We'll attach io (Socket.IO) later — inject it via the router factory
const createOrderRouter = (io) => {
    const router = (0, express_1.Router)();
    // POST /orders — Create order
    router.post("/", async (req, res) => {
        const parsed = order_validator_1.createOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        try {
            const order = await orderService.createOrder(parsed.data);
            io.emit("order:created", order); // Task 2 — real-time event
            res.status(201).json(order);
        }
        catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // GET /orders?store_id=&page=&limit=
    router.get("/", async (req, res) => {
        const parsed = order_validator_1.getOrdersQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        try {
            const result = await orderService.getOrdersByStore(parsed.data.store_id, parsed.data.page, parsed.data.limit);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // GET /orders/:id
    router.get("/:id", async (req, res) => {
        try {
            const order = await orderService.getOrderById(req.params.id);
            if (!order)
                return res.status(404).json({ error: "Order not found" });
            res.json(order);
        }
        catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // PATCH /orders/:id/status
    router.patch("/:id/status", async (req, res) => {
        const parsed = order_validator_1.updateStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        try {
            const order = await orderService.updateOrderStatus(req.params.id, parsed.data.status);
            if (!order)
                return res.status(404).json({ error: "Order not found" });
            io.emit("order:statusUpdated", order); // Task 2 — real-time event
            res.json(order);
        }
        catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
    return router;
};
exports.createOrderRouter = createOrderRouter;
//# sourceMappingURL=order.routes.js.map