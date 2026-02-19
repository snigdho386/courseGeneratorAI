const express = require('express');
const router = express.Router();
const { generateCourseOutline, generateLessonContent } = require('../services/aiService');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// Endpoint to generate and save the course skeleton
router.post('/generate', async (req, res) => {
    try {
        const { topic, creatorId } = req.body;
        const outline = await generateCourseOutline(topic);

        // Create Course
        const newCourse = await Course.create({
            title: outline.title,
            description: outline.description,
            creator: creatorId || "guest_user",
            tags: outline.tags
        });

        // Create Modules and Lessons
        for (const modData of outline.modules) {
            const newModule = await Module.create({
                title: modData.title,
                course: newCourse._id
            });

            const lessonPromises = modData.lessons.map(title => 
                Lesson.create({ title, module: newModule._id, content: [] })
            );

            const savedLessons = await Promise.all(lessonPromises);
            newModule.lessons = savedLessons.map(l => l._id);
            await newModule.save();
            newCourse.modules.push(newModule._id);
        }

     await newCourse.save();

        // Tell Mongoose to fetch the actual module and lesson documents using the IDs
        const populatedCourse = await Course.findById(newCourse._id).populate({
            path: 'modules',
            populate: {
                path: 'lessons'
            }
        });

        // Send the fully populated course back to Postman/Frontend
        res.status(201).json(populatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to enrich a specific lesson with AI content
router.post('/lessons/:id/enrich', async (req, res) => {
    try {
        
        const lesson = await Lesson.findById(req.params.id).populate({
            path: 'module',
            populate: { path: 'course' }
        });

        // Added error handling to prevent server crashes if the lesson ID doesn't exist
        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found." });
        }

        const detailedData = await generateLessonContent(
            lesson.module.course.title,
            lesson.module.title,
            lesson.title
        );

        lesson.content = detailedData.content;
        lesson.objectives = detailedData.objectives;
        lesson.mcqs = detailedData.mcqs;
        lesson.isEnriched = true;

        await lesson.save();
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;