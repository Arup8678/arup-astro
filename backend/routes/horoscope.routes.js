const express = require('express');
const router = express.Router();
const { getHoroscope, getAllSigns } = require('../controllers/horoscope.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/signs', getAllSigns);
router.get('/:sign/:period', getHoroscope);

module.exports = router;
