// === Charts ===
const ctx = document.getElementById('riskChart').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [8, 20, 12],
      backgroundColor: ['#e63946', '#d4a017', '#2a9d8f'],
      borderWidth: 1
    }]
  },
  options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

const ctx2 = document.getElementById('docsChart').getContext('2d');
new Chart(ctx2, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Documents Uploaded',
      data: [2, 4, 6, 3, 8, 5, 7],
      borderColor: '#2a9d8f',
      backgroundColor: 'rgba(42, 157, 143, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#2a9d8f'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  }
});

// === Chatbot Elements ===
const bubble = document.getElementById("chatbot-bubble");
const chatWindow = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("close-chat");
const expandBtn = document.getElementById("expand-btn");
const messages = document.getElementById("chatbot-messages");
const input = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");

// Toggle chat window
bubble.addEventListener("click", () => { chatWindow.style.display = "flex"; bubble.style.display = "none"; });
closeBtn.addEventListener("click", () => { chatWindow.style.display = "none"; bubble.style.display = "flex"; });
expandBtn.addEventListener("click", () => { window.location.href = "chatbot.html"; });

// Append message to chat
function appendMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.style.margin = "6px 0";
  div.style.padding = "8px 12px";
  div.style.borderRadius = "12px";
  div.style.maxWidth = "75%";
  div.style.fontSize = "0.85rem";
  div.style.wordWrap = "break-word";
  div.style.alignSelf = sender === "user" ? "flex-end" : "flex-start";
  div.style.background = sender === "user" ? "#c6f7e2" : "#e1f5fe";
  
  if (sender === "bot") {
    // Clean up markdown formatting for better display
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** -> bold (remove asterisks)
      .replace(/\*([^*\n]+)\*/g, '$1') // *italic* -> italic (remove single asterisks, but not bullet points)
      .replace(/^\* /gm, '• ') // Convert * at start of line to bullet points
      .replace(/\n\* /g, '\n• '); // Convert * bullet points in middle of text
    div.innerText = cleanText;
  } else {
    div.innerText = text;
  }
  
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// === Ask Gemini 2.5-Flash via Vercel serverless function ===
async function askGemini(prompt) {
  appendMessage(prompt, "user");
  appendMessage("...", "bot"); // typing indicator

  try {
    const res = await fetch("/api/chat", {  // ✅ Use Vercel serverless endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const payload = await res.json();
    messages.lastChild.remove(); // remove typing indicator

    if (payload && payload.reply && typeof payload.reply === 'string') {
      appendMessage(payload.reply, "bot");
    } else {
      appendMessage("⚠ Sorry, I received an empty response. Please try again.", "bot");
    }

  } catch (err) {
    messages.lastChild.remove();
    console.error("Dashboard chat error:", err);
    appendMessage("⚠ Error: " + err.message, "bot");
  }
}

// Send button
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  askGemini(text);
});

// Enter key support
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Initial greeting
appendMessage("👋 Hi! I’m LegalEase Bot. How can I help?");
