// Client-side chat functionality for AURA Learn
// This file handles chat interactions from the frontend

let messages = [];

// Initialize chat system
function initChat() {
  console.log('Chat system initialized');
  loadMessages();
}

// Load messages from localStorage
function loadMessages() {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    messages = JSON.parse(savedMessages);
    renderMessages();
  }
}

// Save messages to localStorage
function saveMessages() {
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Render messages in the chat container
function renderMessages() {
  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;

  chatContainer.innerHTML = messages.map(msg => `
    <div class="message ${msg.sender}">
      <div class="message-content">${msg.text}</div>
      <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
    </div>
  `).join('');
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message to AI
async function sendMessage(text) {
  if (!text.trim()) return;

  // Add user message
  const userMessage = {
    sender: 'user',
    text: text,
    timestamp: new Date()
  };
  messages.push(userMessage);
  renderMessages();
  saveMessages();

  // Show typing indicator
  showTypingIndicator();

  try {
    // Get course context
    const courseContext = localStorage.getItem('courseContext') || '';
    
    // Call our API endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        context: courseContext
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Add AI response
    const aiMessage = {
      sender: 'ai',
      text: data.reply,
      timestamp: new Date()
    };
    messages.push(aiMessage);
    
  } catch (error) {
    console.error('Chat error:', error);
    
    // Add error message
    const errorMessage = {
      sender: 'ai',
      text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
      timestamp: new Date()
    };
    messages.push(errorMessage);
  }

  hideTypingIndicator();
  renderMessages();
  saveMessages();
}

// Show typing indicator
function showTypingIndicator() {
  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;

  const typingDiv = document.createElement('div');
  typingDiv.id = 'typingIndicator';
  typingDiv.className = 'message ai typing';
  typingDiv.innerHTML = `
    <div class="message-content">
      <span class="typing-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    </div>
  `;
  
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Clear chat history
function clearChat() {
  messages = [];
  localStorage.removeItem('chatMessages');
  renderMessages();
}

// Export functions for global access
window.initChat = initChat;
window.sendMessage = sendMessage;
window.clearChat = clearChat;
window.renderMessages = renderMessages;