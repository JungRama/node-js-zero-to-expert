const express        = require('express');
const router         = express.Router();

const authController = require('../controller/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

<<<<<<< HEAD
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/reset-password/:token', authController.postNewPassword);

=======
>>>>>>> 28416c85006f79e2ce155c54f4732747bf9ccef4
router.post('/logout', authController.postLogout);

module.exports = router;