
  document.addEventListener('DOMContentLoaded', () => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const profileLink = document.querySelector('.nav-item a[href="profile.html"]');
    const navbar = document.querySelector('.navbar');
  
    if (userLoggedIn) {
      profileLink.setAttribute('href', 'profile_connected.html');
      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Déconnexion';
      logoutButton.setAttribute('onclick', 'logout()');
      navbar.appendChild(logoutButton);
    } else {
      profileLink.setAttribute('href', 'profile.html');
    }
  });
