import { Router, Request, Response } from "express";
import {
  createOrderSchema,
  updateStatusSchema,
  getOrdersQuerySchema,
} from "../validators/order.validator";
import * as orderService from "../services/order.service";

// We'll attach io (Socket.IO) later — inject it via the router factory
export const createOrderRouter = (io: any) => {
  const router = Router();

  // POST /orders — Create order
  router.post("/", async (req: Request, res: Response) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const order = await orderService.createOrder(parsed.data);
      io.emit("order:created", order); // Task 2 — real-time event
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /orders?store_id=&page=&limit=
  router.get("/", async (req: Request, res: Response) => {
    const parsed = getOrdersQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const result = await orderService.getOrdersByStore(
        parsed.data.store_id,
        parsed.data.page,
        parsed.data.limit,
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /orders/:id/
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const order = await orderService.getOrderById(
        req.params.id as string
      );
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PATCH /orders/:id/status
  router.patch("/:id/status", async (req: Request, res: Response) => {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id as string,
        parsed.data.status,
      );
      if (!order) return res.status(404).json({ error: "Order not found" });
      io.emit("order:statusUpdated", order); // Task 2 — real-time event

      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
