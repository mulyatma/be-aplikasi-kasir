const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, stockController.index);
router.post('/', authMiddleware, stockController.store);
router.get('/:id', authMiddleware, stockController.show);
router.put('/:id', authMiddleware, stockController.update);
router.delete('/:id', authMiddleware, stockController.destroy);

module.exports = router;
