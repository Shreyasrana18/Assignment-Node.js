const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const Note = require('../Models/notesModel');



const getNotes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('notes');
    if (!user) {
        res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json({ notes: user.notes });
});

const getNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).send({ message: 'Note not found' });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(401).send({ message: 'User not found' });
    }
    if (!user.notes.includes(note._id)) {
        res.status(401).send({ message: 'You are not authorized to view this note' });
    }
    res.status(200).json({ note });
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
    const user = await User.findById(req.user._id);
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404).send({ message: 'Note not found' });
    }
    else {
        user.notes.pull(note._id);
        await user.save();
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note deleted successfully' });
    }
});


const shareNote = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const userSender = await User.findById(req.user._id);
    const userReciever = await User.findOne({ username });
    if (!userReciever) {
        res.status(404).send({ message: 'User not found' });
    }
    const note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).send({ message: 'Note not found' });
    }
    if (!userSender.notes.includes(note._id)) {
        res.status(401).send({ message: 'You are not authorized to share this note' });
    }
    if (userReciever.notes.includes(note._id)) {
        res.status(400).send({ message: 'Note already shared with this user' });
    }
    userReciever.notes.push(note._id);
    await userReciever.save();
    res.status(200).json({ message: 'Note shared successfully', note });
});


// Search Query
const searchQuery = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).populate('notes');

    const query = req.query.q;
    if (!query) {
        res.status(400).send({ message: 'Please provide a query' });
    }

    const matchingNotes = user.notes.filter(note =>
        note.title.includes(query) || note.content.includes(query)
    );

    if (matchingNotes.length === 0) {
        res.status(404).send({ message: 'No notes found' });
    }

    res.status(200).json({ notes: matchingNotes });

});

module.exports = { getNotes, createNote, updateNote, deleteNote, getNote, shareNote, searchQuery };