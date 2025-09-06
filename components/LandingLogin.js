class LandingLogin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: var(--secondary-text-color);
                    text-align: center;
                    margin-bottom: 40px;
                }
                button {
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                #student-signup {
                    background-color: var(--accent-color);
                    color: white;
                }
                #admin-login {
                    background-color: transparent;
                    color: var(--accent-color);
                    border: 1px solid var(--accent-color);
                }
            </style>
            <div class="screen">
                <h1>Learn Offline. Chat with Knowledge.</h1>
                <p>Your personal AI-powered study partner, available anytime, anywhere, even without an internet connection.</p>
                <button id="student-signup">Student Sign-Up</button>
                <button id="admin-login">Admin Login</button>
            </div>
        `;
    }
}
customElements.define('landing-login', LandingLogin);
