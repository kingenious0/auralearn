class LandingLogin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&display=swap');
                
                :root {
                    --primary-red: #ea2a33;
                    --primary-red-hover: #dc2626;
                    --gray-800: #1f2937;
                    --gray-700: #374151;
                    --gray-600: #4b5563;
                    --gray-300: #d1d5db;
                    --white: #ffffff;
                }
                
                /* Global full-width enforcement */
                * {
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .screen {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    font-family: "Be Vietnam Pro", "Noto Sans", sans-serif;
                    background-color: var(--gray-800);
                    color: var(--white);
                    overflow-x: hidden;
                }
                
                .layout-container {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .header {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.25rem 2.5rem;
                    white-space: nowrap;
                    box-sizing: border-box;
                }
                
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--white);
                }
                
                .logo-icon {
                    height: 2rem;
                    width: 2rem;
                    color: var(--white);
                }
                
                .logo-text {
                    color: var(--white);
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                
                .header-controls {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .admin-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background-color: var(--gray-700);
                    border-radius: 9999px;
                    padding: 0.25rem 0.75rem;
                }
                
                .admin-text {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--gray-300);
                }
                
                .theme-toggle {
                    display: flex;
                    height: 2rem;
                    width: 2rem;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    background-color: var(--gray-600);
                    color: var(--white);
                    border: none;
                    transition: all 0.2s ease;
                }
                
                .theme-toggle:hover {
                    background-color: var(--gray-700);
                }
                
                .main-content {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                
                .content-wrapper {
                    max-width: 48rem;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                @media (min-width: 640px) {
                    .content-wrapper {
                        padding: 0 1.5rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    .content-wrapper {
                        padding: 0 2rem;
                    }
                }
                
                .hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: -0.025em;
                    color: var(--white);
                    margin: 0;
                }
                
                @media (min-width: 640px) {
                    .hero-title {
                        font-size: 3.75rem;
                    }
                }
                
                @media (min-width: 768px) {
                    .hero-title {
                        font-size: 4.5rem;
                    }
                }
                
                .hero-subtitle {
                    margin-top: 1.5rem;
                    font-size: 1.125rem;
                    line-height: 1.75;
                    color: var(--gray-300);
                    margin-bottom: 0;
                }
                
                .button-group {
                    margin-top: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                }
                
                .btn-primary {
                    border-radius: 0.375rem;
                    background-color: var(--primary-red);
                    padding: 0.75rem 1.25rem;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--white);
                    text-decoration: none;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }
                
                .btn-primary:hover {
                    background-color: var(--primary-red-hover);
                }
                
                .btn-primary:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px var(--primary-red);
                }
                
                .btn-secondary {
                    font-size: 1rem;
                    font-weight: 600;
                    line-height: 1.5;
                    color: var(--white);
                    text-decoration: none;
                    transition: all 0.2s ease;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                
                .btn-secondary:hover {
                    color: var(--gray-300);
                }
                
                .btn-secondary span {
                    margin-left: 0.25rem;
                }
                
                /* Responsive adjustments */
                @media (max-width: 640px) {
                    .header {
                        padding: 1rem;
                    }
                    
                    .button-group {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .btn-primary,
                    .btn-secondary {
                        width: 100%;
                        max-width: 20rem;
                        text-align: center;
                    }
                }
            </style>
            <div class="screen">
                <div class="layout-container">
                    <header class="header">
                        <div class="logo-section">
                            <svg class="logo-icon" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_6_543)">
                                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                                    <path clip-rule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fill-rule="evenodd"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_543">
                                        <rect fill="white" height="48" width="48"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                            <h2 class="logo-text">Offline Learning</h2>
                        </div>
                        <div class="header-controls">
                            <div class="admin-badge">
                                <span class="admin-text">Admin</span>
                                <button class="theme-toggle" id="theme-toggle">
                                    <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>
                    <main class="main-content">
                        <div class="content-wrapper">
                            <h1 class="hero-title">Learn Offline. Chat with Knowledge.</h1>
                            <p class="hero-subtitle">Your personal AI-powered learning companion. Access materials and deepen your understanding, anytime, anywhere, even without an internet connection.</p>
                            <div class="button-group">
                                <button class="btn-primary" id="student-signup">Student Sign-Up</button>
                                <button class="btn-secondary" id="admin-login">Admin Login <span aria-hidden="true">→</span></button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const themeToggle = this.shadowRoot.getElementById('theme-toggle');
        const studentSignup = this.shadowRoot.getElementById('student-signup');
        const adminLogin = this.shadowRoot.getElementById('admin-login');
        const screen = this.shadowRoot.querySelector('.screen');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            screen.classList.add('light');
            themeToggle.querySelector('span').textContent = 'light_mode';
        }

        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            screen.classList.toggle('light');
            const isLight = screen.classList.contains('light');
            
            // Update icon
            themeToggle.querySelector('span').textContent = isLight ? 'dark_mode' : 'light_mode';
            
            // Save theme preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        // Student signup button
        studentSignup.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', { 
                bubbles: true, 
                composed: true, 
                detail: { screen: 'my-courses' } 
            }));
        });

        // Admin login button
        adminLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { 
                bubbles: true, 
                composed: true, 
                detail: { screen: 'manage-courses' } 
            }));
        });
    }
}
customElements.define('landing-login', LandingLogin);
