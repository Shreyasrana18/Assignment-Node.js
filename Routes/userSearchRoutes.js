const express = require('express');
const router = express.Router();
const validateToken = require('../Middlewares/validateToken');
const { searchQuery } = require('../Controllers/notesController');

router.use(validateToken);
router.get('/', searchQuery);

module.exports = router;