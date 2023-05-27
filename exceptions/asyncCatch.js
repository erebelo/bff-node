const AppError = require('./../exceptions/appError');

exports.asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.validationAsyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(new AppError(err.message, 422)));
  };
};
