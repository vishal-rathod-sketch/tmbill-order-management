import { pool } from '../db';

// Moves orders older than 30 days into orders_archive
export const archiveOldOrders = async () => {
  const { rows } = await pool.query(`
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

// Orders per day (last 30 days)
export const getOrdersPerDay = async () => {
  const { rows } = await pool.query(`
    SELECT DATE(created_at) AS day, COUNT(*) AS total_orders
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY day DESC
    LIMIT 30
  `);
  return rows;
};

// Revenue per store
export const getRevenuePerStore = async () => {
  const { rows } = await pool.query(`
    SELECT store_id, SUM(total_amount) AS total_revenue, COUNT(*) AS order_count
    FROM orders
    GROUP BY store_id
    ORDER BY total_revenue DESC
  `);
  return rows;
};

// Top 5 selling items (from JSONB items array)
export const getTopItems = async () => {
  const { rows } = await pool.query(`
    SELECT item->>'item_id' AS item_id,
           SUM((item->>'qty')::int) AS total_qty
    FROM orders, jsonb_array_elements(items) AS item
    GROUP BY item_id
    ORDER BY total_qty DESC
    LIMIT 5
  `);
  return rows;
};