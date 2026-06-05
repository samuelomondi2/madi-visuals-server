const express  = require('express');
const router   = express.Router();
const availabilityController = require('../controller/availability');

router.get('/availability', availabilityController.getAvailability);    // ?date=2026-12-05
router.get('/availability/all', availabilityController.getAllAvailability);
router.post('/availability', availabilityController.createAvailability);
router.put('/availability/:id', availabilityController.updateAvailability);
router.patch('/availability/:id/toggle', availabilityController.toggleAvailability);
router.delete('/availability/:id', availabilityController.deleteAvailability);

module.exports = router;