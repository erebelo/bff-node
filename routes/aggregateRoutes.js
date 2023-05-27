const express = require('express');
const { checkPayload } = require('./../middlewares/aggregateMiddleware');
const aggregateValidation = require('./../validations/aggregateValidation');
const aggregateController = require('./../controllers/aggregateController');

const router = express.Router();

router
  .route('/')
  .get(aggregateController.getAggregate)
  .post(checkPayload(aggregateValidation), aggregateController.postAggregate);

module.exports = router;
