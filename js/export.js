// js/export.js - Export functionality for AURA Learn
async function exportZip() {
  try {
    // Get notes from localStorage
    const notes = localStorage.getItem('userNotes') || '';
    const courseContext = localStorage.getItem('courseContext');
    const currentCourse = localStorage.getItem('currentCourse');
    
    // Create zip file
    const zip = new JSZip();
    
    // Add notes file
    if (notes) {
      zip.file('notes.txt', notes);
    }
    
    // Add course context if available
    if (courseContext) {
      zip.file('course-context.json', courseContext);
    }
    
    // Add metadata
    const metadata = {
      exportDate: new Date().toISOString(),
      currentCourse: currentCourse,
      userAgent: navigator.userAgent,
      version: '2.0'
    };
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));
    
    // Generate zip file
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-notes-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showExportStatus('Notes exported successfully!', 'success');
    
  } catch (error) {
    console.error('Export error:', error);
    showExportStatus('Export failed. Please try again.', 'error');
  }
}

// Export notes as plain text
function exportNotes() {
  try {
    const notes = localStorage.getItem('userNotes') || '';
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-notes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showExportStatus('Notes exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showExportStatus('Export failed. Please try again.', 'error');
  }
}

// Show export status message
function showExportStatus(message, type) {
  // Create or update status element
  let statusElement = document.getElementById('exportStatus');
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.id = 'exportStatus';
    statusElement.className = 'fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg';
    document.body.appendChild(statusElement);
  }
  
  statusElement.textContent = message;
  statusElement.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (statusElement) {
      statusElement.remove();
    }
  }, 3000);
}

// Import notes from file
function importNotes(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      localStorage.setItem('userNotes', content);
      
      // Update notes area if it exists
      const notesArea = document.getElementById('notesArea');
      if (notesArea) {
        notesArea.value = content;
      }
      
      showExportStatus('Notes imported successfully!', 'success');
    } catch (error) {
      console.error('Import error:', error);
      showExportStatus('Import failed. Invalid file format.', 'error');
    }
  };
  reader.readAsText(file);
}

// Export course data
async function exportCourseData() {
  try {
    const courseContext = localStorage.getItem('courseContext');
    const currentCourse = localStorage.getItem('currentCourse');
    const notes = localStorage.getItem('userNotes');
    
    if (!courseContext && !currentCourse) {
      showExportStatus('No course data to export', 'error');
      return;
    }
    
    const courseData = {
      course: currentCourse,
      context: courseContext ? JSON.parse(courseContext) : null,
      notes: notes,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-course-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showExportStatus('Course data exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showExportStatus('Export failed. Please try again.', 'error');
  }
}

// Export functions for global use
window.exportZip = exportZip;
window.exportNotes = exportNotes;
window.importNotes = importNotes;
window.exportCourseData = exportCourseData;
