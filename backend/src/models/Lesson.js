const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // Flexible array to store the AI's JSON blocks (paragraphs, code, etc.)
    content: { type: [mongoose.Schema.Types.Mixed], required: true }, 
    // Tracks if the AI has finished generating detailed content for this lesson
    isEnriched: { type: Boolean, default: false }, 
    // Reference back to the parent module
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);