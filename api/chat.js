// api/chat.js - Vercel Serverless Function
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Invalid prompt provided" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    console.log("Received prompt:", prompt);
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("Generated response:", responseText);
    
    if (!responseText || responseText.trim() === '') {
      return res.json({ reply: "I'm sorry, I couldn't generate a response. Please try again." });
    }
    
    return res.status(200).json({ reply: responseText });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Something went wrong: " + err.message });
  }
}
