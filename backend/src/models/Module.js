const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // Each module must belong to exactly one course
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    // One-to-many relationship: A module has many lessons
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);