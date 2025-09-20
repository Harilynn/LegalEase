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
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    appendBubble(data.reply, "bot");
  } catch (err) {
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
