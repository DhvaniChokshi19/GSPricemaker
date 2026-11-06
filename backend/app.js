import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import priceRoutes from './routes/prices.js';
import { connectionMonitor } from './services/Database/ConnectionMonitor.js';

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Ensure Database connection for serverless requests (Vercel)
app.use(async (req, res, next) => {
  await connectionMonitor.connect();
  next();
});

// Main API routes
app.use('/api/prices', priceRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PriceMaker API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

export default app;
export { app };

