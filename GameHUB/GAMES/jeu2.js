window.onload = function() {
    // Create two scenes: one for the player and one for the computer
    var playerCanvas = document.getElementById("playerCanvas");
    var computerCanvas = document.getElementById("computerCanvas");
    var playerEngine = new BABYLON.Engine(playerCanvas, true);
    var computerEngine = new BABYLON.Engine(computerCanvas, true);
    var playerScene = createScene(playerEngine, playerCanvas);
    var computerScene = createScene(computerEngine, computerCanvas);

    // Run the render loop for both scenes
    playerEngine.runRenderLoop(function() {
        playerScene.render();
    });
    computerEngine.runRenderLoop(function() {
        computerScene.render();
    });
    

    // Resize the engines when the window is resized
    window.addEventListener("resize", function() {
        playerEngine.resize();
        computerEngine.resize();
    });

    // Event listeners for the player's choices
    var choiceButtons = document.querySelectorAll('#playerButtons button');
    choiceButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            handlePlayerChoice(button.id);
            // Disable the choice buttons
            choiceButtons.forEach(function(button) {
                button.disabled = true;
            });
        });
    });

    // Event listener for the restart button
document.getElementById('restart').addEventListener('click', function() {
    // Enable the choice buttons
    choiceButtons.forEach(function(button) {
        button.disabled = false;
    });
    // Clear the scenes
    playerScene.meshes.forEach(function(mesh) {
        mesh.dispose();
    });
    computerScene.meshes.forEach(function(mesh) {
        mesh.dispose();
    });
    // Remove any existing announcement
    var announcement = document.getElementById('announcement');
    if (announcement) {
        document.body.removeChild(announcement);
    }
    // Hide the restart button
    this.style.display = 'none';
});

    // Function to handle player's choice
    function handlePlayerChoice(choice) {
        // Load the player's choice in the player's scene
        loadModel(choice, playerScene);

        // Generate a random choice for the computer and load it in the computer's scene
        var choices = ['rock', 'paper', 'scissors'];
        var computerChoice = choices[Math.floor(Math.random() * choices.length)];
        loadModel(computerChoice, computerScene);

        // Determine the winner and display an announcement
        var winner = determineWinner(choice, computerChoice);
        displayAnnouncement(winner);
    }
    

    // Function to load a model in a scene
function loadModel(choice, scene) {
    // Load the chosen model
    switch (choice) {
        case 'rock':
            BABYLON.SceneLoader.ImportMesh("", "", "rock.glb", scene, function (meshes) {
                meshes.forEach(function(mesh) {
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Adjust scale as needed
                });
            });
            break;
        case 'paper':
            BABYLON.SceneLoader.ImportMesh("", "", "paper.glb", scene, function (meshes) {
                meshes.forEach(function(mesh) {
                    mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3); // Adjust scale as needed
                });
            });
            break;
        case 'scissors':
            BABYLON.SceneLoader.ImportMesh("", "", "scissors.glb", scene, function (meshes) {
                meshes.forEach(function(mesh) {
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Adjust scale as needed
                });
            });
            break;
    }
}

    // Function to determine the winner
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }

    // Function to display an announcement
function displayAnnouncement(winner) {
    var announcement = document.createElement('div');
    announcement.id = 'announcement';
    if (winner === 'tie') {
        announcement.textContent = 'TIE!';
    } else if (winner === 'player') {
        announcement.textContent = 'PLAYER 1 HAS WON!';
    } else {
        announcement.textContent = 'COMPUTER HAS WON!';
    }
    document.body.appendChild(announcement);
    // Show the restart button
    document.getElementById('restart').style.display = 'block';
}
};

// Function to create a scene
function createScene(engine, canvas) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
    return scene;
}