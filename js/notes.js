// js/notes.js
let db = null;
let currentCourseId = null;

// Initialize Notes (using localStorage fallback)
async function initNotes() {
  try {
    // Use localStorage for simplicity
    console.log('Notes system initialized with localStorage');
    
    // Load existing notes
    loadNotes();
  } catch (error) {
    console.error('Failed to initialize notes:', error);
  }
}

// Fallback to localStorage if IndexedDB fails
function initLocalStorageFallback() {
  console.log('Using localStorage fallback for notes');
  loadNotesFromLocalStorage();
}

// Load notes for current course
async function loadNotes() {
  if (!currentCourseId) return;
  
  try {
    const notes = await getNotesForCourse(currentCourseId);
    renderNotes(notes);
  } catch (error) {
    console.error('Failed to load notes:', error);
    loadNotesFromLocalStorage();
  }
}

// Get notes for a specific course
async function getNotesForCourse(courseId) {
  if (!db) {
    return getNotesFromLocalStorage(courseId);
  }
  
  const transaction = db.transaction(['notes'], 'readonly');
  const store = transaction.objectStore('notes');
  const index = store.index('courseId');
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(courseId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save note
async function saveNote(content, courseId = currentCourseId) {
  if (!content.trim() || !courseId) return;
  
  const note = {
    courseId: courseId,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    type: 'text'
  };
  
  try {
    if (db) {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      await store.add(note);
    } else {
      saveNoteToLocalStorage(note);
    }
    
    loadNotes();
    showStatus('Note saved successfully!', 'success');
  } catch (error) {
    console.error('Failed to save note:', error);
    showStatus('Failed to save note', 'error');
  }
}

// Delete note
async function deleteNote(noteId) {
  try {
    if (db) {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      await store.delete(noteId);
    } else {
      deleteNoteFromLocalStorage(noteId);
    }
    
    loadNotes();
    showStatus('Note deleted successfully!', 'success');
  } catch (error) {
    console.error('Failed to delete note:', error);
    showStatus('Failed to delete note', 'error');
  }
}

// Render notes in UI
function renderNotes(notes) {
  const notesArea = document.getElementById('notesArea');
  const notesList = document.getElementById('notesList');
  
  if (notesArea) {
    // Auto-save functionality
    notesArea.addEventListener('input', debounce(() => {
      const content = notesArea.value;
      localStorage.setItem('userNotes', content);
      if (currentCourseId) {
        saveNote(content, currentCourseId);
      }
    }, 1000));
    
    // Load existing content
    const savedContent = localStorage.getItem('userNotes') || '';
    notesArea.value = savedContent;
  }
  
  if (notesList) {
    const html = notes.map(note => `
      <div class="note-item bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-3">
        <div class="note-content text-sm text-gray-700 dark:text-gray-300 mb-2">
          ${note.content}
        </div>
        <div class="note-meta flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>${formatDate(note.timestamp)}</span>
          <button onclick="deleteNote(${note.id})" class="text-red-500 hover:text-red-700">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    `).join('');
    
    notesList.innerHTML = html || '<p class="text-gray-500 text-center py-4">No notes yet</p>';
  }
}

// Set current course for notes
function setCurrentCourse(courseId) {
  currentCourseId = courseId;
  loadNotes();
}

// Export notes as ZIP
async function exportNotes() {
  try {
    const notes = await getNotesForCourse(currentCourseId);
    const flashcards = await getFlashcardsForCourse(currentCourseId);
    
    const exportData = {
      courseId: currentCourseId,
      timestamp: new Date().toISOString(),
      notes: notes,
      flashcards: flashcards
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-notes-${currentCourseId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Notes exported successfully!', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showStatus('Export failed', 'error');
  }
}

// Import notes from file
async function importNotes(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (data.notes) {
      for (const note of data.notes) {
        await saveNote(note.content, currentCourseId);
      }
    }
    
    showStatus('Notes imported successfully!', 'success');
    loadNotes();
  } catch (error) {
    console.error('Import failed:', error);
    showStatus('Import failed: Invalid file format', 'error');
  }
}

// LocalStorage fallback functions
function loadNotesFromLocalStorage() {
  const notes = getNotesFromLocalStorage(currentCourseId);
  renderNotes(notes);
}

function getNotesFromLocalStorage(courseId) {
  const key = `notes_${courseId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveNoteToLocalStorage(note) {
  const key = `notes_${note.courseId}`;
  const notes = getNotesFromLocalStorage(note.courseId);
  notes.push(note);
  localStorage.setItem(key, JSON.stringify(notes));
}

function deleteNoteFromLocalStorage(noteId) {
  const key = `notes_${currentCourseId}`;
  const notes = getNotesFromLocalStorage(currentCourseId);
  const filteredNotes = notes.filter(note => note.id !== noteId);
  localStorage.setItem(key, JSON.stringify(filteredNotes));
}

// Utility functions
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('notesStatus');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = `text-sm ${getStatusClass(type)}`;
  
  setTimeout(() => {
    statusElement.textContent = '';
    statusElement.className = 'text-sm';
  }, 3000);
}

function getStatusClass(type) {
  switch (type) {
    case 'success': return 'text-green-600';
    case 'error': return 'text-red-600';
    case 'info': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

// Functions are now globally available

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initNotes);
