// js/admin.js
let uploadProgress = 0;
let isUploading = false;

// Initialize admin functionality
function initAdmin() {
  // This function is now handled directly in admin.html
  // Keeping for compatibility with existing code
  console.log('Admin functionality initialized');
}

// Handle file upload
async function handleUpload() {
  const fileInput = document.getElementById('pdfFile');
  const titleInput = document.getElementById('courseTitle');
  const uploadStatus = document.getElementById('uploadStatus');
  
  if (!fileInput || !titleInput) return;
  
  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  
  if (!file || !title) {
    showStatus('Please select a PDF file and enter a course title.', 'error');
    return;
  }
  
  if (file.type !== 'application/pdf') {
    showStatus('Please select a valid PDF file.', 'error');
    return;
  }
  
  if (isUploading) return;
  
  isUploading = true;
  updateUploadButton(true);
  
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);
    
    // Add additional course details if available
    const description = document.getElementById('courseDescription')?.value?.trim();
    const category = document.getElementById('courseCategory')?.value?.trim();
    
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    
    showStatus('Uploading and processing PDF...', 'info');
    
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (data.success) {
      showStatus('Course created successfully! Refreshing...', 'success');
      
      // Clear form
      fileInput.value = '';
      titleInput.value = '';
      if (document.getElementById('courseDescription')) {
        document.getElementById('courseDescription').value = '';
      }
      if (document.getElementById('courseCategory')) {
        document.getElementById('courseCategory').value = '';
      }
      
      // Refresh course list after a short delay
      setTimeout(() => {
        if (typeof loadCourses === 'function') {
          loadCourses();
        } else {
          location.reload();
        }
      }, 2000);
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showStatus(`Upload failed: ${error.message}`, 'error');
  } finally {
    isUploading = false;
    updateUploadButton(false);
  }
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
}

// Handle file drop
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      const fileInput = document.getElementById('pdfFile');
      if (fileInput) {
        fileInput.files = files;
        handleFileSelect();
      }
    } else {
      showStatus('Please drop a valid PDF file.', 'error');
    }
  }
}

// Handle file selection
function handleFileSelect() {
  const fileInput = document.getElementById('pdfFile');
  const fileName = document.getElementById('fileName');
  
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (fileName) {
      fileName.textContent = file.name;
      fileName.classList.remove('hidden');
    }
    validateForm();
  }
}

// Validate form
function validateForm() {
  const fileInput = document.getElementById('pdfFile');
  const titleInput = document.getElementById('courseTitle');
  const uploadBtn = document.getElementById('uploadBtn');
  
  if (!fileInput || !titleInput || !uploadBtn) return;
  
  const hasFile = fileInput.files.length > 0;
  const hasTitle = titleInput.value.trim().length > 0;
  
  uploadBtn.disabled = !hasFile || !hasTitle || isUploading;
}

// Show status message
function showStatus(message, type = 'info') {
  const uploadStatus = document.getElementById('uploadStatus');
  if (!uploadStatus) return;
  
  uploadStatus.textContent = message;
  uploadStatus.className = `text-sm ${getStatusClass(type)}`;
  
  // Auto-hide after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      uploadStatus.textContent = '';
      uploadStatus.className = 'text-sm';
    }, 5000);
  }
}

// Get status CSS class
function getStatusClass(type) {
  switch (type) {
    case 'success': return 'text-green-600';
    case 'error': return 'text-red-600';
    case 'info': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

// Update upload button state
function updateUploadButton(uploading) {
  const uploadBtn = document.getElementById('uploadBtn');
  if (!uploadBtn) return;
  
  if (uploading) {
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = `
      <span class="material-symbols-outlined animate-spin mr-2">refresh</span>
      Uploading...
    `;
  } else {
    uploadBtn.disabled = false;
    uploadBtn.innerHTML = `
      <span class="material-symbols-outlined mr-2">upload</span>
      Upload Course
    `;
  }
}

// Delete course (admin only)
async function deleteCourse(courseSlug) {
  if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
    return;
  }
  
  try {
    const res = await fetch(`/api/admin/courses/${courseSlug}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete course');
    }
    
    showStatus('Course deleted successfully!', 'success');
    
    // Refresh course list
    setTimeout(() => {
      if (typeof loadCourses === 'function') {
        loadCourses();
      } else {
        location.reload();
      }
    }, 1000);
  } catch (error) {
    console.error('Delete error:', error);
    showStatus(`Delete failed: ${error.message}`, 'error');
  }
}

// Export functions
export {
  initAdmin,
  handleUpload,
  deleteCourse,
  showStatus
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAdmin);
