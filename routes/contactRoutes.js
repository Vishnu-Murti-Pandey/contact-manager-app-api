const express = require('express');
const router = express.Router();
const { getContacts } = require('../controllers/contactController');
const { createContact } = require('../controllers/contactController');
const { updateContact } = require('../controllers/contactController');
const { deleteContact } = require('../controllers/contactController');
const { getContactById } = require('../controllers/contactController');
const validationToken = require('../middleware/validateToken');

router.use(validationToken); // to check if request is made by authorized user or not -> protected route

router.route('/').get(getContacts);

router.route('/:id').get(getContactById);

router.route('/').post(createContact);

router.route('/:id').put(updateContact);

router.route('/:id').delete(deleteContact);

module.exports = router;