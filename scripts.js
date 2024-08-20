document.addEventListener('DOMContentLoaded', () => {
    const chatPopupButton = document.getElementById('chat-popup-button');
    const chatContainer = document.getElementById('chat-container');
    const chatCloseButton = document.getElementById('chat-close-button');
    const backgroundOverlay = document.getElementById('popup-overlay');
 
    chatPopupButton.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        backgroundOverlay.style.display = chatContainer.classList.contains('hidden') ? 'none' : 'block';
        chatPopupButton.style.animation = chatContainer.classList.contains('hidden') ? 'jump 1s infinite' : 'none';
    });
 
    chatCloseButton.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        backgroundOverlay.style.display = 'none';
        chatPopupButton.style.animation = 'jump 1s infinite';
    });
});
 
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
 
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
 
async function sendInitialMessage() {
    const initialMessage = "Hi I'm here to provide answers on QMS Standards, including API and ISO. How can I assist you?";
    appendMessage("assistant", initialMessage);
}
 
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;
    chatInput.value = "";
    appendMessage("user", userMessage);
 
    // Add loading animation
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("chat-message", "assistant");
    loadingElement.innerHTML = `
<div class="loading-dots">
<span></span>
<span></span>
<span></span>
</div>`;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
 
    try {
        const response = await fetch("https://genie-gd-api-evd2f6h7fhd3c8ff.eastus-01.azurewebsites.net/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: "user", content: userMessage }),
        });
 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
 
        const data = await response.json();
 
        // Remove loading animation
        chatMessages.removeChild(loadingElement);
 
        appendMessage("assistant", data.content);
    } catch (error) {
        console.error("Error fetching or rendering response:", error);
        chatMessages.removeChild(loadingElement);
        appendMessage("assistant", "An error occurred while fetching the response.");
    }
}
 
function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", role);
 
    if (role === "assistant") {
        const iconElement = document.createElement("img");
        iconElement.classList.add("response-icon");
        iconElement.src = "icon1.png";
        iconElement.alt = "Response Icon";
        messageElement.appendChild(iconElement);
    }
 
    const contentElement = document.createElement("div");
    contentElement.classList.add("message-content");
 
    try {
        if (typeof marked.parse === "function") {
            contentElement.innerHTML = marked.parse(content);
        } else {
            throw new Error("marked.parse is not a function");
        }
    } catch (error) {
        console.error("Error rendering markdown:", error);
        contentElement.textContent = content;
    }
 
    messageElement.appendChild(contentElement);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
 
window.addEventListener('load', sendInitialMessage);
