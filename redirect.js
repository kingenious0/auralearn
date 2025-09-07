// redirect.js - Simple redirect logic for the new HTML-based system
document.addEventListener('DOMContentLoaded', () => {
  // Only run redirect logic if we're on the main index page
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const role = localStorage.getItem('auraRole');
    const isLoggedIn = !!localStorage.getItem('auraUser');
    
    if (isLoggedIn) {
      if (role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'courses.html';
      }
    }
  }
});
