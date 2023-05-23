const axios = require('axios');

exports.getAggregate = async (req, res) => {
  try {
    const headers = req.headers;
    const url = process.env.DOG_API;

    const resp1 = axios.get(url, { headers });
    const resp2 = axios.get(url);
    const resp3 = axios.get(url);

    // const all = await Promise.all([resp1, resp2, resp3]);
    const all = await Promise.allSettled([resp1, resp2, resp3]).then((results) => {
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

      if (successfulResponses.length === 0) throw new Error(JSON.stringify(errorResponses));

      return successfulResponses;
    });

    const imgs = all.map((el) => el.data.message);

    res.status(200).json({
      status: 'success',
      requestDateTime: req.requestDateTime,
      data: imgs,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      requestDateTime: req.requestDateTime,
      error: `💥💥💥 Error handling promises: ${err.message || err}`,
    });
  }
};
