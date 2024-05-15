var playerRed = "R";
var playerYellow = "Y";
var difficulty = 'facile'; // Difficulté par défaut


var currPlayer = playerRed;
var scoreplayer1 = 0;
var scoreplayer2 = 0;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; // keeps track of which row each column is at.

var startTime, elapsedTime = 0, timerInterval;

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Démarre le timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerText = timeToString(elapsedTime);
    }, 10);
}

//Arrête le timer
function stopTimer() {
    clearInterval(timerInterval);
}


function setGame() {
    document.getElementById("board").style.display = 'flex'; // Hide board initially
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    document.getElementById("board").innerHTML = ''; // Clear previous board
    startTimer();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").appendChild(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver || currPlayer == playerYellow) return; // Empêche l'IA de jouer si c'est le tour du joueur ou si la partie est terminée

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if (r < 0) return;

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.classList.add(currPlayer == playerRed ? "red-piece" : "yellow-piece" );

    currPlayer = currPlayer == playerRed ? playerYellow : playerRed; // Toggle between Red and Yellow
    r -= 1;
    currColumns[c] = r;

    checkWinner();

    // Après le coup du joueur, vérifiez si c'est le tour de l'IA
    if (!gameOver && currPlayer == playerYellow) { // Supposons que l'IA joue en tant que joueur jaune
        setTimeout(function() {
            aiMove(); // Faites bouger l'IA avec un léger délai pour la fluidité du jeu
        }, 200); // Délai en millisecondes
    }
}


function checkWinner() {
    // horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++){
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
        }
   }

   // vertical
   for (let c = 0; c < columns; c++) {
       for (let r = 0; r < rows - 3; r++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }

   // anti diagonal
   for (let r = 0; r < rows - 3; r++) {
       for (let c = 0; c < columns - 3; c++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }

   // diagonal
   for (let r = 3; r < rows; r++) {
       for (let c = 0; c < columns - 3; c++) {
           if (board[r][c] != ' ') {
               if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                   setWinner(r, c);
                   return;
               }
           }
       }
   }
}



function restartGame() {
    gameOver = false;
    document.getElementById("winner").innerText = '';
    elapsedTime = 0; // Réinitialise le timer
    if(timerInterval) {
        stopTimer(); // Assurez-vous d'arrêter le timer s'il est toujours en cours
    }
    location.reload();
    
}


// Function to update and store the scores in localStorage
function updateScores(score) {
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) return; // No logged-in user, do nothing

    const scoreKey = `${userEmail}_${difficulty}_high_score`;
    const currentScore = localStorage.getItem(scoreKey);

    if (!currentScore || score < currentScore) {
        localStorage.setItem(scoreKey, score);
        alert(`New high score for ${difficulty} level: ${timeToString(score)}`);
    }
}

// Function to check and update winner
function setWinner(r, c) {
    stopTimer();
    let winner = document.getElementById("winner");
    let winnerPlayer = board[r][c] == playerRed ? "Red" : "Yellow";
    winner.innerText = `${winnerPlayer} Wins`;
    gameOver = true;

    // Calculate score based on elapsed time
    let score = elapsedTime; // Score is the elapsed time in milliseconds

    // Update scores if it's a new high score
    updateScores(score);
}


function chooseColumnIA(difficulty) {
    switch(difficulty) {
        case 'facile':
            return chooseRandomColumn();
        case 'moyen':
            let mediumMove = findMoveMedium();
            if (mediumMove !== null) {
                return mediumMove;
            }
            return chooseRandomColumn();
        case 'difficile':
            let hardMove = findMoveHard();
            if (hardMove !== null) {
                return hardMove;
            }
            return chooseHardColumn();
        default:
            return chooseRandomColumn();
    }
}



function aiMove() {
    let column = chooseColumnIA(difficulty); // Obtenez la colonne choisie par l'IA
    if(column !== null) { // Vérifiez si une colonne valide a été choisie
        simulateClick(column); // Simulez le clic dans la colonne choisie par l'IA
    }
}


function chooseRandomColumn() {
    let validColumns = [];
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            validColumns.push(c);
        }
    }
    if (validColumns.length === 0) return null; // Si aucune colonne valide, retourne null
    return validColumns[Math.floor(Math.random() * validColumns.length)];
}

function simulateClick(column) {
    if (column == null || currColumns[column] < 0) return; // Si la colonne est pleine ou invalide, ne faites rien

    let r = currColumns[column];
    board[r][column] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + column.toString());
    tile.classList.add(currPlayer === playerRed ? "red-piece" : "yellow-piece");

    currColumns[column] -= 1;
    checkWinner();
    currPlayer = currPlayer === playerRed ? playerYellow : playerRed; // Changez de joueur après le tour de l'IA
}

