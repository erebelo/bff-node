const express = require('express');
const aggregateController = require('./../controllers/aggregateController');

const router = express.Router();

router.route('/').get(aggregateController.getAggregate);

module.exports = router;
