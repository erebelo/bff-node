const AppError = require('./appError');

exports.asyncCatch = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.validationAsyncCatch = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(new AppError(err.message, 422)));
};
