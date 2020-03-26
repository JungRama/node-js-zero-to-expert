const express        = require('express');
const router         = express.Router();

const authController = require('../controller/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// router.post('/logout', authController.postLogout);

module.exports = router;