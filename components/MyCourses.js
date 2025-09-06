import { getCourses } from '../db.js';

class MyCourses extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .screen {
                    padding: 20px;
                    box-sizing: border-box;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .course-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .course-item {
                    background-color: var(--container-background);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .course-item-info h3 {
                    margin: 0;
                    font-size: 18px;
                }
                .course-item-info p {
                    margin: 5px 0 0;
                    font-size: 14px;
                    color: var(--secondary-text-color);
                }
                .start-chat {
                    color: var(--accent-color);
                    text-decoration: none;
                    font-weight: 500;
                    cursor: pointer;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <h2>My Courses</h2>
                    <a href="#" class="profile-link">Profile</a>
                </div>
                <div class="course-list">
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
            courseList.innerHTML = '<p>No courses available yet. Please contact an admin.</p>';
            return;
        }

        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');
            courseItem.innerHTML = `
                <div class="course-item-info">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <a class="start-chat" data-course-id="${course.id}" data-course-title="${course.title}">Start Chat &rarr;</a>
            `;
            courseList.appendChild(courseItem);
        });

        courseList.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-chat')) {
                const courseId = e.target.dataset.courseId;
                const courseTitle = e.target.dataset.courseTitle;
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
