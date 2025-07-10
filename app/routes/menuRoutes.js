const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middlewares/authMiddleware');
const authFlexible = require('../middlewares/authFlexible');
const checkLastActive = require('../middlewares/lastActive');
const upload = require('../middlewares/uploadCloudinary');

router.get('/', authFlexible, menuController.getMenus);
router.post('/', authMiddleware, checkLastActive, upload.single('image'), menuController.createMenu); //change middleware only owner can access
router.get('/:id', authFlexible, menuController.getMenuById);
router.put('/:id', authMiddleware, checkLastActive, menuController.updateMenu); //change middleware only owner can access
router.delete('/:id', authMiddleware, checkLastActive, menuController.deleteMenu); //change middleware only owner can access

module.exports = router;
