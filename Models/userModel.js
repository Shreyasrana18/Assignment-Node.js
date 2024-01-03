const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        trim: true,
        minlength: 6,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);