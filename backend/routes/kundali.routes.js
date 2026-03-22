const express = require('express');
const router = express.Router();
const { generateKundali } = require('../controllers/kundali.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/generate', generateKundali);
// Optional: use protect middleware if you want to force login
// router.post('/generate', protect, generateKundali);

module.exports = router;
