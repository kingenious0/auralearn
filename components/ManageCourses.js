import { getCourses } from '../db.js';

class ManageCourses extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
                
                :root {
                    --primary-50: #f0f6fe;
                    --primary-100: #e0eefe;
                    --primary-200: #c8e0fd;
                    --primary-300: #a3c9fc;
                    --primary-400: #7aacf8;
                    --primary-500: #3d84f5;
                    --primary-600: #2972f3;
                    --primary-700: #1b62f1;
                    --primary-800: #1953d5;
                    --primary-900: #1946af;
                    --primary-950: #112a6c;
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
                    background-color: #101723;
                    color: #ffffff;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow-x: hidden;
                }
                
                .header {
                    width: 100%;
                    padding: 1rem;
                    background-color: #101723;
                    border-bottom: 1px solid #223149;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    backdrop-filter: blur(8px);
                    box-sizing: border-box;
                }
                
                .header-content {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .back-button {
                    color: #ffffff;
                    background: none;
                    border: none;
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    margin-right: 1rem;
                }
                
                .back-button:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                
                .header h1 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    flex: 1;
                    text-align: center;
                    padding-right: 2.5rem;
                }
                
                .main-content {
                    flex: 1;
                    width: 100%;
                    padding: 1rem;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                
                .course-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .course-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem;
                    background-color: #1a2332;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .course-item:hover {
                    background-color: #223149;
                }
                
                .course-image {
                    width: 4rem;
                    height: 4rem;
                    border-radius: 0.375rem;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    flex-shrink: 0;
                }
                
                .course-info {
                    flex: 1;
                }
                
                .course-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0 0 0.25rem 0;
                }
                
                .course-meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 9999px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-draft {
                    background-color: rgba(251, 191, 36, 0.2);
                    color: #fbbf24;
                }
                
                .status-published {
                    background-color: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }
                
                .student-count {
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                
                .menu-button {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                
                .menu-button:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                }
                
                .add-course-fab {
                    position: sticky;
                    bottom: 0;
                    width: 100%;
                    padding: 1rem;
                    background-color: #101723;
                    border-top: 1px solid #223149;
                }
                
                .add-course-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background-color: var(--primary-500);
                    color: #ffffff;
                    border: none;
                    border-radius: 9999px;
                    padding: 0.875rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                
                .add-course-btn:hover {
                    background-color: var(--primary-600);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.2);
                }
                
                .empty-state {
                    text-align: center;
                    padding: 2.5rem 1.25rem;
                    color: #9ca3af;
                }
                
                .empty-state h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    color: #ffffff;
                }
                
                .empty-state p {
                    margin: 0;
                    font-size: 0.875rem;
                }
                
                /* Responsive design */
                @media (min-width: 640px) {
                    .main-content {
                        padding: 1.5rem;
                    }
                    
                    .course-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1rem;
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
                        <button class="back-button">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1>Manage Courses</h1>
                    </div>
                </div>
                <div class="main-content">
                    <div class="course-list"></div>
                </div>
                <div class="add-course-fab">
                    <button class="add-course-btn" id="add-course-btn">
                        <span class="material-symbols-outlined">add</span>
                        <span>Add New Course</span>
                    </button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#add-course-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'course-editor' } }));
        });

        this.shadowRoot.querySelector('.back-button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'landing-login' } }));
        });

        this.renderCourses();
    }

    async renderCourses() {
        if (!this.db) return;
        const courses = await getCourses(this.db);
        const courseList = this.shadowRoot.querySelector('.course-list');
        courseList.innerHTML = '';

        // Sample courses for demo
        const sampleCourses = [
            {
                id: 1,
                title: "Introduction to Data Science",
                description: "Learn the fundamentals of data analysis and machine learning",
                status: "Draft",
                students: 0,
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 2,
                title: "Advanced Machine Learning",
                description: "Deep dive into advanced ML algorithms and techniques",
                status: "Published",
                students: 120,
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 3,
                title: "Deep Learning Fundamentals",
                description: "Understanding neural networks and deep learning architectures",
                status: "Published",
                students: 85,
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 4,
                title: "Natural Language Processing",
                description: "Working with text data and language models",
                status: "Draft",
                students: 0,
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            }
        ];

        if (sampleCourses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <h3>No courses created yet</h3>
                    <p>Click the + button to create your first course.</p>
                </div>
            `;
            return;
        }

        sampleCourses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');
            courseItem.innerHTML = `
                <div class="course-image" style="background-image: url('${course.image}')"></div>
                <div class="course-info">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-meta">
                        <span class="status-badge status-${course.status.toLowerCase()}">${course.status}</span>
                        ${course.students > 0 ? `<span class="student-count">${course.students} students</span>` : ''}
                    </div>
                </div>
                <button class="menu-button">
                    <span class="material-symbols-outlined">more_vert</span>
                </button>
            `;
            courseList.appendChild(courseItem);
        });
    }

    refreshCourses() {
        this.renderCourses();
    }
}
customElements.define('manage-courses', ManageCourses);
