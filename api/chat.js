import { VertexAI } from '@google-cloud/vertexai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const vertex_ai = new VertexAI({ 
    project: process.env.PROJECT_ID || 'auralearn-beta-427215', 
    location: 'us-central1' 
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

  const chat = generativeModel.startChat({ history: history || [] });

  try {
    const streamResult = await chat.sendMessageStream(message);
    const { response } = await streamResult.response;
    const text = response.candidates[0].content.parts[0].text;
    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}
