const dotenv = require('dotenv');
const logger = require('./logger/logger');

// Handling Uncaught Synchronous Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! errorName=${err.name}, errorMessage=${err.message}`);
  logger.error('💥💥💥 Shutting down...');
  process.exit(1);
});

const env = (process.env.NODE_ENV || '').trim();
if (['dev', 'prod'].includes(env)) {
  dotenv.config({ path: `.env.${env}` });
} else {
  dotenv.config({ path: '.env.dev' });
}

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});

// Handling Unhandled Rejected Promises/Asynchronous Code
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! errorName=${err.name}, errorMessage=${err.message}`);
  logger.error('💥💥💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
