export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { apiKey, prompt } = req.body || {};
  if (!apiKey || !prompt) return res.status(400).json({ error: 'Нет ключа или текста' });

  const host = 'generativelanguage.' + 'googleapis.com';
  const models = [
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-pro-latest',
    'gemini-2.5-pro'
  ];

  let lastStatus = 503;
  let lastText = '';

  for (const model of models) {
    const r = await fetch(
      `https://${host}/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    lastStatus = r.status;
    lastText = await r.text();
    if (r.ok) {
      return res.status(200).send(lastText);
    }
    if (r.status !== 503 && r.status !== 429) {
      break;
    }
  }

  res.status(lastStatus).send(lastText);
}
