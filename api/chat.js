// api/chat.js
import fetch from "node-fetch"; // optional on Node 18+
import dotenv from "dotenv";

dotenv.config(); // Only needed locally; Vercel reads env automatically

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = await req.json?.() || JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { prompt } = body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("GEMINI_API_KEY not set in environment!");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const googleResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await googleResp.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(data);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Upstream error:", err);
    return res.status(500).json({ error: "Upstream API error" });
  }
}
