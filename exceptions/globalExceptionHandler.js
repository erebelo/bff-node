const LoggerContext = require('../logger/loggerContext');
const logger = require('../logger/logger');
const { HEADERS } = require('../constants/aggregateConstant');

module.exports = (err, req, res, next) => {
  const context = new LoggerContext(req.headers[HEADERS.X_REQUEST_ID], 'globalExceptionHandler.js', 'main');
  logger.child({ context: context }).error(`💥💥💥 STACK TRACE ERROR: ${err.stack}`);

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    code: err.statusCode,
    message: err.message,
    timestamp: new Date().getTime(),
  });
};
