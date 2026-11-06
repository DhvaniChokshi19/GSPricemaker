import app from './app.js';
import { config } from './config/env.js';
import { ConnectionMonitor, connectionMonitor } from './services/Database/ConnectionMonitor.js';
import { logger } from './core/utils/logger.js';

async function bootstrap() {
  try {
    logger.info('Starting PriceMaker backend server...');

    // Initialize Database connection
    await connectionMonitor.connect();

    // Start Express listener
    const server = app.listen(config.port, () => {
      logger.success(`Server is running at http://localhost:${config.port}`);
    });

    // Graceful shutdown handling
    const handleShutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

  } catch (error) {
    logger.error('Startup error:', error);
    process.exit(1);
  }
}

// Start if not in serverless execution
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  bootstrap();
}

export { app, config, ConnectionMonitor, connectionMonitor, logger };
export default app;

