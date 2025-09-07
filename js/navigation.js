// js/navigation.js
class NavigationManager {
    constructor() {
        this.currentScreen = 'landing-login';
        this.screens = {
            'landing-login': 'landing-login',
            'my-courses': 'my-courses', 
            'course-chat': 'course-chat',
            'manage-courses': 'manage-courses',
            'course-editor': 'course-editor',
            'course-quiz': 'course-quiz'
        };
        this.init();
    }

    init() {
        // Listen for navigation events from components
        document.addEventListener('navigate', (e) => {
            const { screen, ...detail } = e.detail;
            this.navigateTo(screen, detail);
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.showScreen(e.state.screen, e.state.detail);
            }
        });

        // Initialize with current URL or default
        this.initializeFromURL();
    }

    initializeFromURL() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // Map URL paths to screens
        if (path.includes('admin') || path.includes('manage')) {
            this.navigateTo('manage-courses');
        } else if (path.includes('course') && hash.includes('chat')) {
            this.navigateTo('course-chat');
        } else if (path.includes('course') && hash.includes('quiz')) {
            this.navigateTo('course-quiz');
        } else if (path.includes('editor')) {
            this.navigateTo('course-editor');
        } else if (path.includes('courses') || path.includes('student')) {
            this.navigateTo('my-courses');
        } else {
            this.navigateTo('landing-login');
        }
    }

    navigateTo(screen, detail = {}) {
        if (!this.screens[screen]) {
            console.error(`Unknown screen: ${screen}`);
            return;
        }

        // Update URL without page reload
        const newState = { screen, detail };
        const newURL = this.getURLForScreen(screen, detail);
        
        history.pushState(newState, '', newURL);
        
        // Show the screen
        this.showScreen(screen, detail);
    }

    getURLForScreen(screen, detail = {}) {
        const base = window.location.origin + window.location.pathname;
        
        switch (screen) {
            case 'landing-login':
                return base;
            case 'my-courses':
                return base + '#courses';
            case 'course-chat':
                return base + `#course/${detail.courseId || 'default'}/chat`;
            case 'course-quiz':
                return base + `#course/${detail.courseId || 'default'}/quiz`;
            case 'manage-courses':
                return base + '#admin/courses';
            case 'course-editor':
                return base + `#admin/editor/${detail.courseId || 'new'}`;
            default:
                return base;
        }
    }

    showScreen(screen, detail = {}) {
        // Hide all screens
        const allScreens = document.querySelectorAll('[data-screen]');
        allScreens.forEach(el => {
            el.style.display = 'none';
        });

        // Show target screen
        const targetScreen = document.querySelector(`[data-screen="${screen}"]`);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            this.currentScreen = screen;
            
            // Dispatch screen change event
            document.dispatchEvent(new CustomEvent('screenChanged', {
                detail: { screen, ...detail }
            }));
            
            // Update page title
            this.updatePageTitle(screen, detail);
        } else {
            console.error(`Screen element not found: ${screen}`);
        }
    }

    updatePageTitle(screen, detail = {}) {
        const titles = {
            'landing-login': 'Aura Learn - Login',
            'my-courses': 'Aura Learn - My Courses',
            'course-chat': `Aura Learn - ${detail.courseTitle || 'Course Chat'}`,
            'course-quiz': `Aura Learn - ${detail.courseTitle || 'Quiz'}`,
            'manage-courses': 'Aura Learn - Manage Courses',
            'course-editor': `Aura Learn - ${detail.courseId ? 'Edit Course' : 'New Course'}`
        };
        
        document.title = titles[screen] || 'Aura Learn';
    }

    // Navigation helper methods
    goToLogin() {
        this.navigateTo('landing-login');
    }

    goToCourses() {
        this.navigateTo('my-courses');
    }

    goToCourseChat(courseId, courseTitle) {
        this.navigateTo('course-chat', { courseId, courseTitle });
    }

    goToCourseQuiz(courseId, courseTitle) {
        this.navigateTo('course-quiz', { courseId, courseTitle });
    }

    goToManageCourses() {
        this.navigateTo('manage-courses');
    }

    goToCourseEditor(courseId = null) {
        this.navigateTo('course-editor', { courseId });
    }

    goBack() {
        history.back();
    }

    // Get current screen info
    getCurrentScreen() {
        return this.currentScreen;
    }

    getCurrentDetail() {
        return history.state?.detail || {};
    }
}

// Create global navigation instance
window.navigation = new NavigationManager();

// Export for module use
export default window.navigation;
