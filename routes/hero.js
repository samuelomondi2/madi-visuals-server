const express = require("express");
const controller = require("../controller/hero.controller");

const router = express.Router();

router.post('/hero',  heroController.addHero);  
router.get('/hero',   heroController.getHero); 

module.exports = router;


