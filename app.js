const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const AppError = require('./exceptions/appError');
const globalExceptionHandler = require('./exceptions/globalExceptionHandler');
const aggregateRouter = require('./routes/aggregateRoutes');
const { HEADERS } = require('./constants/aggregateConstant');

const app = express();

// MIDDLEWARES
if (['dev'].includes((process.env.NODE_ENV || '').trim())) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.headers = { ...req.headers, [HEADERS.X_REQUEST_ID]: uuid.v4() };
  next();
});

// ROUTES
app.use('/api/v1/aggregate', aggregateRouter);

app.all('*', (req, res, next) => {
  // Whenever passing any parameter into next(), express will assume this as an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// EXCEPTION HANDLER
app.use(globalExceptionHandler);

module.exports = app;
