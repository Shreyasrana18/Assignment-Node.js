const express = require('express');
const { getNotes, createNote, updateNote, deleteNote, getNote, shareNote, searchQuery } = require('../Controllers/notesController');
const validateToken = require('../Middlewares/validateToken');
const router = express.Router();

router.use(validateToken);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').put(updateNote).delete(deleteNote).get(getNote);
router.route('/:id/share').post(shareNote);
router.route('/notes').get(searchQuery);

module.exports = router;