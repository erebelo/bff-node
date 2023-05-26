module.exports = (err, req, res, next) => {
  console.log(`💥💥💥 STACK TRACE ERROR: ${err.stack}`);

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    code: err.statusCode,
    message: err.message,
    timestamp: new Date().getTime(),
  });
};
