const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');
const authFlexible = require('../middlewares/authFlexible');

router.post('/', authFlexible, transactionController.createTransaction);
router.get('/', auth, transactionController.getTransactions);
router.get('/:id', auth, transactionController.getTransactionById);

module.exports = router;
