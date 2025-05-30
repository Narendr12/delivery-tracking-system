import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { auth } from './middleware/auth';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('location-update', (data) => {
    // Broadcast location update to all clients tracking this delivery
    io.to(`order-${data.orderId}`).emit('location-updated', data);
  });

  socket.on('track-order', (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
import authRoutes from './routes/auth';
import orderRoutes from './routes/order';
import locationRoutes from './routes/location';

app.use('/api/auth', authRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api/location', auth, locationRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 