import { getCourse, getMessages, addMessage } from '../db.js';

class CourseChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._courseId = null;
        this._courseTitle = null;
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
                
                :root {
                    --light-background: #f9fafb;
                    --dark-background: #1f2937;
                    --ai-bubble: #3b82f6;
                    --user-bubble: #10b981;
                }
                
                /* Global full-width enforcement */
                * {
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .dark {
                    --background: var(--dark-background);
                    --text-primary: #f9fafb;
                    --text-secondary: #d1d5db;
                    --sidebar-bg: #111827;
                    --card-bg: #1f2937;
                    --input-bg: #374151;
                    --active-item-bg: #374151;
                }
                
                .light {
                    --background: var(--light-background);
                    --text-primary: #1f2937;
                    --text-secondary: #6b7280;
                    --sidebar-bg: #ffffff;
                    --card-bg: #ffffff;
                    --input-bg: #f3f4f6;
                    --active-item-bg: #f3f4f6;
                }
                
                :host {
                    display: flex;
                    height: 100vh;
                    width: 100%;
                    background-color: var(--background);
                    color: var(--text-primary);
                    font-family: "Be Vietnam Pro", "Noto Sans", sans-serif;
                    font-synthesis: antialiased;
                }
                
                .screen {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                }
                
                .header {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    border-bottom: 1px solid #374151;
                    background-color: var(--background);
                    box-sizing: border-box;
                }
                
                .main-content {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .back-button {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: background-color 0.2s ease;
                    margin-right: 1rem;
                }
                
                .back-button:hover {
                    background-color: var(--active-item-bg);
                }
                
                .header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                    flex: 1;
                }
                
                .chat-area {
                    flex: 1;
                    width: 100%;
                    overflow-y: auto;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                
                .message {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    max-width: 32rem;
                }
                
                .message.user {
                    margin-left: auto;
                    justify-content: flex-end;
                }
                
                .message-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background-color: #374151;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .message-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .message-sender {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                
                .message.user .message-content {
                    align-items: flex-end;
                }
                
                .message-bubble {
                    padding: 1rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    color: white;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                .ai-message .message-bubble {
                    background-color: var(--ai-bubble);
                    border-bottom-left-radius: 0;
                }
                
                .user-message .message-bubble {
                    background-color: var(--user-bubble);
                    border-bottom-right-radius: 0;
                }
                
                .chat-input-area {
                    width: 100%;
                    padding: 1rem;
                    border-top: 1px solid #374151;
                    box-sizing: border-box;
                }
                
                .input-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background-color: var(--input-bg);
                    border-radius: 0.75rem;
                    padding: 0.5rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                
                .message-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                    outline: none;
                }
                
                .message-input::placeholder {
                    color: var(--text-secondary);
                }
                
                .send-btn {
                    background-color: #2563eb;
                    color: white;
                    border-radius: 0.5rem;
                    height: 2.5rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                
                .send-btn:hover {
                    background-color: #1d4ed8;
                }
                
                
                /* Responsive design */
                @media (max-width: 640px) {
                    .message {
                        max-width: 100%;
                    }
                    
                    .chat-area {
                        padding: 1rem;
                        gap: 1.5rem;
                    }
                }
            </style>
            <div class="screen dark">
                <div class="main-content">
                    <header class="header">
                        <button class="back-button">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h2 class="header-title" id="course-title">Introduction to Machine Learning</h2>
                    </header>
                    
                    <div class="chat-area" id="chat-messages">
                        <div class="message ai-message">
                            <div class="message-avatar">
                                <span class="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div class="message-content">
                                <p class="message-sender">AI Tutor</p>
                                <div class="message-bubble">
                                    <p>Welcome to the course! Let's start with the basics. What is your current understanding of machine learning?</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="message user-message">
                            <div class="message-content">
                                <p class="message-sender">You</p>
                                <div class="message-bubble">
                                    <p>I know it's about algorithms that learn from data, but I'm not sure about the specifics.</p>
                                </div>
                            </div>
                            <div class="message-avatar">
                                <span class="material-symbols-outlined">person</span>
                            </div>
                        </div>
                        
                        <div class="message ai-message">
                            <div class="message-avatar">
                                <span class="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div class="message-content">
                                <p class="message-sender">AI Tutor</p>
                                <div class="message-bubble">
                                    <p>That's a great start! Machine learning is a subset of AI that focuses on building systems that can learn from and make decisions based on data. We can dive into supervised, unsupervised, and reinforcement learning. Which one sounds most interesting to you?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="input-container">
                            <input type="text" class="message-input" placeholder="Type your message..." id="message-input">
                            <button class="send-btn" id="send-button">
                                <span class="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['course-id', 'course-title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'course-id') {
            this._courseId = newValue;
            this.loadChat();
        } else if (name === 'course-title') {
            this._courseTitle = newValue;
            this.updateTitle();
        }
    }

    set courseId(value) {
        this._courseId = value;
        this.setAttribute('course-id', value);
    }

    get courseId() {
        return this._courseId;
    }

    set courseTitle(value) {
        this._courseTitle = value;
        this.setAttribute('course-title', value);
    }

    get courseTitle() {
        return this._courseTitle;
    }

    connectedCallback() {
        const backButton = this.shadowRoot.querySelector('.back-button');
        const sendButton = this.shadowRoot.querySelector('#send-button');
        const messageInput = this.shadowRoot.querySelector('#message-input');

        // Back button
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { 
                bubbles: true, 
                composed: true, 
                detail: { screen: 'my-courses' } 
            }));
        });

        // Send message
        sendButton.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    updateTitle() {
        const titleElement = this.shadowRoot.querySelector('#course-title');
        if (titleElement && this._courseTitle) {
            titleElement.textContent = this._courseTitle;
        }
    }

    async loadChat() {
        if (!this.db || !this.courseId) return;

        this.course = await getCourse(this.db, parseInt(this.courseId));
        const messages = await getMessages(this.db, parseInt(this.courseId));
        
        this.renderMessages(messages);
    }

    renderMessages(messages) {
        const chatMessages = this.shadowRoot.querySelector('#chat-messages');
        chatMessages.innerHTML = ''; // Clear existing messages
        
        // Add initial AI welcome message if there are no messages
        if (messages.length === 0) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'message ai-message';
            welcomeMessage.innerHTML = `
                <div class="message-avatar">
                    <span class="material-symbols-outlined">smart_toy</span>
                </div>
                <div class="message-content">
                    <p class="message-sender">AI Tutor</p>
                    <div class="message-bubble">
                        <p>Welcome to the course! Let's start with the basics. What is your current understanding of machine learning?</p>
                    </div>
                </div>
            `;
            chatMessages.appendChild(welcomeMessage);
        } else {
            messages.forEach(message => {
                chatMessages.appendChild(this.renderSingleMessage(message));
            });
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async sendMessage() {
        const messageInput = this.shadowRoot.querySelector('#message-input');
        const messageText = messageInput.value.trim();
        
        if (!messageText) return;

        // Clear input
        messageInput.value = '';

        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            content: messageText,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        this.addMessageToChat(userMessage);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                content: "That's a great question! Let me help you understand that concept better. Can you tell me more about what specific aspect you'd like to explore?",
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            this.addMessageToChat(aiResponse);
        }, 1000);
    }

    addMessageToChat(message) {
        const chatMessages = this.shadowRoot.querySelector('#chat-messages');
        chatMessages.appendChild(this.renderSingleMessage(message));
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    renderSingleMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`;
        
        if (message.sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p class="message-sender">You</p>
                    <div class="message-bubble">
                        <p>${message.content}</p>
                    </div>
                </div>
                <div class="message-avatar">
                    <span class="material-symbols-outlined">person</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <span class="material-symbols-outlined">smart_toy</span>
                </div>
                <div class="message-content">
                    <p class="message-sender">AI Tutor</p>
                    <div class="message-bubble">
                        <p>${message.content}</p>
                    </div>
                </div>
            `;
        }
        
        return messageDiv;
    }
}

customElements.define('course-chat', CourseChat);