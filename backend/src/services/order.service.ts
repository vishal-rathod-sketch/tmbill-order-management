import { pool } from '../db';

export const createOrder = async (data: {
  store_id: string;
  items: { item_id: string; qty: number }[];
  total_amount: number;
}) => {
  const { rows } = await pool.query(
    `INSERT INTO orders (store_id, items, total_amount)
     VALUES ($1, $2, $3) RETURNING *`,
    [data.store_id, JSON.stringify(data.items), data.total_amount]
  );
  return rows[0];
};

export const getOrdersByStore = async (
  store_id?: string,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;
  const values: (string | number)[] = [limit, offset];
  let whereClause = '';

  if (store_id) {
    whereClause = 'WHERE store_id = $3';
    values.push(store_id);
  }

  const { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER() AS total_count
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    values
  );

  const total = rows[0]?.total_count ?? 0;
  return {
    data: rows.map(({ total_count, ...r }) => r),
    pagination: { page, limit, total: Number(total) },
  };
};

export const getOrderById = async (id: string) => {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { rows } = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] ?? null;
};
