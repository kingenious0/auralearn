import { initDB, getCourses, addCourse, getMessages, addMessage } from './db.js';
import './components/LandingLogin.js';
import './components/MyCourses.js';
import './components/CourseChat.js';
import './components/CourseQuiz.js';
import './components/ManageCourses.js';
import './components/CourseEditor.js';
import './js/navigation.js';
import './js/auth.js';
import './js/courses.js';
import './js/chat.js';
import './js/admin.js';
import './js/notes.js';

document.addEventListener('DOMContentLoaded', async () => {
    const db = await initDB();

    const landingLogin = document.querySelector('landing-login');
    const myCourses = document.querySelector('my-courses');
    const courseChat = document.querySelector('course-chat');
    const courseQuiz = document.querySelector('course-quiz');
    const manageCourses = document.querySelector('manage-courses');
    const courseEditor = document.querySelector('course-editor');

    // Pass the db connection to components that need it
    myCourses.db = db;
    courseChat.db = db;
    courseQuiz.db = db;
    manageCourses.db = db;
    courseEditor.db = db;

    // Add data-screen attributes for navigation
    landingLogin.setAttribute('data-screen', 'landing-login');
    myCourses.setAttribute('data-screen', 'my-courses');
    courseChat.setAttribute('data-screen', 'course-chat');
    courseQuiz.setAttribute('data-screen', 'course-quiz');
    manageCourses.setAttribute('data-screen', 'manage-courses');
    courseEditor.setAttribute('data-screen', 'course-editor');

    // Enhanced screen management with navigation
    function showScreen(screenName, detail = {}) {
        const screens = {
            'landing-login': landingLogin,
            'my-courses': myCourses,
            'course-chat': courseChat,
            'course-quiz': courseQuiz,
            'manage-courses': manageCourses,
            'course-editor': courseEditor
        };

        Object.values(screens).forEach(screen => screen.style.display = 'none');
        const activeScreen = screens[screenName];
        if (activeScreen) {
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
            } else if (screenName === 'course-quiz') {
                activeScreen.courseId = detail.courseId;
                activeScreen.courseTitle = detail.courseTitle;
            } else if (screenName === 'course-editor') {
                activeScreen.courseId = detail.courseId;
            }
        }
    }

    // Initialize navigation
    window.navigation.showScreen = showScreen;
    
    // Listen for screen changes
    document.addEventListener('screenChanged', (e) => {
        const { screen, ...detail } = e.detail;
        showScreen(screen, detail);
    });

    // Initial screen based on auth
    if (auth.isLoggedIn()) {
        if (auth.isAdmin()) {
            showScreen('manage-courses');
        } else {
            showScreen('my-courses');
        }
    } else {
        showScreen('landing-login');
    }

    // Event listeners for other components can be handled within the components themselves
    // For example, ManageCourses will dispatch an event to navigate to CourseEditor
});
