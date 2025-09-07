import { getCourses } from '../db.js';

class MyCourses extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
                
                :root {
                    --primary-purple: #8b5cf6;
                    --primary-purple-hover: #7c3aed;
                    --gray-50: #f9fafb;
                    --gray-100: #f3f4f6;
                    --gray-200: #e5e7eb;
                    --gray-300: #d1d5db;
                    --gray-400: #9ca3af;
                    --gray-500: #6b7280;
                    --gray-600: #4b5563;
                    --gray-700: #374151;
                    --gray-800: #1f2937;
                    --gray-900: #111827;
                    --white: #ffffff;
                    --black: #000000;
                }
                
                /* Global full-width enforcement */
                * {
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .screen {
                    min-height: 100vh;
                    width: 100%;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    background-color: var(--white);
                    color: var(--gray-900);
                    font-family: "Be Vietnam Pro", "Noto Sans", sans-serif;
                    overflow-x: hidden;
                    position: relative;
                }
                
                .header {
                    width: 100%;
                    padding: 1rem;
                    background-color: var(--white);
                    border-bottom: 1px solid var(--gray-200);
                    box-sizing: border-box;
                }
                
                .header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                
                .header h1 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--gray-900);
                }
                
                .notifications-btn {
                    background: none;
                    border: none;
                    color: var(--gray-600);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                }
                
                .notifications-btn:hover {
                    background-color: var(--gray-100);
                    color: var(--gray-900);
                }
                
                .search-container {
                    position: relative;
                }
                
                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--gray-400);
                    font-size: 1.25rem;
                }
                
                .search-bar {
                    width: 100%;
                    background-color: var(--gray-100);
                    color: var(--gray-900);
                    border: 1px solid var(--gray-200);
                    border-radius: 0.5rem;
                    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                    font-size: 1rem;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }
                
                .search-bar:focus {
                    outline: none;
                    border-color: var(--primary-purple);
                    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
                }
                
                .search-bar::placeholder {
                    color: var(--gray-400);
                }
                
                .main-content {
                    flex: 1;
                    padding: 2rem 1rem;
                    overflow-y: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }
                
                .empty-state {
                    text-align: center;
                    max-width: 24rem;
                }
                
                .empty-state h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem 0;
                    color: var(--gray-900);
                }
                
                .empty-state p {
                    font-size: 1rem;
                    color: var(--gray-600);
                    margin: 0;
                    line-height: 1.5;
                }
                
                .course-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }
                
                .course-card {
                    background-color: var(--white);
                    border: 1px solid var(--gray-200);
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .course-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
                }
                
                .course-image {
                    height: 8rem;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    position: relative;
                }
                
                .course-content {
                    padding: 1rem;
                }
                
                .course-category {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--gray-500);
                    margin: 0 0 0.25rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .course-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--gray-900);
                    margin: 0 0 0.75rem 0;
                    line-height: 1.4;
                }
                
                .progress-container {
                    margin-bottom: 0.75rem;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 0.25rem;
                    background-color: var(--gray-200);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background-color: var(--primary-purple);
                    border-radius: 9999px;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    margin-top: 0.25rem;
                }
                
                .continue-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background-color: var(--primary-purple);
                    color: var(--white);
                    border: none;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .continue-btn:hover {
                    background-color: var(--primary-purple-hover);
                }
                
                .bottom-nav {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    border-top: 1px solid var(--gray-200);
                    background-color: var(--white);
                    padding: 0.75rem 1rem 1rem;
                    box-sizing: border-box;
                    position: relative;
                }
                
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--gray-400);
                    text-decoration: none;
                    font-size: 0.75rem;
                    font-weight: 500;
                    letter-spacing: 0.015em;
                    transition: all 0.2s ease;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                }
                
                .nav-item.active {
                    color: var(--primary-purple);
                }
                
                .nav-item:hover {
                    color: var(--gray-600);
                }
                
                .nav-icon {
                    font-size: 1.5rem;
                }
                
                /* Ensure no floating elements */
                .bottom-nav::after {
                    display: none !important;
                }
                
                .bottom-nav * {
                    position: static !important;
                    float: none !important;
                }
                
                /* Responsive design */
                @media (min-width: 640px) {
                    .main-content {
                        padding: 2rem 1.5rem;
                    }
                    
                    .course-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1.5rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    .main-content {
                        padding: 2rem;
                    }
                    
                    .course-list {
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    }
                }
            </style>
            <div class="screen">
                <div class="header">
                    <div class="header-content">
                        <h1>My Learning</h1>
                        <button class="notifications-btn">
                            <span class="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                    <div class="search-container">
                        <span class="material-symbols-outlined search-icon">search</span>
                        <input type="text" class="search-bar" placeholder="Search for courses">
                    </div>
                </div>
                <div class="main-content">
                    <div class="course-list">
                    </div>
                </div>
                <div class="bottom-nav">
                    <a href="#" class="nav-item active">
                        <span class="material-symbols-outlined nav-icon">school</span>
                        Learn
                    </a>
                    <a href="#" class="nav-item">
                        <span class="material-symbols-outlined nav-icon">description</span>
                        Notes
                    </a>
                    <a href="#" class="nav-item">
                        <span class="material-symbols-outlined nav-icon">quiz</span>
                        Quizzes
                    </a>
                    <a href="#" class="nav-item">
                        <span class="material-symbols-outlined nav-icon">person</span>
                        Profile
                    </a>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.profile-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'landing-login' } }));
        });

        this.renderCourses();
    }

    async renderCourses() {
        if (!this.db) return;
        const courses = await getCourses(this.db);
        const courseList = this.shadowRoot.querySelector('.course-list');
        courseList.innerHTML = '';

        if (courses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <h2>No courses available yet</h2>
                    <p>Please contact an admin to add courses.</p>
                </div>
            `;
            return;
        }

        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            courseCard.innerHTML = `
                <div class="course-image" style="background-image: url('${course.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}')"></div>
                <div class="course-content">
                    <p class="course-category">${course.category || 'COURSE'}</p>
                    <h3 class="course-title">${course.title}</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress || Math.floor(Math.random() * 100)}%"></div>
                        </div>
                        <p class="progress-text">${course.progress || Math.floor(Math.random() * 100)}% Complete</p>
                    </div>
                    <button class="continue-btn" data-course-id="${course.id}" data-course-title="${course.title}">
                        Continue Learning
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            `;
            courseList.appendChild(courseCard);
        });

        courseList.addEventListener('click', (e) => {
            if (e.target.classList.contains('continue-btn') || e.target.closest('.continue-btn')) {
                const button = e.target.classList.contains('continue-btn') ? e.target : e.target.closest('.continue-btn');
                const courseId = button.dataset.courseId;
                const courseTitle = button.dataset.courseTitle;
                this.dispatchEvent(new CustomEvent('navigate', { 
                    bubbles: true, 
                    composed: true, 
                    detail: { 
                        screen: 'course-chat', 
                        courseId: parseInt(courseId),
                        courseTitle: courseTitle
                    }
                }));
            }
        });
    }

    refreshCourses() {
        this.renderCourses();
    }
}

customElements.define('my-courses', MyCourses);
