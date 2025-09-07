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
    // === OPTION: OpenRouter (cloud, zero-cost) ===
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://auralearn-git-master-kingenious0-gmailcoms-projects.vercel.app/',
        'X-Title': 'AURA Learn'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          { role: 'system', content: `Course context:\n${context || ''}\n\nAct as a friendly AI tutor.` },
          { role: 'user', content: message }
        ],
        max_tokens: 2048,
        temperature: 0.9
      })
    });

    if (!response.ok) throw new Error(`OpenRouter: ${response.status}`);

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No reply';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[api/chat] error:', err);
    return res.status(503).json({
      error: 'AI offline. Check API key.',
      details: err.message
    });
  }
}