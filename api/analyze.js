export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { parts, systemPrompt } = req.body;

  if (!parts || !systemPrompt) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada' });
  }

  // Build messages array for OpenAI
  const userContent = [];

  for (const part of parts) {
    if (part.text) {
      userContent.push({ type: 'text', text: part.text });
    } else if (part.inlineData) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          detail: 'low'
        }
      });
    }
  }

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.4,
    max_tokens: 1000
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return res.status(response.status).json({ error: 'Error del motor de IA', detail: errText });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? '';

    // Extract JSON from markdown code block if present
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = match ? match[1].trim() : raw.trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return res.status(500).json({ error: 'Respuesta no válida del modelo', raw });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Error de conexión con la IA' });
  }
}
