export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { apiKey, prompt } = req.body || {};
  if (!apiKey || !prompt) return res.status(400).json({ error: 'Нет ключа или текста' });

  const host = 'generativelanguage.' + 'googleapis.com';
  const r = await fetch(
    `https://${host}/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const text = await r.text();
  res.status(r.status).send(text);
}
