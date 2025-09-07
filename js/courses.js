// js/courses.js
let courses = [];
let currentCourse = null;

// Load courses from Worker API
async function loadCourses() {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) {
      throw new Error('Failed to load courses');
    }
    const data = await res.json();
    courses = data;
    
    // Store in localStorage for offline access
    localStorage.setItem('auraCourses', JSON.stringify(courses));
    
    // Render if we're on the courses page
    if (typeof renderCourses === 'function') {
      renderCourses();
    }
  } catch (error) {
    console.error('Error loading courses:', error);
    // Fallback to local storage if API fails
    const localCourses = localStorage.getItem('auraCourses');
    if (localCourses) {
      courses = JSON.parse(localCourses);
      if (typeof renderCourses === 'function') {
        renderCourses();
      }
    }
  }
}

// Render courses in the UI (StudyAl style)
function renderCourses() {
  const courseList = document.getElementById('courseList');
  if (!courseList) return;
  
  if (courses.length === 0) {
    courseList.innerHTML = `
      <div class="text-center text-gray-500 dark:text-gray-400 py-8">
        <span class="material-symbols-outlined text-4xl mb-2 block">school</span>
        <p class="text-sm">No courses available</p>
        <p class="text-xs">Contact an admin to add courses</p>
      </div>
    `;
    return;
  }
  
  const html = courses.map(c => `
    <div class="course-card p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer" onclick="selectCourse('${c.slug || c.id}')">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-medium text-gray-900 dark:text-white text-sm">${c.title}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${c.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}">${c.status || 'draft'}</span>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">${c.description || 'No description available'}</p>
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>${c.studentCount || 0} students</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  `).join('');
  
  courseList.innerHTML = html;
}

// Select a course
async function selectCourse(slug) {
  currentCourse = courses.find(c => c.slug === slug);
  if (!currentCourse) return;
  
  // Update UI
  const chatHeader = document.getElementById('chatHeader');
  if (chatHeader) {
    chatHeader.innerHTML = `<h2 class="text-xl font-semibold">${currentCourse.title}</h2>`;
  }
  
  // Store course context for AI
  localStorage.setItem('courseContext', JSON.stringify({
    title: currentCourse.title,
    description: currentCourse.description,
    content: currentCourse.content || ''
  }));
  
  // Reset chat messages
  if (window.messages) {
    window.messages.length = 0;
    renderMessages();
  }
  
  // Dispatch custom event for component communication
  document.dispatchEvent(new CustomEvent('courseSelected', {
    detail: { course: currentCourse }
  }));
}

// Add a new course (admin only)
async function addCourse(courseData) {
  try {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    
    if (!res.ok) {
      throw new Error('Failed to add course');
    }
    
    const newCourse = await res.json();
    courses.push(newCourse);
    renderCourses();
    return newCourse;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
}

// Update course progress (student)
async function updateProgress(courseSlug, progress) {
  try {
    const res = await fetch(`/api/courses/${courseSlug}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress })
    });
    
    if (!res.ok) {
      throw new Error('Failed to update progress');
    }
    
    // Update local data
    const course = courses.find(c => c.slug === courseSlug);
    if (course) {
      course.progress = progress;
      renderCourses();
    }
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

// Functions are now globally available

// Auto-load courses when DOM is ready
document.addEventListener('DOMContentLoaded', loadCourses);
