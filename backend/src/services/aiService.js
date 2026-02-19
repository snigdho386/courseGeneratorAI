const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
/**
 * Milestone 8.1: Generate Course Outline
 * Logic: Progresses from foundational to advanced concepts.
 */
const generateCourseOutline = async (topic) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate a course outline for the topic: "${topic}". 
            Return ONLY a JSON object with this structure:
            {
              "title": "string",
              "description": "string",
              "tags": ["string"],
              "modules": [
                {
                  "title": "string",
                  "lessons": ["string"]
                }
              ]
            }
            Rules: 3-6 modules, 3-5 lessons each[cite: 15, 161].`,
            config: {
                response_mime_type: "application/json",
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Outline Generation Error:", error);
        throw error;
    }
};

/**
 * Milestone 8.2: Generate Detailed Lesson Content
 * Logic: Includes objectives, rich content blocks, and MCQs[cite: 165, 169, 172].
 */
const generateLessonContent = async (courseTitle, moduleTitle, lessonTitle) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate lesson content for "${lessonTitle}" in "${courseTitle}".
            Return ONLY a JSON object with this structure:
            {
              "objectives": ["string"],
              "content": [
                { "type": "heading", "text": "string" },
                { "type": "paragraph", "text": "string" },
                { "type": "code", "language": "javascript", "text": "string" },
                { "type": "video", "query": "string" }
              ],
              "mcqs": [
                {
                  "question": "string",
                  "options": ["string"],
                  "answer": 0,
                  "explanation": "string"
                }
              ]
            }
            Rules: Include 4-5 MCQs with explanations. Use video queries, not links[cite: 170, 172, 173].`,
            config: {
                response_mime_type: "application/json",
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Lesson Enrichment Error:", error);
        throw error;
    }
};

module.exports = { generateCourseOutline, generateLessonContent };