import { getCourse, getMessages, addMessage } from '../db.js';

class CourseChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._courseId = null;
        this._courseTitle = null;
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100vh; /* Full viewport height */
                    width: 100%;
                }
                .screen {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    box-sizing: border-box;
                }
                .header {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--background-color);
                    flex-shrink: 0;
                }
                .header a {
                    color: var(--primary-text-color);
                    text-decoration: none;
                    margin-right: 20px;
                    font-size: 24px;
                }
                 .header h3 {
                    margin: 0;
                    font-size: 20px;
                }
                .chat-messages {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .message {
                    margin-bottom: 15px;
                    display: flex;
                }
                .message p {
                    margin: 0;
                    padding: 12px 15px;
                    border-radius: 12px;
                    width: fit-content;
                    max-width: 80%;
                    line-height: 1.5;
                }
                .user-message {
                   justify-content: flex-end;
                }
                .user-message p {
                    background-color: var(--accent-color);
                    color: white;
                }
                .ai-message p {
                    background-color: #262D37;
                }
                .chat-input {
                    display: flex;
                    padding: 20px;
                    border-top: 1px solid var(--border-color);
                    background-color: var(--background-color);
                    flex-shrink: 0;
                }
                .chat-input input {
                    flex-grow: 1;
                    background-color: var(--input-background);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 10px 15px;
                    color: var(--primary-text-color);
                    font-size: 16px;
                }
                .chat-input button {
                    background-color: var(--accent-color);
                    border: none;
                    border-radius: 8px;
                    padding: 0 20px;
                    margin-left: 10px;
                    cursor: pointer;
                    color: white;
                    font-size: 20px;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <a href="#" class="back-button">&larr;</a>
                    <h3 id="course-title"></h3>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Ask a question...">
                    <button>&uarr;</button>
                </div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['course-id', 'course-title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'course-id') {
            this.courseId = newValue;
        } else if (name === 'course-title') {
            this.courseTitle = newValue;
        }
    }

    set courseId(value) {
        this._courseId = value;
        this.loadChat();
    }

    get courseId() {
        return this._courseId;
    }
    
    set courseTitle(value) {
        this._courseTitle = value;
        this.shadowRoot.querySelector('#course-title').textContent = this._courseTitle;
    }

    get courseTitle() {
        return this._courseTitle;
    }

    connectedCallback() {
        const backButton = this.shadowRoot.querySelector('.back-button');
        const sendButton = this.shadowRoot.querySelector('.chat-input button');
        const messageInput = this.shadowRoot.querySelector('.chat-input input');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'my-courses' } }));
        });

        sendButton.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    async loadChat() {
        if (!this.db || !this.courseId) return;

        this.course = await getCourse(this.db, parseInt(this.courseId));
        const messages = await getMessages(this.db, parseInt(this.courseId));
        
        this.renderMessages(messages);
    }

    renderMessages(messages) {
        const chatMessages = this.shadowRoot.querySelector('.chat-messages');
        chatMessages.innerHTML = ''; // Clear existing messages
        
        // Add initial AI welcome message if there are no messages
        if (messages.length === 0) {
             const welcomeMessage = document.createElement('div');
            welcomeMessage.classList.add('message', 'ai-message');
            welcomeMessage.innerHTML = `<p>Welcome to ${this.courseTitle}! I'm your AI tutor. Ask me anything about the course material.</p>`;
            chatMessages.appendChild(welcomeMessage);
        }

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', message.sender === 'user' ? 'user-message' : 'ai-message');
            messageElement.innerHTML = `<p>${message.text}</p>`;
            chatMessages.appendChild(messageElement);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async sendMessage() {
        const messageInput = this.shadowRoot.querySelector('.chat-input input');
        const text = messageInput.value.trim();
        if (text === '' || !this.course) return;

        const userMessage = {
            courseId: parseInt(this.courseId),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        // Render user message immediately
        this.renderSingleMessage(userMessage);
        await addMessage(this.db, userMessage);
        messageInput.value = '';

        // Get AI response
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    context: this.course.textContent
                })
            });

            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = {
                courseId: parseInt(this.courseId),
                text: data.reply,
                sender: 'ai',
                timestamp: new Date()
            };

            this.renderSingleMessage(aiMessage);
            await addMessage(this.db, aiMessage);

        } catch (error) {
            console.error('Error fetching AI response:', error);
             const errorMessage = {
                courseId: parseInt(this.courseId),
                text: "Sorry, I couldn't connect to the AI. Please check your connection and try again.",
                sender: 'ai',
                timestamp: new Date()
            };
            this.renderSingleMessage(errorMessage);
        }
    }

    renderSingleMessage(message) {
        const chatMessages = this.shadowRoot.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.sender === 'user' ? 'user-message' : 'ai-message');
        messageElement.innerHTML = `<p>${message.text}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

customElements.define('course-chat', CourseChat);
