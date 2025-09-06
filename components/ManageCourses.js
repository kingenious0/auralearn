import { getCourses } from '../db.js';

class ManageCourses extends HTMLElement {
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
                    align-items: center;
                    margin-bottom: 20px;
                }
                .header a {
                    color: var(--primary-text-color);
                    text-decoration: none;
                    margin-right: 20px;
                }
                .course-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
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
                .add-course {
                    background-color: var(--accent-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 15px;
                    width: 100%;
                    cursor: pointer;
                    font-size: 16px;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <a href="#" class="back-button">&larr;</a>
                    <h2>Manage Courses</h2>
                </div>
                <div class="course-list"></div>
                <button class="add-course">+ Add New Course</button>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.add-course').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'course-editor' } }));
        });

        this.shadowRoot.querySelector('.back-button').addEventListener('click', (e) => {
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
            courseList.innerHTML = '<p>No courses created yet.</p>';
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
            `;
            courseList.appendChild(courseItem);
        });
    }

    refreshCourses() {
        this.renderCourses();
    }
}
customElements.define('manage-courses', ManageCourses);
