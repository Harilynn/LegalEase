// api/chat.js
import express from "express";
import fetch from "node-fetch"; // use native fetch if Node >=18
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files (dashboard.html, dashboard.js, dashboard.css)
app.use(express.static(path.join(__dirname, "../")));

// Default route → dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard.html"));
});

// Chat API endpoint
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

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
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
