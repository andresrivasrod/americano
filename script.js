let players = [];
let matches = [];
let currentRound = 0;

function addPlayer() {
    const playerName = document.getElementById("playerName").value;
    if (playerName.trim() !== "") {
        players.push({ name: playerName, points: 0 });
        document.getElementById("playersList").innerHTML += `<p>${playerName}</p>`;
        document.getElementById("playerName").value = "";
    }
}

function generateMatches() {
    matches = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matches.push({ home: players[i], away: players[j], homeScore: 0, awayScore: 0 });
        }
    }
}

function playRound() {
    generateMatches();
    let roundHTML = "<h2>Jornada Actual:</h2>";
    matches.forEach((match, index) => {
        roundHTML += `<p>Partido ${index + 1}: ${match.home.name} vs ${match.away.name} - Resultado: 
                      ${match.home.name} <input type="number" id="match${index}-home" min="0"> -
                      ${match.away.name} <input type="number" id="match${index}-away" min="0"></p>`;
    });
    roundHTML += "<button onclick='updateResults()'>Actualizar Resultados</button>";
    document.getElementById("results").innerHTML = roundHTML;
}

function updateResults() {
    matches.forEach((match, index) => {
        const homeScore = parseInt(document.getElementById(`match${index}-home`).value);
        const awayScore = parseInt(document.getElementById(`match${index}-away`).value);
        
        if (homeScore >= 0 && awayScore >= 0) {
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.home.points += homeScore;
            match.away.points += awayScore;
        }
    });
    
    updateStandings();
}

function updateStandings() {
    players.sort((a, b) => b.points - a.points);
    
    let standingsHTML = "<h2>Tabla de Posiciones:</hjson>";
    players.forEach((player, index) => {
        standingsHTML += `<p>${index + 1}. ${player.name} - Puntos: ${player.points}</p>`;
    });
    
    document.getElementById("playersList").innerHTML = standingsHTML;
}

function navigateRound(direction) {
    currentRound += direction;
    
    if (currentRound <= 0) {
        document.getElementById("prevRound").style.display = "none";
    } else {
        document.getElementById("prevRound").style.display = "block";
    }
    
    if (currentRound >= matches.length) {
        document.getElementById("nextRound").style.display = "none";
    } else {
        document.getElementById("nextRound").style.display = "block";
    }
    
    playRound(currentRound);
}

function startTournament() {
    playRound();
}