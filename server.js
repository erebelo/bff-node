const dotenv = require('dotenv');

// Handling Uncaught Synchronous Exceptions
process.on('uncaughtException', (err) => {
  console.log('💥💥💥 UNCAUGHT EXCEPTION! \nShutting down...');
  console.log(err.name, err.message);
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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handling Unhandled Rejected Promises/Asynchronous Code
process.on('unhandledRejection', (err) => {
  console.log('💥💥💥 UNHANDLED REJECTION! \nShutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
