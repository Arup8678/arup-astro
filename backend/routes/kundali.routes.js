const express = require('express');
const router = express.Router();
const { generateKundali, calculateRashi } = require('../controllers/kundali.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/generate', generateKundali);
router.post('/rashi', calculateRashi);
// Optional: use protect middleware if you want to force login
// router.post('/generate', protect, generateKundali);

module.exports = router;
