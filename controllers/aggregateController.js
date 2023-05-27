const axios = require('axios');
const { asyncCatch } = require('./../exceptions/asyncCatch');
const AppError = require('./../exceptions/appError');

exports.getAggregate = asyncCatch(async (req, res, next) => {
  const url = process.env.DOG_API;
  const headers = { ...req.headers, host: '' };

  const res1 = axios.get(url, { headers });
  const res2 = axios.get(url, { headers });
  const res3 = axios.get(url, { headers });

  // const all = await Promise.all([res1, res2, res3]);
  const all = await Promise.allSettled([res1, res2, res3]).then((results) => {
    const successfulResponses = [];
    const errorResponses = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        successfulResponses.push(result.value);
      } else {
        errorResponses.push(result.reason.message);
        console.log(`💥💥💥 Promise error when calling API: ${JSON.stringify(result)}`);
      }
    });

    if (successfulResponses.length === 0) {
      const errorMessage = errorResponses.map((val, index) => `${index.toString()}: ${val}`).join(', ');
      return next(new AppError(`Error handling promises: [${errorMessage}]`, 400));
    }

    return successfulResponses;
  });

  const imgs = all.map((el) => el.data.message);

  res.status(200).json({
    status: 'success',
    data: imgs,
  });
});

exports.postAggregate = asyncCatch(async (req, res, next) => {
  res.status(201).end();
});
