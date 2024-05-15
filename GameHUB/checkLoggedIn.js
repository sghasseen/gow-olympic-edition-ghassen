document.addEventListener('DOMContentLoaded', (event) => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    if (!userLoggedIn || !currentUser) {
      window.location.href = 'profile.html';
    }
  });
  