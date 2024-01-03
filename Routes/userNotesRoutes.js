const express = require('express');
const { getNotes, createNote, updateNote, deleteNote } = require('../Controllers/notesController');
const validateToken = require('../Middlewares/validateToken');
const router = express.Router();

router.use(validateToken);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').put(updateNote).delete(deleteNote);


module.exports = router;