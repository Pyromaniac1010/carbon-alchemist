export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { feeling, medium } = req.body || {};

  if (!feeling || !medium) return res.status(400).json({ error: 'Missing feeling or medium' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Server missing Gemini API key' });

  const systemPrompt = `You are the 'Pressure' in the Carbon Assistant. Your role is to take the user's raw 'Feeling' (creative block or emotion) and their chosen 'Medium' and generate a single, highly specialized, disruptive, and actionable creative starting prompt. The goal is not to write the work for them, but to provide a unique, unexpected angle (the 'Pressure') to transform their raw emotion (the 'Carbon') into a first step. Your response must be only the prompt text, without any introductory phrases, bullet points, or numbering.`;
  const userQuery = `The user's current feeling/creative block is: "${feeling}". The creative medium they want to work in is: "${medium}". Generate a specialized, actionable prompt for them.`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    temperature: 0.85,
    maxOutputTokens: 250
  };

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return res.status(200).json({ text });
  } catch (e) {
    console.error('Gemini call error', e);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}
