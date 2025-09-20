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

// === Chatbot ===
const bubble = document.getElementById("chatbot-bubble");
const chatWindow = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("close-chat");
const expandBtn = document.getElementById("expand-btn");
const messages = document.getElementById("chatbot-messages");
const input = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");

// Toggle
bubble.addEventListener("click", () => { chatWindow.style.display = "flex"; bubble.style.display = "none"; });
closeBtn.addEventListener("click", () => { chatWindow.style.display = "none"; bubble.style.display = "flex"; });
expandBtn.addEventListener("click", () => { window.location.href = "chatbot.html"; });

// Append message
function appendMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = sender === "user" ? "bubble user" : "bubble bot";
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Send to backend
async function askBot(prompt) {
  appendMessage(prompt, "user");
  appendMessage("...", "bot");
  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    messages.lastChild.remove(); // remove "..."
    appendMessage(data.reply, "bot");
  } catch (err) {
    messages.lastChild.remove();
    appendMessage("⚠️ Error: " + err.message, "bot");
  }
}

// Events
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  askBot(text);
});
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Greeting
appendMessage("👋 Hi! I’m LegalEase Bot. How can I help?");
