export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("AuraLearnDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('courses')) {
                const courseStore = db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
                courseStore.createIndex('title', 'title', { unique: false });
            }
            if (!db.objectStoreNames.contains('messages')) {
                const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                messageStore.createIndex('courseId', 'courseId', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error opening database');
        };
    });
}

export function addCourse(db, course) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['courses'], 'readwrite');
        const store = transaction.objectStore('courses');
        const request = store.add(course);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Error adding course');
        };
    });
}

export function getCourses(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['courses'], 'readonly');
        const store = transaction.objectStore('courses');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Error getting courses');
        };
    });
}

export function getCourse(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['courses'], 'readonly');
        const store = transaction.objectStore('courses');
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Error getting course');
        };
    });
}

export function addMessage(db, message) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['messages'], 'readwrite');
        const store = transaction.objectStore('messages');
        const request = store.add(message);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Error adding message');
        };
    });
}

export function getMessages(db, courseId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');
        const index = store.index('courseId');
        const request = index.getAll(courseId);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Error getting messages');
        };
    });
}
