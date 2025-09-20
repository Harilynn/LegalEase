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
    const response = await fetch("/api/chat", {  // ✅ Use Vercel serverless API
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle the response safely
    if (data && data.reply && typeof data.reply === 'string') {
      appendBubble(data.reply, "bot");
    } else {
      appendBubble("⚠️ Sorry, I received an empty response. Please try again.", "bot");
    }
  } catch (err) {
    console.error("Chat error:", err);
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
