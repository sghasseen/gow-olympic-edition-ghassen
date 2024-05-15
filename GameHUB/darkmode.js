
document.addEventListener("DOMContentLoaded", function() {
    const darkModeStatus = localStorage.getItem('darkMode');
  
    // Fonction pour appliquer ou retirer le mode sombre
    function applyDarkMode(isEnabled) {
      if (isEnabled) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  
    // Appliquer le mode sombre au chargement si activé
    applyDarkMode(darkModeStatus === 'enabled');
  });
  
  