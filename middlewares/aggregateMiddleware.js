const { validationAsyncCatch } = require('./../exceptions/asyncCatch');

exports.checkPayload = (schema) =>
  validationAsyncCatch(async (req, res, next) => {
    const payload = req.body;
    await schema.validate(payload);
    next();
  });
