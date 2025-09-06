// /api/chat.js  (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // === OPTION 1: Google Vertex AI (cloud) ===
    if (process.env.AI_PROVIDER === 'vertex') {
      const { VertexAI } = await import('@google-cloud/vertexai');
      const vertex = new VertexAI({
        project: process.env.GOOGLE_PROJECT_ID,
        location: 'us-central1',
      });
      const model = vertex.preview.getGenerativeModel({ model: 'gemini-1.0-pro' });
      const chat = model.startChat({
        history: context ? [{ role: 'user', parts: [{ text: context }] }] : [],
      });
      const result = await chat.sendMessageStream(message);
      // This is a simplified way to get the text. 
      // It might need adjustment if the stream or response structure is different.
      const firstCandidate = result.response.candidates[0];
      const text = firstCandidate?.content?.parts[0]?.text || 'No reply';
      return res.status(200).json({ reply: text });
    }

    // === OPTION 2: Local DeepSeek (zero-cost, offline) ===
    // This assumes you have a local AI server like Ollama running.
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-coder', // Make sure this model is pulled in your local setup
        prompt: `Course context:\n${context || ''}\n\nUser: ${message}`
      })
    });

    if (!response.ok) throw new Error(`Local AI request failed: ${response.statusText}`);
    
    // Process the streaming response from the local AI
    const reader = response.body.getReader();
    let accumulatedResponse = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        try {
            const json = JSON.parse(chunk);
            accumulatedResponse += json.response;
        } catch (e) {
            // In case a chunk isn't a full JSON object
        }
    }
    return res.status(200).json({ reply: accumulatedResponse });


  } catch (err) {
    console.error('[api/chat] error:', err);
    return res.status(503).json({
      error: 'AI service unavailable. Check server logs or API keys.',
      details: err.message
    });
  }
}