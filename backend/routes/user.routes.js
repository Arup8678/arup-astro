const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getMyReports, getReport } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/reports', getMyReports);
router.get('/reports/:id', getReport);

module.exports = router;
