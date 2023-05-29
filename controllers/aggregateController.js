const axios = require('axios');
const { asyncCatch } = require('./../exceptions/asyncCatch');
const AppError = require('./../exceptions/appError');

const HOST = 'host';
const AUTH = 'authorization';
const COOKIE = 'cookie';
const X_REQUEST_ID = 'x-requestid';
const CONTENT_TYPE = 'content-type';

const axiosInstance = axios.create({
  timeout: 5000,
});

exports.getAggregate = asyncCatch(async (req, res, next) => {
  const url = process.env.DOG_API;
  const headers = { ...req.headers, host: '' };

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
  const url = process.env.PLACEHOLDER_API;
  const reqHeaders = { ...req.headers };

  const response = await axiosInstance.post(url, req.body, {
    transformRequest: [
      (data, headers) => {
        headers[HOST] = '';
        headers[CONTENT_TYPE] = 'application/json';
        headers[AUTH] = reqHeaders[AUTH] || '';
        headers[COOKIE] = reqHeaders[COOKIE] || '';
        headers[X_REQUEST_ID] = reqHeaders[X_REQUEST_ID] || '';
        return JSON.stringify(data);
      },
    ],
  });

  // console.log(response.config);
  const data = response.data;

  res.status(201).json({
    status: 'success',
    data,
  });
});
