const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact');

router.post('/contact', contactController.addContact);
router.get('/contact', contactController.getContacts);
router.get('/contact/filter', contactController.getFilteredContacts);
router.get('/contact/:id', contactController.getContactById);
router.patch('/contact/:id/reviewed', contactController.reviewedContact);
router.delete('/contact/:id', contactController.deleteContact);

module.exports = router;