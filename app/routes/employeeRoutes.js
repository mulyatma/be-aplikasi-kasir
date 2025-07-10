const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/authMiddleware');

router.post('/add', auth, employeeController.addEmployee);

module.exports = router;