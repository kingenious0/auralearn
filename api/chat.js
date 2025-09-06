
import { VertexAI } from '@google-cloud/vertexai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const vertex_ai = new VertexAI({
      project: process.env.PROJECT_ID || 'auralearn-beta-427215',
      location: 'us-central1',
    });

    const model = 'gemini-1.0-pro';

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        'maxOutputTokens': 2048,
        'temperature': 0.9,
        'topP': 1,
      },
    });

    // Format the history for the Vertex AI SDK
    const chatHistory = [];

    // Add the system context as the first user message
    if (context) {
        chatHistory.push({
            role: 'user',
            parts: [{ text: context }],
        });
        // Add a placeholder model response to keep the alternating turns
        chatHistory.push({
            role: 'model',
            parts: [{ text: "Okay, I understand my role. I will act as a friendly and encouraging AI tutor for the 'Introduction to Python' course. I will not answer questions unrelated to the course material. Let's begin!" }],
        })
    }

    // Add the rest of the chat history
    if (history) {
        history.forEach(item => {
            // Ensure the role is either 'user' or 'model'
            const role = item.role === 'user' ? 'user' : 'model';
            chatHistory.push({
                role: role,
                parts: [{ text: item.text || '' }]
            });
        });
    }

    const chat = generativeModel.startChat({ history: chatHistory });
    const streamResult = await chat.sendMessageStream(message);
    const { response } = await streamResult.response;

    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0) {
      console.error('Invalid AI response structure:', JSON.stringify(response, null, 2));
      return res.status(500).json({ error: 'Invalid AI response structure' });
    }

    const text = response.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error('--- Full API Error ---');
    console.error('Error Status:', error.status);
    console.error('Error Message:', error.message);
    console.error('Error Details:', error.details);
    console.error(JSON.stringify(error, null, 2));
    console.error('--- End Full API Error ---');
    
    res.status(500).json({
        error: 'Failed to fetch AI response',
        details: error.message, 
    });
  }
}
