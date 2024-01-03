const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const Note = require('../Models/notesModel');



const getNotes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('notes');
    res.status(200).json({ notes: user.notes });
});

const createNote = asyncHandler(async (req, res) => {

    const { title, content } = req.body;

    const note = await Note.create({ title, content, user: req.user._id });
    const user = await User.findById(req.user._id);

    user.notes.push(note._id);
    await user.save();
    res.status(201).json({
        user: {
            username: user.username
        }, note
    });
});

const updateNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    note.title = title;
    note.content = content;
    await note.save();
    res.status(200).json({ note });
});

const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).send({ message: 'Note not found' });
    }
    
    const user = await User.findById(req.user._id);
    user.notes.pull(note._id);
    await user.save();
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted successfully' });
});

module.exports = { getNotes, createNote, updateNote, deleteNote };