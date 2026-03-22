const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getTransactions, getPlans } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/plans', getPlans);
router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/transactions', getTransactions);

module.exports = router;
