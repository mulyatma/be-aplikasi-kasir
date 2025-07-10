const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/authMiddleware');

router.post('/add', auth, employeeController.addEmployee);
router.get('/', auth, employeeController.getEmployees);

module.exports = router;