import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyA0nkn3-ECmii-kvDrMxOOF1mQ56MTKgZ0";  // ⚠️ will replace later with backend
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

function appendBubble(text, who = "bot") {
  const div = document.createElement("div");
  div.className = "bubble " + (who === "user" ? "user" : "bot");
  div.innerHTML = marked.parse(text);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askGemini(prompt) {
  appendBubble(prompt, "user");

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are LegalEase, an AI that explains legal documents simply.
              - Break down contracts & clauses into plain English.
              - Highlight risks, obligations, deadlines, and penalties.
              - Always be professional, concise, and neutral.
              - Never provide actual legal advice, only summaries & insights.
              `
            },
            { text: prompt }
          ]
        }
      ]
    });

    let reply = result.response.text();
    appendBubble(reply, "bot");
  } catch (err) {
    console.error(err);
    appendBubble("⚠️ Error: " + err.message, "bot");
  }
}

send.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  askGemini(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send.click();
  }
});

appendBubble("👋 Hi! I'm LegalEase. Upload a contract or ask me about clauses & risks.", "bot");

