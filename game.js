// Global variables
var team = [];
var draft = [];
var benched = [];
var wins = 0;
var losses = 0;
var teamMoney = 0;
var names = [];

// Load the names from the JSON file
fetch('/names.json')
    .then(response => response.json())
    .then(data => names = data.names);

// Function to get a random name
function getRandomName() {
    var index = Math.floor(Math.random() * names.length);
    return names[index];
}

// Create a team
async function createTeam() {
    // Load the names from the JSON file
    await fetch('/names.json')
        .then(response => response.json())
        .then(data => names = data.names);

    // Capture team name
    var teamName = prompt("Please enter your team name:", "My Team");
    if (teamName != null) {
        document.getElementById("team-name").innerHTML = teamName;
    }

    // Display team stats
    displayTeamStats();

    // Generate 5 players with random accuracy between 1 and 40
    draft = [];
    for (var i = 0; i < 5; i++) {
        var player = {
            name: getRandomName(), // Use the getRandomName function
            accuracy: Math.floor(Math.random() * 50) + 1 // Random accuracy between 1 and 50
        };
        draft.push(player);
    }

    // Display the players for the draft
    displayDraft();
}

// Display team stats
function displayTeamStats() {
    var teamStats = document.getElementById("team-stats");
    teamStats.innerHTML = "Wins: " + wins + " | Losses: " + losses + " | Money: $" + teamMoney;
}

// Display the players for the draft
function displayDraft() {
    var draftSection = document.getElementById("match-section");
    draftSection.innerHTML = "Draft:<br>";
    draft.forEach(function(player, index) {
        draftSection.innerHTML += "<button class='btn btn-primary' onclick='selectPlayer(" + index + ")'>" + player.name + " (Accuracy: " + player.accuracy + "%)</button><br>";
    });
}

// Select a player from the draft
function selectPlayer(index) {
    // Add the selected player to the team
    team.push(draft[index]);

    // Remove the selected player from the draft
    draft.splice(index, 1);

    // Update the draft display
    displayDraft();

    // Update the roster display
    displayRoster();

    // If the team has 3 players, navigate to the manager dashboard
    if (team.length === 3) {
        var managerDashboard = document.getElementById("match-section");
        managerDashboard.innerHTML = "<h3>Manager Dashboard</h3>";
        managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='playMatch()'>Play Match</button><br>";
        managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='editTeam()'>Edit Team</button><br>";
    }
}

// Display the player roster
function displayRoster() {
    var rosterSection = document.getElementById("roster-section");
    rosterSection.innerHTML = "Roster:<br>";
    team.forEach(function(player) {
        rosterSection.innerHTML += player.name + " (Accuracy: " + player.accuracy + "%)<br>";
    });

    // Display benched players if there are any
    if (benched.length > 0) {
        rosterSection.innerHTML += "<br>Benched:<br>";
        benched.forEach(function(player, index) {
            rosterSection.innerHTML += player.name + " (Accuracy: " + player.accuracy + "%) ";
            rosterSection.innerHTML += "<button class='btn btn-primary' onclick='unbenchPlayer(" + index + ")'>Unbench</button><br>";
        });
    }

    // Enable or disable the 'Play Match' button based on the number of active players
    var playMatchButton = document.getElementById("play-match-button");
    if (team.length >= 3) {
        playMatchButton.disabled = false;
    } else {
        playMatchButton.disabled = true;
    }
}

// Play a match
function playMatch() {
    // Check if the active team has at least 3 players
    if (team.length < 3) {
        alert("You need at least 3 active players to start a match.");
        return;
    }

    // Calculate the average accuracy of the active team
    var totalAccuracy = 0;
    for (var i = 0; i < team.length; i++) {
        totalAccuracy += team[i].accuracy;
    }
    var averageAccuracy = totalAccuracy / team.length;

    // Generate a random accuracy for the other team
    var otherTeamAccuracy = Math.floor(Math.random() * 100) + 1; // Random accuracy between 1 and 100

    // Compare the accuracies to determine the winner
    var result;
    if (averageAccuracy > otherTeamAccuracy) {
        result = "Your team won!";
        wins++;
        teamMoney += 150;
    } else if (averageAccuracy < otherTeamAccuracy) {
        result = "The other team won!";
        losses++;
    } else {
        result = "It's a draw!";
    }

    // Display the result
    alert(result);

    // Update team stats
    displayTeamStats();


    // 4. Reset the game
    resetGame();
}

// Reset the game
function resetGame() {
    // Reset all game variables
    team = [];
    draft = [];
    benched = [];
    wins = 0;
    losses = 0;
    teamMoney = 0;
    names = [];

    // Call createTeam to start a new game
    createTeam();
}

// Edit the team
function editTeam() {
    var managerDashboard = document.getElementById("match-section");
    managerDashboard.innerHTML = "<h3>Edit Team</h3>";
    managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='goBack()'>Go Back</button><br>";

    // Generate buttons for each player
    for (var i = 0; i < team.length; i++) {
        managerDashboard.innerHTML += "<p>" + team[i].name + " (Accuracy: " + team[i].accuracy + "%)</p>";
        managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='removePlayer(" + i + ")'>Remove Player</button>";
        managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='benchPlayer(" + i + ")'>Bench Player</button><br>";
    }

    // Display benched players if there are any
    if (benched.length > 0) {
        managerDashboard.innerHTML += "<br>Benched:<br>";
        benched.forEach(function(player, index) {
            managerDashboard.innerHTML += "<p>" + player.name + " (Accuracy: " + player.accuracy + "%)</p>";
            managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='unbenchPlayer(" + index + ")'>Unbench Player</button><br>";
        });
    }
}

// Remove a player from the team
function removePlayer(index) {
    // Remove the player from the team
    team.splice(index, 1);

    // Update the roster display
    displayRoster();

    // Return to the edit team menu
    editTeam();
}

// Bench a player
function benchPlayer(index) {
    // Move the player from the team to the bench
    benched.push(team[index]);
    team.splice(index, 1);

    // Update the roster display
    displayRoster();

    // Return to the edit team menu
    editTeam();
}

// Unbench a player
function unbenchPlayer(index) {
    // Move the player from the bench to the team
    team.push(benched[index]);
    benched.splice(index, 1);

    // Update the roster display
    displayRoster();

    // Return to the edit team menu
    editTeam();
}

// Go back to the previous screen
function goBack() {
    var managerDashboard = document.getElementById("match-section");
    managerDashboard.innerHTML = "<h3>Manager Dashboard</h3>";
    managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='playMatch()'>Play Match</button><br>";
    managerDashboard.innerHTML += "<button class='btn btn-primary' onclick='editTeam()'>Edit Team</button><br>";
}

// Call createTeam when the page loads
window.onload = createTeam;