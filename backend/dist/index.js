"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const order_routes_1 = require("./routes/order.routes");
const archive_routes_1 = require("./routes/archive.routes"); // Task 3
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// Socket.IO setup
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
});
exports.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Store-based filtering: client joins a room per store
    socket.on('join:store', (store_id) => {
        socket.join(`store:${store_id}`);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Middleware
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL }));
app.use(express_1.default.json());
// Routes
app.use('/orders', (0, order_routes_1.createOrderRouter)(exports.io));
app.use('/', archive_routes_1.archiveRouter); // Task 3: /archive-old-orders + analytics
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map