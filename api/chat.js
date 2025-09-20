// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          maxOutputTokens: 500
        })
      }
    );

    const data = await response.json();

    // Extract text reply safely
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from server";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Upstream error:", err);
    return res.status(500).json({ error: "Upstream API error" });
  }
}
