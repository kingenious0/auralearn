import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/chat', async (req, res) => {
    const { prompt, context } = req.body;

    if (!prompt || !context) {
        return res.status(400).json({ error: 'Prompt and context are required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const fullPrompt = `
            You are an AI tutor for a course. Your role is to help students understand the course material better.
            Based on the following context from the course, please answer the student's question.
            
            CONTEXT:
            ${context}
            
            QUESTION:
            ${prompt}
            
            ANSWER:
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate AI response.' });
    }
});

// Fallback to index.html for single-page application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
