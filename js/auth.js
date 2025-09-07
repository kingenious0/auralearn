// js/auth.js
const role = localStorage.getItem('auraRole') || 'student';
const isLoggedIn = !!localStorage.getItem('auraUser');

// Authentication utilities
const auth = {
  getRole: () => localStorage.getItem('auraRole') || 'student',
  getUser: () => localStorage.getItem('auraUser') ? JSON.parse(localStorage.getItem('auraUser')) : null,
  isLoggedIn: () => !!localStorage.getItem('auraUser'),
  isAdmin: () => localStorage.getItem('auraRole') === 'admin',
  
  login: (userData, userRole = 'student') => {
    localStorage.setItem('auraUser', JSON.stringify(userData));
    localStorage.setItem('auraRole', userRole);
    return true;
  },
  
  logout: () => {
    localStorage.removeItem('auraUser');
    localStorage.removeItem('auraRole');
    localStorage.removeItem('currentCourse');
    return true;
  },
  
  requireAuth: (requiredRole = 'student') => {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    
    if (requiredRole === 'admin' && !auth.isAdmin()) {
      window.location.href = 'index.html';
      return false;
    }
    
    return true;
  },

  // Handle login with proper redirects
  handleLogin: (role) => {
    console.log('handleLogin called with role:', role);
    
    const userData = {
      name: role === 'admin' ? 'Admin User' : 'Student User',
      email: role === 'admin' ? 'admin@example.com' : 'student@example.com',
      role: role
    };
    
    localStorage.setItem('auraRole', role);
    localStorage.setItem('auraUser', JSON.stringify(userData));
    
    console.log('User data saved:', userData);
    console.log('Redirecting to:', role === 'admin' ? 'admin.html' : 'courses.html');
    
    if (role === 'admin') {
      location.href = 'admin.html';
    } else {
      location.href = 'courses.html'; // ← Send students to courses first!
    }
  }
};

// Make auth globally available
window.auth = auth;

// Global logout function
function logout() {
  console.log('Logout clicked');
  auth.logout();
  console.log('Redirecting to index.html');
  location.href = 'index.html';
}

// Make logout globally available
window.logout = logout;

// Auto-redirect based on role
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  // Admin protection
  if (currentPath.includes('admin') || currentPath.includes('manage')) {
    if (!auth.isAdmin()) {
      window.location.href = 'index.html';
      return;
    }
  }
  
  // Student protection
  if (currentPath.includes('student') || currentPath.includes('courses')) {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }
  }
});
