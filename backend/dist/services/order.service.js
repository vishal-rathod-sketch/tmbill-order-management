"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrdersByStore = exports.createOrder = void 0;
const db_1 = require("../db");
const createOrder = async (data) => {
    const { rows } = await db_1.pool.query(`INSERT INTO orders (store_id, items, total_amount)
     VALUES ($1, $2, $3) RETURNING *`, [data.store_id, JSON.stringify(data.items), data.total_amount]);
    return rows[0];
};
exports.createOrder = createOrder;
const getOrdersByStore = async (store_id, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const values = [limit, offset];
    let whereClause = '';
    if (store_id) {
        whereClause = 'WHERE store_id = $3';
        values.push(store_id);
    }
    const { rows } = await db_1.pool.query(`SELECT *, COUNT(*) OVER() AS total_count
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`, values);
    const total = rows[0]?.total_count ?? 0;
    return {
        data: rows.map(({ total_count, ...r }) => r),
        pagination: { page, limit, total: Number(total) },
    };
};
exports.getOrdersByStore = getOrdersByStore;
const getOrderById = async (id) => {
    const { rows } = await db_1.pool.query(`SELECT * FROM orders WHERE id = $1 LIMIT 1`, [id]);
    return rows[0] ?? null;
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (id, status) => {
    const { rows } = await db_1.pool.query(`UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    return rows[0] ?? null;
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.service.js.map