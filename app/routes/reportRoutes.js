const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const authFlexible = require('../middlewares/authFlexible');

router.get('/daily', authFlexible, reportController.getDailyReport);
router.get('/range', authFlexible, reportController.getRangeReport);

module.exports = router;