"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersQuerySchema = exports.updateStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    store_id: zod_1.z.string().min(1, 'store_id is required'),
    items: zod_1.z.array(zod_1.z.object({
        item_id: zod_1.z.string().min(1),
        qty: zod_1.z.number().int().positive(),
    })).min(1, 'At least one item required'),
    total_amount: zod_1.z.number().positive(),
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PLACED', 'PREPARING', 'COMPLETED']),
});
exports.getOrdersQuerySchema = zod_1.z.object({
    store_id: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
//# sourceMappingURL=order.validator.js.map