function chooseMediumColumn() {
    let move = findMoveMedium();
    if (move !== null) {
        return move;
    }
    return chooseRandomColumn(); // Choix par défaut si aucune opportunité/blockage n'est trouvé
}


function chooseHardColumn() {
    let move = findMoveHard();
    if (move !== null) {
        return move;
    }
    return chooseRandomColumn(); // Choix par défaut si aucune opportunité/blockage n'est trouvé
}

function findMoveMedium() {
    let opponentPlayer = currPlayer === playerRed ? playerYellow : playerRed; // Déterminez le jeton de l'opposant.

    for (let c = 0; c < columns; c++) {
        // Trouvez la première rangée vide depuis le bas dans cette colonne
        let r;
        for (r = rows - 1; r >= 0; r--) {
            if (board[r][c] === ' ') {
                break; // r est maintenant l'indice de la première rangée vide depuis le bas
            }
        }

        if (r >= 0) { // Vérifiez si une rangée vide a été trouvée
            board[r][c] = opponentPlayer; // Placez temporairement un jeton pour le joueur humain
            if (checkWinnerMedium(opponentPlayer)) { // Vérifie si cela conduirait à une victoire pour le joueur
                board[r][c] = ' '; // Retirez le jeton simulé
                return c; // Retournez cette colonne pour bloquer le coup gagnant
            }
            board[r][c] = ' '; // Retirez le jeton simulé si ce n'est pas un coup gagnant
        }
    }

    return null; // Aucun coup immédiatement gagnant trouvé pour bloquer
}

function findMoveHard() {
    let opponentPlayer = currPlayer === playerRed ? playerYellow : playerRed; // Déterminez le jeton de l'opposant.

    for (let c = 0; c < columns; c++) {
        // Trouvez la première rangée vide depuis le bas dans cette colonne
        let r;
        for (r = rows - 1; r >= 0; r--) {
            if (board[r][c] === ' ') {
                break; // r est maintenant l'indice de la première rangée vide depuis le bas
            }
        }

        if (r >= 0) { // Vérifiez si une rangée vide a été trouvée
            board[r][c] = opponentPlayer; // Placez temporairement un jeton pour le joueur humain
            if (checkWinnerHard(opponentPlayer)) { // Vérifie si cela conduirait à une victoire pour le joueur
                board[r][c] = ' '; // Retirez le jeton simulé
                return c; // Retournez cette colonne pour bloquer le coup gagnant
            }
            board[r][c] = ' '; // Retirez le jeton simulé si ce n'est pas un coup gagnant
        }
    }

    return null; // Aucun coup immédiatement gagnant trouvé pour bloquer
}

function checkWinnerMedium(player) {
    // Horizontal Check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
                return true;
            }
        }
    }

    // Vertical Check
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
                return true;
            }
        }
    }


    return false; // Aucune condition gagnante trouvée
}

function checkWinnerHard(player) {
    // Horizontal Check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++){
            if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
                return true;
            }
        }
    }

    // Vertical Check
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
                return true;
            }
        }
    }

    // Diagonal 1 Check
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) {
                return true;
            }
        }
    }

    // Diagonal 2 Check
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
                return true;
            }
        }
    }

    return false; // Aucune condition gagnante trouvée
}
function logout() {
    // Effacer les données de session
    localStorage.removeItem('userLoggedIn');
    // Rediriger vers la page de connexion
    window.location.href = 'index.html';
}


window.onload = function() {
    document.getElementById("timer").innerText = "00:00:00";
    document.querySelectorAll('.colorChoice').forEach(button => {
        button.addEventListener('click', function() {
            currPlayer = this.getAttribute('data-color') == "red" ? playerRed : playerYellow;
            document.getElementById('colorSelection').style.display = 'none';
            document.getElementById('difficultySelection').style.display = 'flex';
        });
    });

    document.querySelectorAll('.difficultyChoice').forEach(button => {
        button.addEventListener('click', function() {
            difficulty = this.getAttribute('data-difficulty');
            document.getElementById('difficultySelection').style.display = 'none';
            var boardElement = document.getElementById('board');
            boardElement.style.display = 'flex';
            setGame();
            if(currPlayer == playerYellow) aiMove(); // Si l'IA doit commencer
        });
    });

    document.getElementById("restartButton").addEventListener("click", restartGame);
};
