"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopItems = exports.getRevenuePerStore = exports.getOrdersPerDay = exports.archiveOldOrders = void 0;
const db_1 = require("../db");
// Moves orders older than 30 days into orders_archive
const archiveOldOrders = async () => {
    const { rows } = await db_1.pool.query(`
    WITH moved AS (
      DELETE FROM orders
      WHERE created_at < NOW() - INTERVAL '30 days'
      RETURNING *
    )
    INSERT INTO orders_archive SELECT * FROM moved
    RETURNING id
  `);
    return { archived: rows.length };
};
exports.archiveOldOrders = archiveOldOrders;
// Orders per day (last 30 days)
const getOrdersPerDay = async () => {
    const { rows } = await db_1.pool.query(`
    SELECT DATE(created_at) AS day, COUNT(*) AS total_orders
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY day DESC
    LIMIT 30
  `);
    return rows;
};
exports.getOrdersPerDay = getOrdersPerDay;
// Revenue per store
const getRevenuePerStore = async () => {
    const { rows } = await db_1.pool.query(`
    SELECT store_id, SUM(total_amount) AS total_revenue, COUNT(*) AS order_count
    FROM orders
    GROUP BY store_id
    ORDER BY total_revenue DESC
  `);
    return rows;
};
exports.getRevenuePerStore = getRevenuePerStore;
// Top 5 selling items (from JSONB items array)
const getTopItems = async () => {
    const { rows } = await db_1.pool.query(`
    SELECT item->>'item_id' AS item_id,
           SUM((item->>'qty')::int) AS total_qty
    FROM orders, jsonb_array_elements(items) AS item
    GROUP BY item_id
    ORDER BY total_qty DESC
    LIMIT 5
  `);
    return rows;
};
exports.getTopItems = getTopItems;
//# sourceMappingURL=archive.service.js.map