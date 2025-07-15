import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send("Method Not Allowed");
  }

  const prompt = `
You are a text game storyteller in a universe called CyberBonk: a chaotic crypto-degen GTA-like world.
Return a JSON object with:
- "text": the next story node (max 3 sentences)
- "options": an array of 2-3 options (each has "text", and either "next": number or "ending": string)

Example:
{
  "text": "You wake up in a wallet farm full of feral validators.",
  "options": [
    { "text": "Challenge the validators", "ending": "gladiator" },
    { "text": "Escape through the memepipe", "next": 123 }
  ]
}

Now generate a unique story node:
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.9,
      messages: [{ role: "user", content: prompt }]
    });

    const content = chat.choices[0].message.content;
    const json = JSON.parse(content);
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
}
