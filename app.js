const express = require('express');
const morgan = require('morgan');

const aggregateRouter = require('./routes/aggregateRoutes');

const app = express();

// 1) MIDDLEWARES
if ((process.env.NODE_ENV || '').trim() === 'dev') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestDateTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/aggregate', aggregateRouter);

module.exports = app;
