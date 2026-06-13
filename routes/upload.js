const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controller/upload');

const storage = multer.memoryStorage();
const upload  = multer({ storage });

router.post('/upload', upload.array('files', 10), uploadController.uploadFiles);
router.get('/files', uploadController.getFiles);
router.patch("/media/set-hero", uploadController.setHero);
router.get("/media/hero", uploadController.getHero);
router.delete("/delete/:id", uploadController.deleteFile);

module.exports = router;