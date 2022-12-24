const express = require('express');
const {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
} = require('../../controllers/userController');
const authMiddleware = require('../../middlewares/authMiddleware');
const {
  userValidationMiddleware,
} = require('../../middlewares/userValidationMiddleware');

const router = express.Router();

router.post('/signup', userValidationMiddleware, signupController);
router.post('/login', userValidationMiddleware, loginController);
router.get('/logout', authMiddleware, logoutController);
router.get('/current', authMiddleware, getCurrentUserController);
router.patch('/', authMiddleware, changeSubscriptionController);

module.exports = router;
