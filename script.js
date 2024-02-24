let players = [];
let matches = [];
let currentRound = 1;
let tournamentStarted = false;

function addPlayer() {
    const playerName = document.getElementById("playerName").value;
    if (playerName.trim() !== "") {
        players.push({ name: playerName, points: 0 });
        updateStandings();
    }
}

function updateStandings() {
    players.sort((a, b) => b.points - a.points);

    const standingsTable = document.getElementById("standings");
    standingsTable.innerHTML = `
        <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Puntos</th>
        </tr>
    `;

    players.forEach((player, index) => {
        const row = standingsTable.insertRow(-1);
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = player.name;
        row.insertCell(2).textContent = player.points;
    });
}

function playTournament() {
    generateMatches();
    displayMatchesByRound();
    document.getElementById("playerName").style.display = "none";
    document.getElementById("playerName").previousElementSibling.style.display = "none"; // Ocultar el texto "Jugadores:"
    document.querySelector("button").style.display = "none"; // Ocultar el botón "Agregar Jugador"
    document.querySelectorAll("button")[1].style.display = "none"; // Ocultar el botón "Iniciar Torneo"
}

function generateMatches() {
    matches = [];

    let numPlayers = players.length;

    if (numPlayers % 2 !== 0) {
        alert("El número de jugadores debe ser par para formar los enfrentamientos correctamente.");
        return;
    }

    let playerIndices = [...Array(numPlayers).keys()]; // Array de índices de jugadores

    for (let round = 1; round < numPlayers; round++) {
        let roundMatches = [];

        for (let i = 0; i < numPlayers / 2; i++) {
            let homeIndex = playerIndices[i];
            let awayIndex = playerIndices[numPlayers - 1 - i];

            roundMatches.push({ home: players[homeIndex], away: players[awayIndex], homeScore: 0, awayScore: 0 });
        }

        // Rotar los índices de los jugadores para la siguiente ronda
        playerIndices.splice(1, 0, playerIndices.pop());

        matches.push(roundMatches);
    }
}

function updateResults() {
    players.forEach(player => player.points = 0); // Reiniciar los puntos de todos los jugadores antes de recalcularlos

    matches.forEach(roundMatches => {
        roundMatches.forEach(match => {
            const homeScore = parseInt(document.getElementById(`match${match.home.name}-${match.away.name}-home`).value);
            const awayScore = parseInt(document.getElementById(`match${match.home.name}-${match.away.name}-away`).value);

            if (!isNaN(homeScore) && !isNaN(awayScore)) {
                match.homeScore = homeScore;
                match.awayScore = awayScore;
                match.home.points += homeScore;
                match.away.points += awayScore;
            }
        });
    });

    updateStandings(); // Actualizar la tabla de posiciones después de cada partido
}

function displayMatchesByRound() {
    let matchesHTML = "";

    matches.forEach((roundMatches, roundIndex) => {
        matchesHTML += `<h2>Jornada ${roundIndex + 1}:</h2>`;

        roundMatches.forEach((match, matchIndex) => {
            matchesHTML += `<p>Partido ${matchIndex + 1}: ${match.home.name} vs ${match.away.name} - Resultado:
                            ${match.home.name} <input type="number" id="match${match.home.name}-${match.away.name}-home" min="0"> -
                            ${match.away.name} <input type="number" id="match${match.home.name}-${match.away.name}-away" min="0"></p>`;
        });
    });

    document.getElementById("results").innerHTML = matchesHTML;

    matches.forEach((roundMatches, roundIndex) => {
        roundMatches.forEach((match, matchIndex) => {
            document.getElementById(`match${match.home.name}-${match.away.name}-home`).addEventListener('input', updateResults);
            document.getElementById(`match${match.home.name}-${match.away.name}-away`).addEventListener('input', updateResults);
        });
    });
}
