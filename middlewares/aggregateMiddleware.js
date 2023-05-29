const { validationAsyncCatch } = require('./../exceptions/asyncCatch');

exports.checkPayload = (schema) =>
  validationAsyncCatch(async (req, res, next) => {
    await schema.validate(req.body);
    next();
  });
