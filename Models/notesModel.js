const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);