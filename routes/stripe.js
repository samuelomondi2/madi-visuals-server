const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripe');

router.post('/create-checkout-session', stripeController.createCheckoutSession);
router.post('/webhook', stripeController.handleWebhook); 

module.exports = router;