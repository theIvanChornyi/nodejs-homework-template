const express = require('express');
const {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
  changeAvatarController,
  verifyController,
  repeatVerifyController,
} = require('../../controllers/userController');
const authMiddleware = require('../../middlewares/authMiddleware');
const verifyValidMiddleware = require('../../middlewares/verifyValidMiddleware');
const avatarStorrageMiddleware = require('../../middlewares/avatarStorrageMiddleware');
const userValidationMiddleware = require('../../middlewares/userValidationMiddleware');

const router = express.Router();

router.post('/signup', userValidationMiddleware, signupController);
router.post('/login', userValidationMiddleware, loginController);
router.get('/verify/:verificationToken', verifyController);
router.post('/verify', verifyValidMiddleware, repeatVerifyController);
router.get('/logout', authMiddleware, logoutController);
router.get('/current', authMiddleware, getCurrentUserController);
router.patch('/', authMiddleware, changeSubscriptionController);
router.patch(
  '/avatars',
  authMiddleware,
  avatarStorrageMiddleware,
  changeAvatarController
);

module.exports = router;
