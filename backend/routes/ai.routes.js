const express = require('express');
const router = express.Router();
const { analyzePalmReading, analyzeFaceReading } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/palm', upload.single('palmImage'), analyzePalmReading);
router.post('/face', upload.single('faceImage'), analyzeFaceReading);

module.exports = router;
