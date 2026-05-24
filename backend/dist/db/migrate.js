"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = require("./index");
const migrate = async () => {
    await index_1.pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      store_id VARCHAR(50) NOT NULL,
      items JSONB NOT NULL DEFAULT '[]',
      total_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'PLACED'
        CHECK (status IN ('PLACED', 'PREPARING', 'COMPLETED')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_orders_store_id 
      ON orders(store_id);

    CREATE INDEX IF NOT EXISTS idx_orders_created_at 
      ON orders(created_at DESC);

    CREATE TABLE IF NOT EXISTS orders_archive (
      LIKE orders INCLUDING ALL
    );
  `);
    console.log('✅ Migration complete');
    await index_1.pool.end();
};
migrate().catch(console.error);
//# sourceMappingURL=migrate.js.map