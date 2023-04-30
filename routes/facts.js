const express = require('express');
const router = express();
const stateController = require('../controller/stateController');

router.post("/:state/funFact");

module.exports = router;