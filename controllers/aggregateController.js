const axios = require('axios');
const LoggerContext = require('../logger/loggerContext');
const logger = require('../logger/logger');
const { asyncCatch } = require('../exceptions/asyncCatch');
const AppError = require('../exceptions/appError');
const { HEADERS } = require('../constants/aggregateConstant');

const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 5000;
axiosInstance.defaults.headers[HEADERS.HOST] = '';
axiosInstance.defaults.headers[HEADERS.CONTENT_TYPE] = 'application/json; charset=utf-8';

exports.getAggregate = asyncCatch(async (req, res, next) => {
  const url = process.env.DOG_API;
  const headers = { ...req.headers, host: '' };
  const context = new LoggerContext(headers[HEADERS.X_REQUEST_ID], 'aggregateController.js', 'getAggregate');

  const res1 = axiosInstance.get(url, { headers });
  const res2 = axiosInstance.get(url, { headers });
  const res3 = axiosInstance.get(url, { headers });

  // const all = await Promise.all([res1, res2, res3]);
  const all = await Promise.allSettled([res1, res2, res3]).then((results) => {
    const successfulResponses = [];
    const errorResponses = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        successfulResponses.push(result.value);
      } else {
        errorResponses.push(result.reason.message);
        logger.child({ context: context }).warn(`💥💥💥 Promise error when calling API: ${JSON.stringify(result)}`);
      }
    });

    if (successfulResponses.length === 0) {
      const errorMessage = errorResponses.map((val, index) => `${index.toString()}: ${val}`).join(', ');
      return next(new AppError(`Error handling promises: [${errorMessage}]`, 404));
    }

    return successfulResponses;
  });

  const imgs = all.map((el) => el.data.message);

  res.status(200).json({
    status: 'success',
    data: imgs,
  });

  logger.child({ context: context }).info('GET aggregate successfully');
});

exports.postAggregate = asyncCatch(async (req, res, next) => {
  const url = process.env.PLACEHOLDER_API;
  const headers = { ...req.headers };
  const context = new LoggerContext(headers[HEADERS.X_REQUEST_ID], 'aggregateController.js', 'postAggregate');

  const config = {
    headers: {
      [HEADERS.AUTH]: headers[HEADERS.AUTH] || '',
      [HEADERS.COOKIE]: headers[HEADERS.COOKIE] || '',
      [HEADERS.X_REQUEST_ID]: headers[HEADERS.X_REQUEST_ID] || '',
    },
  };

  const response = await axiosInstance.post(url, req.body, config);

  // console.log(response.config);
  const { data } = response;

  res.status(201).json({
    status: 'success',
    data,
  });

  logger.child({ context: context }).info('POST aggregate successfully');
});
