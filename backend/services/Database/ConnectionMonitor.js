import mongoose from 'mongoose';
import dns from 'dns';
import { config } from '../../config/env.js';
import { logger } from '../../core/utils/logger.js';

class ConnectionMonitor {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;
    try {
      // Ensure Google & Cloudflare DNS resolvers are used to avoid Windows router SRV ECONNREFUSED
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (e) {}

      const db = await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      this.isConnected = db.connections[0].readyState === 1;
      logger.success('MongoDB connected successfully via ConnectionMonitor');
    } catch (err) {
      logger.warn(`Database connection notice: ${err.message}. Using safe memory fallback for local development.`);
    }
  }

  getStatus() {
    return {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    };
  }
}

export const connectionMonitor = new ConnectionMonitor();
export { ConnectionMonitor };
export default connectionMonitor;
