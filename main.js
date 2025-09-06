import { initDB, getCourses, addCourse, getMessages, addMessage } from './db.js';
import './components/LandingLogin.js';
import './components/MyCourses.js';
import './components/CourseChat.js';
import './components/ManageCourses.js';
import './components/CourseEditor.js';

document.addEventListener('DOMContentLoaded', async () => {
    const db = await initDB();

    const landingLogin = document.querySelector('landing-login');
    const myCourses = document.querySelector('my-courses');
    const courseChat = document.querySelector('course-chat');
    const manageCourses = document.querySelector('manage-courses');
    const courseEditor = document.querySelector('course-editor');

    // Pass the db connection to components that need it
    myCourses.db = db;
    courseChat.db = db;
    manageCourses.db = db;
    courseEditor.db = db;

    const screens = {
        'landing-login': landingLogin,
        'my-courses': myCourses,
        'course-chat': courseChat,
        'manage-courses': manageCourses,
        'course-editor': courseEditor
    };

    function showScreen(screenName, detail = {}) {
        Object.values(screens).forEach(screen => screen.style.display = 'none');
        const activeScreen = screens[screenName];
        activeScreen.style.display = 'flex';

        // Special handling for navigation
        if (screenName === 'manage-courses') {
            if (activeScreen.refreshCourses) {
                activeScreen.refreshCourses();
            }
        } else if (screenName === 'my-courses') {
            if (activeScreen.refreshCourses) {
                activeScreen.refreshCourses();
            }
        } else if (screenName === 'course-chat') {
            activeScreen.courseId = detail.courseId;
            activeScreen.courseTitle = detail.courseTitle;
        }
    }

    // Initial screen
    showScreen('landing-login');

    // Navigation events
    document.body.addEventListener('navigate', (e) => {
        const { screen, ...detail } = e.detail;
        showScreen(screen, detail);
    });

    // Event listeners for landing-login
    landingLogin.shadowRoot.getElementById('student-signup').addEventListener('click', () => {
        showScreen('my-courses');
    });

    landingLogin.shadowRoot.getElementById('admin-login').addEventListener('click', () => {
        showScreen('manage-courses');
    });

    // Event listeners for other components can be handled within the components themselves
    // For example, ManageCourses will dispatch an event to navigate to CourseEditor
});
