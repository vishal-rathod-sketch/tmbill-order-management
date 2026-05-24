import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createOrderRouter } from './routes/order.routes';
import { archiveRouter } from './routes/archive.routes';   // Task 3

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

// Socket.IO setup
export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Store-based filtering: client joins a room per store
  socket.on('join:store', (store_id: string) => {
    socket.join(`store:${store_id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use('/orders', createOrderRouter(io));
app.use('/', archiveRouter);   // Task 3: /archive-old-orders + analytics

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));