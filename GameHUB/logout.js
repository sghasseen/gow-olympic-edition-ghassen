function logout() {
  // Retrieve the current user's email
  const userEmail = localStorage.getItem('currentUser');

  // Define the difficulty levels
  const difficulties = ['facile', 'moyen', 'difficile'];

  // Loop through each difficulty level
  difficulties.forEach(function(difficulty) {
      let scoreKey = `${userEmail}_${difficulty}_high_score`; // Construct the key for retrieving the high score

      // Remove the score from the local storage
      localStorage.removeItem(scoreKey);
  });

  localStorage.removeItem('userLoggedIn'); // Remove the user login indicator
  localStorage.removeItem('currentUser'); // This is to reset the success page on logout

  window.location.href = 'profile.html'; // Redirect to the login page
}