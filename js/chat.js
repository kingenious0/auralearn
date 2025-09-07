// js/chat.js
let currentSlug = 'getting-started'; // default
const messages = [];

// Initialize chat
function initChat() {
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }
  
  if (sendButton) {
    sendButton.addEventListener('click', handleSend);
  }
  
  renderMessages();
}

// Select course for chat
async function selectCourse(slug) {
  currentSlug = slug;
  const chatHeader = document.getElementById('chatHeader');
  if (chatHeader) {
    chatHeader.innerHTML = `<h2 class="text-xl font-semibold">${slug}</h2>`;
  }
  messages.length = 0; // reset
  renderMessages();
}

// Handle sending messages
async function handleSend() {
  const chatInput = document.getElementById('chatInput');
  if (!chatInput) return;
  
  const text = chatInput.value.trim();
  if (!text) return;

  // Add user message immediately
  messages.push({ sender: 'user', text, timestamp: new Date() });
  renderMessages();
  chatInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();

  try {
    // Try cloud AI first (OpenRouter)
    const aiResponse = await callWorkerAI(text);
    messages.push({ sender: 'ai', text: aiResponse, timestamp: new Date() });
  } catch (error) {
    console.error('Cloud AI failed:', error);
    
    // Fallback to local AI
    try {
      const aiResponse = await callLocalAI(text);
      messages.push({ sender: 'ai', text: aiResponse, timestamp: new Date() });
    } catch (localError) {
      console.error('Local AI failed:', localError);
      messages.push({ 
        sender: 'ai', 
        text: 'Sorry, AI is currently unavailable. Please try again later.', 
        timestamp: new Date() 
      });
    }
  }
  
  hideTypingIndicator();
  renderMessages();
}

// Call local DeepSeek AI
async function callLocalAI(userMessage) {
  const courseContext = localStorage.getItem('courseContext');
  const context = courseContext ? JSON.parse(courseContext) : {};
  
  const prompt = `You are an AI tutor for the course "${context.title || 'Learning'}". 
Course description: ${context.description || 'General learning course'}
Course content: ${context.content || 'No specific content available'}

User question: ${userMessage}

Provide a helpful, educational response based on the course context. Keep responses concise but informative.`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-r1:8b',
      prompt: prompt,
      stream: false
    })
  });

  if (!res.ok) {
    throw new Error('Local AI server not available');
  }

  const data = await res.json();
  return data.response || 'I apologize, but I could not generate a response.';
}

// Call OpenRouter API (cloud AI)
async function callWorkerAI(userMessage) {
  const courseContext = localStorage.getItem('courseContext');
  const context = courseContext ? JSON.parse(courseContext) : {};
  
  // Get API key from admin settings
  const apiKey = localStorage.getItem('auraApiKey');
  
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      context: JSON.stringify(context),
      apiKey: apiKey
    })
  });

  if (!res.ok) {
    throw new Error('Cloud AI not available');
  }

  const data = await res.json();
  return data.reply || 'I apologize, but I could not generate a response.';
}

// Show typing indicator
function showTypingIndicator() {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex justify-start mb-4';
  typingDiv.innerHTML = `
    <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
      <div class="flex space-x-1">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  `;
  
  chatArea.appendChild(typingDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Render messages (StudyAl style)
function renderMessages() {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;
  
  const html = messages.map(m => `
    <div class="flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
      <div class="${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'} chat-bubble p-4 max-w-[80%]">
        <div class="flex items-center gap-2 mb-1">
          ${m.sender === 'ai' ? '<span class="material-symbols-outlined text-blue-600">smart_toy</span>' : ''}
          <span class="font-medium text-sm">${m.sender === 'user' ? 'You' : 'AI Tutor'}</span>
        </div>
        <div class="text-sm">${m.text}</div>
        <div class="text-xs opacity-70 mt-1">${formatTime(m.timestamp)}</div>
      </div>
    </div>
  `).join('');
  
  chatArea.innerHTML = html;
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Format timestamp
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Clear chat history
function clearChat() {
  messages.length = 0;
  renderMessages();
}

// Functions are now globally available

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initChat);
