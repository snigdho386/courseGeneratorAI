const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    // The 'sub' ID provided by Auth0 to identify the user who created it
    creator: { type: String, required: true }, 
    // One-to-many relationship: A course has many modules
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    tags: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);