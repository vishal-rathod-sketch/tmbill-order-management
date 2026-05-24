import { Router, Request, Response } from 'express';
import * as archiveService from '../services/archive.service';

export const archiveRouter = Router();

archiveRouter.post('/archive-old-orders', async (_req: Request, res: Response) => {
  try {
    const result = await archiveService.archiveOldOrders();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Archive failed' });
  }
});

archiveRouter.get('/analytics/orders-per-day', async (_req: Request, res: Response) => {
  res.json(await archiveService.getOrdersPerDay());
});

archiveRouter.get('/analytics/revenue-per-store', async (_req: Request, res: Response) => {
  res.json(await archiveService.getRevenuePerStore());
});

archiveRouter.get('/analytics/top-items', async (_req: Request, res: Response) => {
  res.json(await archiveService.getTopItems());
});