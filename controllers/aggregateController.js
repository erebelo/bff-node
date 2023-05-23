const axios = require('axios');

exports.getAggregate = async (req, res) => {
  try {
    const headers = req.headers;
    const url = process.env.DOG_API;

    const resp1 = axios.get(url, { headers });
    const resp2 = axios.get(url);
    const resp3 = axios.get(url);

    // const all = await Promise.all([resp1, resp2, resp3]);
    const all = await Promise.allSettled([resp1, resp2, resp3])
      .then((results) => {
        const successfulResponses = [];
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            successfulResponses.push(result.value);
          } else {
            console.log(`💥💥💥 Promise error when calling API: ${JSON.stringify(result)}`);
          }
        });
        return successfulResponses;
      })
      .catch((error) => {
        console.error('💥💥💥 Error hadling promises:', error);
      });

    const imgs = all.map((el) => el.data.message);

    res.status(200).json({
      status: 'success',
      requestDateTime: req.requestDateTime,
      data: {
        imgs: imgs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      requestDateTime: req.requestDateTime,
      error: err.message || err,
    });
  }
};
