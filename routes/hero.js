const express = require("express");
const heroController = require("../controller/hero");

const router = express.Router();

router.post('/hero',  heroController.addHero);  
router.get('/hero',   heroController.getHero); 

module.exports = router;


