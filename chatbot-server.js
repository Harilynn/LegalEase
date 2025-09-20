import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.html"));
});

// Setup Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
console.log("API Key loaded:", API_KEY ? "✅ Yes" : "❌ No");

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in environment variables");
  process.exit(1);
}

let genAI, model;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("✅ Gemini AI initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Gemini AI:", error);
  process.exit(1);
}

// API endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: "Invalid prompt provided" });
    }
    
    console.log("Received prompt:", prompt);
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("Generated response:", responseText);
    
    if (!responseText || responseText.trim() === '') {
      return res.json({ reply: "I'm sorry, I couldn't generate a response. Please try again." });
    }
    
    res.json({ reply: responseText });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong: " + err.message });
  }
});

// Start server
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Chatbot server running at http://localhost:${PORT}`);
  console.log("🔧 Press Ctrl+C to stop the server");
  console.log("🔍 Server is ready to handle requests...");
  
  // Keep the server alive with a heartbeat
  setInterval(() => {
    console.log(`🔄 Server heartbeat - ${new Date().toLocaleTimeString()}`);
  }, 60000); // Every minute
});

// Keep the server alive
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

server.on('close', () => {
  console.log('🔴 Server closed');
});

// Global error handlers (but don't exit)
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.log('🔄 Server continuing to run...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Server continuing to run...');
});

// Only handle SIGINT for manual shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Manual shutdown requested (Ctrl+C)...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

// Log startup completion
console.log('🚀 Server initialization complete');
console.log('📡 Waiting for requests...');
