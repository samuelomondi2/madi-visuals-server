const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
});

router.post('/auth/register', userController.register);
router.post('/auth/login',    userController.login);

router.get('/users',        userController.getAllUsers);
router.get('/users/:id',    userController.getUserById);
router.put('/users/:id',    userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.post('/forgot-password', limiter, userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;