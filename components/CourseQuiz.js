class CourseQuiz extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._courseId = null;
        this._courseTitle = null;
        this.currentQuestion = 0;
        this.questions = [
            {
                type: 'multiple-choice',
                question: "What was the primary cause of the French Revolution?",
                options: [
                    "The rise of Napoleon",
                    "Social inequality",
                    "The Seven Years' War",
                    "The American Revolution"
                ],
                correct: 1
            },
            {
                type: 'short-answer',
                question: "Briefly describe the role of the Estates-General.",
                placeholder: "Type your short answer..."
            }
        ];
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100%;
                    background-color: #F8FAFC;
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
                    padding: 16px 20px;
                    background-color: white;
                    border-bottom: 1px solid #E2E8F0;
                    flex-shrink: 0;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .back-button {
                    color: #4F46E5;
                    text-decoration: none;
                    margin-right: 16px;
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .share-button {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #64748B;
                    font-size: 18px;
                    cursor: pointer;
                }
                .quiz-content {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                .welcome-message {
                    background-color: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .welcome-message p {
                    margin: 0 0 16px 0;
                    color: #1E293B;
                    line-height: 1.6;
                }
                .start-quiz-btn {
                    background-color: #4F46E5;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .start-quiz-btn:hover {
                    background-color: #4338CA;
                }
                .quiz-section {
                    background-color: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .quiz-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1E293B;
                    margin: 0 0 24px 0;
                }
                .question {
                    margin-bottom: 24px;
                }
                .question h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1E293B;
                    margin: 0 0 16px 0;
                }
                .options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .option {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background-color: #F8FAFC;
                }
                .option:hover {
                    border-color: #4F46E5;
                    background-color: #F0F4FF;
                }
                .option.selected {
                    border-color: #4F46E5;
                    background-color: #F0F4FF;
                }
                .option input[type="radio"] {
                    margin-right: 12px;
                    accent-color: #4F46E5;
                }
                .option label {
                    cursor: pointer;
                    flex: 1;
                    color: #1E293B;
                    font-weight: 500;
                }
                .short-answer {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    font-size: 16px;
                    color: #1E293B;
                    background-color: #F8FAFC;
                    outline: none;
                    transition: border-color 0.2s ease;
                    box-sizing: border-box;
                }
                .short-answer:focus {
                    border-color: #4F46E5;
                    background-color: white;
                }
                .short-answer::placeholder {
                    color: #94A3B8;
                }
                .bottom-nav {
                    display: flex;
                    justify-content: space-around;
                    padding: 12px 20px;
                    background-color: white;
                    border-top: 1px solid #E2E8F0;
                }
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: #94A3B8;
                    text-decoration: none;
                    font-size: 12px;
                    transition: color 0.3s ease;
                }
                .nav-item.active {
                    color: #4F46E5;
                }
                .nav-icon {
                    width: 24px;
                    height: 24px;
                    background-color: currentColor;
                    border-radius: 4px;
                }
                .hidden {
                    display: none;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <a href="#" class="back-button">← History 101</a>
                    <button class="share-button">📤</button>
                </div>
                <div class="quiz-content">
                    <div class="welcome-message">
                        <p>Welcome to History 101! I'm your AI tutor. Ask me anything about the course material, or we can start a quiz to test your knowledge.</p>
                        <button class="start-quiz-btn">Let's start a quiz!</button>
                    </div>
                    <div class="quiz-section hidden" id="quiz-section">
                        <h2 class="quiz-title">Quiz Time!</h2>
                        <div id="question-container"></div>
                    </div>
                </div>
                <div class="bottom-nav">
                    <a href="#" class="nav-item">
                        <div class="nav-icon"></div>
                        History
                    </a>
                    <a href="#" class="nav-item">
                        <div class="nav-icon"></div>
                        Notes
                    </a>
                    <a href="#" class="nav-item active">
                        <div class="nav-icon"></div>
                        Quizzes
                    </a>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const backButton = this.shadowRoot.querySelector('.back-button');
        const startQuizBtn = this.shadowRoot.querySelector('.start-quiz-btn');
        const quizSection = this.shadowRoot.querySelector('#quiz-section');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { 
                bubbles: true, 
                composed: true, 
                detail: { screen: 'my-courses' } 
            }));
        });

        startQuizBtn.addEventListener('click', () => {
            this.startQuiz();
        });
    }

    startQuiz() {
        const welcomeMessage = this.shadowRoot.querySelector('.welcome-message');
        const quizSection = this.shadowRoot.querySelector('#quiz-section');
        
        welcomeMessage.classList.add('hidden');
        quizSection.classList.remove('hidden');
        
        this.renderQuestion();
    }

    renderQuestion() {
        const questionContainer = this.shadowRoot.querySelector('#question-container');
        const question = this.questions[this.currentQuestion];
        
        let questionHTML = `
            <div class="question">
                <h3>Question ${this.currentQuestion + 1}: ${question.question}</h3>
        `;
        
        if (question.type === 'multiple-choice') {
            questionHTML += '<div class="options">';
            question.options.forEach((option, index) => {
                questionHTML += `
                    <div class="option" data-option="${index}">
                        <input type="radio" name="question-${this.currentQuestion}" value="${index}" id="option-${index}">
                        <label for="option-${index}">${option}</label>
                    </div>
                `;
            });
            questionHTML += '</div>';
        } else if (question.type === 'short-answer') {
            questionHTML += `
                <input type="text" class="short-answer" placeholder="${question.placeholder}">
            `;
        }
        
        questionHTML += '</div>';
        questionContainer.innerHTML = questionHTML;
        
        // Add event listeners for options
        if (question.type === 'multiple-choice') {
            const options = this.shadowRoot.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    option.querySelector('input[type="radio"]').checked = true;
                });
            });
        }
    }
}

customElements.define('course-quiz', CourseQuiz);
