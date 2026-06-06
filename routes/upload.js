const express = require('express');
const router = express.Router();
const serviceController = require('../controller/upload');

router.post('/upload', upload.array('files', 10), serviceController.addService);
router.get('/services', serviceController.getAllServices);

module.exports = router;
