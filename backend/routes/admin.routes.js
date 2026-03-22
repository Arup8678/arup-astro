const express = require('express');
const router = express.Router();
const { getDashboard, getAllUsers, toggleUserStatus, getAllReports, getAllTransactions } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/reports', getAllReports);
router.get('/transactions', getAllTransactions);

module.exports = router;
